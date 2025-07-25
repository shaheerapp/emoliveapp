const express = require('express');
const http = require('http'); // ← Required for Socket.IO
const cors = require('cors');
const { Server } = require('socket.io');
const md5 = require('md5');
const uuidv1 = require('uuid').v1;
const uuidv4 = require('uuid').v4;
const axios = require('axios');


const app = express();
app.use(express.json());
app.use(cors());
const server = http.createServer(app); // ← Create HTTP server for both Express & Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
    skipMiddlewares: true,
  },
});

// Track connected users and their rooms
const userConnections = new Map(); // userId -> socketId

io.on('connection', (socket) => {
  const { roomId, userId, isHost } = socket.handshake.query;

  if (!roomId || !userId) {
    console.log('Missing roomId or userId in query');
    return socket.disconnect(true);
  }

  // Store user connection
  userConnections.set(userId, {
    socketId: socket.id,
    roomId: roomId,
    isHost: isHost === 'true',
  });


  console.log(`User ${userId} (${isHost ? 'Host' : 'Guest'}) connected to room ${roomId}`);

  // Join the room
  socket.join(roomId);

  if (isHost === true) {
    socket.join(`podcast-${roomId}`);
    console.log(`Host ${userId} joined podcast room ${roomId}`);
  }

  // Handle podcast join requests
  socket.on('join-request', (data) => {
    console.log('Received join request:', data);

    if (!data.podcastId || !data.userId) {
      return console.error('Invalid join request:', data);
    }

    // Broadcast to host in the podcast room
    io.to(`podcast-${data.podcastId}`).emit('new-join-request', {
      ...data,
      timestamp: Date.now(),
    });
  });

  // Handle user approvals
  socket.on('approve-user', (data) => {
    console.log('Received approval request:', data);

    if (!data.podcastId || !data.userId || !data.channelId) {
      return console.error('Invalid approval data:', data);
    }

    console.log('userConnections:', userConnections);
    const userIdString = String(data.userId);
    const guestConn = userConnections.get(userIdString);

    if (guestConn) {
      io.to(guestConn.socketId).emit(`user-approved-${data.userId}`, {
        podcastId: data.podcastId,
        channelId: data.channelId,
      });
      console.log(`Approval sent to user: user-approved-${data.userId}. Socket ID: ${guestConn.socketId}`);
    } else {
      console.error(`Guest socket not found for user ${data.userId}`);
    }
  });

  socket.on('reject-user', (data) => {
    console.log('Received rejection request:', data);

    if (!data.podcastId || !data.userId) {
      return console.error('Invalid rejection data:', data);
    }

    const userIdString = String(data.userId);
    const guestConn = userConnections.get(userIdString);

    if (guestConn) {
      // Send to specific user
      io.to(guestConn.socketId).emit(`user-rejected-${data.userId}`, {
        podcastId: data.podcastId,
        rejectedBy: data.rejectedBy,
        timestamp: data.timestamp,
      });

      console.log(`Rejection sent to user ${data.userId}`);
    } else {
      console.error(`Guest socket not found for user ${data.userId}`);
    }

    // Broadcast general event to host
    io.to(`podcast-${data.podcastId}`).emit('user-rejected', {
      userId: data.userId,
      podcastId: data.podcastId,
    });
  });

  // Join podcast-specific room (for hosts)
  socket.on('join-podcast-room', (podcastId) => {
    if (!podcastId) {
      return console.error('Invalid podcastId for room join');
    }
    socket.join(`podcast-${podcastId}`);
    console.log(`User ${socket.handshake.query.userId} joined podcast room ${podcastId}`);
  });

  // Server-side Socket.IO handler
  socket.on('lock-seat', async (data) => {
    const { seatNo, locked, podcastId, userId } = data;

    // Verify user is host (optional security check)
    if (!isHost) {
      return socket.emit('error', 'Only host can lock seats');
    }
    // Broadcast to all other clients in the room
    socket.to(`podcast-${podcastId}`).emit('seat-locked', { seatNo, locked });
    console.log(`Seat ${seatNo} ${locked ? 'locked' : 'unlocked'} by host ${userId}`);
  });

  socket.on('bulk-lock-seat', async (data) => {
    const { seats, podcastId, userId } = data;
    console.log('✅ Received bulk-seats:', seats);
    // Broadcast to all other clients in the room
    socket.to(`podcast-${podcastId}`).emit('bulk-seat-locked', {
      seats,
    });
  });

  socket.on('comment-sent', async (data) => {
    const { podcastId, userId, name, message, avatar } = data;

    if (!podcastId || !message || !name) {
      return console.warn('Invalid comment-sent payload:', data);
    }

    console.log(`💬 Comment from ${name} in podcast ${podcastId}:`, message);

    // Broadcast to everyone *except* sender
    socket.to(`podcast-${podcastId}`).emit('receive-comment', {
      userId,
      name,
      message,
      avatar,
    });
  });

  // Handle host mute updates
  socket.on('host-mute-updated', (data) => {
    const { hostId, muted, podcastId } = data;

    // Validate the data
    if (!hostId || !podcastId || typeof muted !== 'boolean') {
      console.error('Invalid host mute data:', data);
      return;
    }

    if (!isHost) {
      console.error('Non-host attempted to send mute update:', hostId);
      return;
    }

    console.log(`Host ${hostId} ${muted ? 'muted' : 'unmuted'} in podcast ${podcastId}`);

    // Broadcast to all users in the podcast room except the sender
    socket.to(`podcast-${podcastId}`).emit('host-mute-updated', {
      hostId,
      muted,
      timestamp: Date.now()
    });

  });

  // Handle user mute updates
  socket.on('user-mute-updated', (data) => {
    const { seatNo, userID, muted, podcastId } = data;
    console.log('user-mute-updated revceied', userId);

    // Validate the data
    if ((!seatNo && !userId) || !podcastId || typeof muted !== 'boolean') {
      console.error('Invalid mute data:', data);
      return;
    }

    console.log(`User ${userID || 'seat ' + seatNo} ${muted ? 'muted' : 'unmuted'} in podcast ${podcastId}`);

    // Broadcast to all users in the podcast room including sender
    socket.to(`podcast-${podcastId}`).emit('user-mute-updated', {
      seatNo,
      userId,
      muted,
      timestamp: Date.now()
    });
  });

  socket.on('force-leave-user', (data) => {
    const { userId, podcastId } = data;

    if (!userId || !podcastId) {
      console.error('Invalid force-leave-user data:', data);
      return;
    }

    const targetConn = userConnections.get(String(userId));

    if (targetConn) {
      // Send a direct message to the user to leave
      io.to(targetConn.socketId).emit('force-leave-user', {
        userId,
        podcastId,
        timestamp: Date.now(),
      });

      console.log(`⚠️ Kicked user ${userId} from podcast ${podcastId}`);
    } else {
      console.warn(`❌ No socket found for user ${userId} when trying to force leave`);
    }
  });

  socket.on('request-seat-state', (data) => {
    const { requesterId } = data;
    console.log('request-seat-state revceied', requesterId);

    // Find host of the room
    const hostEntry = Array.from(userConnections.values()).find(
      entry => entry.roomId === roomId && entry.isHost === true
    );

    if (!hostEntry) {
      console.error(`No host found for room ${roomId}`);
      return;
    }

    // Relay the request to host socket
    io.to(hostEntry.socketId).emit('provide-seat-state', { requesterId });
    console.log('request-seat-state sent by server', hostEntry.socketId);
  });

  socket.on('send-seat-state-to-server', ({ to, seatStates }) => {
    console.log(`received ${seatStates}`);
    io.to(to).emit('initial-seat-state', { to, seatStates });
    console.log(`Seat state relayed to ${to}`);
  });


  // Server-side socket handler
  socket.on('emoji-selected', (data) => {
    console.log('[Emoji] Received from:', data.userId, 'Data:', data);

    // Validate data
    if (!data.userId || !data.emoji || !data.podcastId || !data.timestamp) {
      return console.error('Invalid emoji data');
    }

    // Broadcast to all clients in the room
    socket.to(`podcast-${data.podcastId}`).emit('emoji-received', {
      userId: data.userId,
      emoji: data.emoji,
      timestamp: data.timestamp || Date.now()
    });
  });

  socket.on('gift_sent', (data) => {
    const { gift_image, amount, podcast_id, receiver_id } = data;

    if (!podcast_id || !receiver_id || !gift_image || !amount) {
      return console.error('Invalid gift_sent payload:', data);
    }

    console.log(`🎁 Gift sent in podcast ${podcast_id} to user ${receiver_id}. Amount: ${amount}`);

    // Broadcast to everyone in the podcast room (including sender)
    io.to(`podcast-${podcast_id}`).emit('gift_received', {
      gift_image,
      amount,
      podcast_id,
      receiver_id,
      timestamp: Date.now()
    });
  });


  socket.on('wallpaper-changed-sent', (data) => {
    console.log("Wallpaper change received from host:", data);

    socket.to(`podcast-${data.podcastId}`).emit('wallpaper-changed-receive', {
      ...data,
      timestamp: Date.now()
    });
    console.log(`Wallpaper change send to ${data.podcastId}: `, data);

  });

  // Handle disconnection
  socket.on('disconnect', (reason) => {
    console.log(`User ${userId} disconnected (Reason: ${reason})`);

    // Clean up user tracking
    userConnections.delete(userId);
  });

  // Error handling
  socket.on('error', (err) => {
    console.error(`Socket error for user ${userId}:`, err);
  });
});


// ✅ FIX: Maps declared at top to persist globally
const myCodeMap = new Map(); // code -> user_id
const mySstokenMap = new Map(); // sstoken -> { user_id, expire }
const userBalanceMap = new Map();
const APP_KEY = '7ZU6mWw61JxXGGENJUCtxCP63D6rSjiZ';

const API_BASE_URL = 'https://www.emolivestreaming.online/api';

function makeSign(signature_nonce, timestamp) {
  return md5(`${signature_nonce}${APP_KEY}${timestamp}`);
}

app.get('/', (req, res) => {
  res.send('Game Server Online!');
});

app.get('/get_code', (req, res) => {
  const { user_id } = req.query;

  // Validate required param
  if (!user_id) {
    return res.status(400).json({
      code: 1001,
      message: 'Missing user_id',
    });
  }

  const code = uuidv1();
  myCodeMap.set(code, user_id);

  console.log('get_code user_id:', user_id, ',code:', code);
  console.log('get-code myCodeMap:', myCodeMap);

  return res.status(200).json({
    code: 0,
    message: 'Code generated successfully',
    temp_code: code,
  });
});

// ✅ Get SS Token
app.post('/get-sstoken', (req, res) => {
  const jsonData = req.body;
  const uid = uuidv1();
  let resCode = 0;
  let msg = 'succeed';

  console.log('get-sstoken req: ', jsonData);
  console.log('get-sstoken code: ', jsonData.code);
  console.log('get-sstoken myCodeMap:', myCodeMap);

  const sign = makeSign(jsonData.signature_nonce, jsonData.timestamp);
  if (sign !== jsonData.signature) {
    return res.status(400).json({
      code: 1003,
      message: 'sign error',
      unique_id: uid,
      data: {},
    });
  }

  if (myCodeMap.has(jsonData.code)) {
    const storedUserId = myCodeMap.get(jsonData.code);

    if (String(storedUserId) !== String(jsonData.user_id)) {
      resCode = 1001;
      msg = 'user_id mismatch';
    } else {
      myCodeMap.delete(jsonData.code);
      const ss_token = uuidv4();
      const expire_date = Date.now() + 1000 * 60 * 60 * 24;

      // ✅ Save to map
      mySstokenMap.set(ss_token, {
        user_id: jsonData.user_id,
        expire: expire_date,
      });

      return res.status(200).json({
        code: 0,
        message: 'succeed',
        unique_id: uid,
        data: {
          ss_token: ss_token,
          expire_date: expire_date,
        },
      });
    }
  } else {
    resCode = 1001;
    msg = 'code not found';
  }

  return res.status(200).json({
    code: resCode,
    message: msg,
    unique_id: uid,
    data: {},
  });
});

app.post('/get-user-info', async (req, res) => {
  const jsonData = req.body;
  const uid = uuidv1();
  let resCode = 0;
  let msg = 'succeed';

  const sign = makeSign(jsonData.signature_nonce, jsonData.timestamp);
  if (sign !== jsonData.signature) {
    return res.status(400).json({
      code: 1003,
      message: 'sign error',
      unique_id: uid,
      data: {},
    });
  }

  const tokenInfo = mySstokenMap.get(jsonData.ss_token);
  if (!tokenInfo) {
    return res.status(200).json({
      code: 1001,
      message: 'sstoken not found',
      unique_id: uid,
      data: {},
    });
  }

  if (tokenInfo.expire < Date.now()) {
    mySstokenMap.delete(jsonData.ss_token);
    return res.status(200).json({
      code: 1001,
      message: 'sstoken expired',
      unique_id: uid,
      data: {},
    });
  }

  try {
    const userResponse = await axios.get(
      `${API_BASE_URL}/public-user-info/${tokenInfo.user_id}`,
    );

    const user = userResponse.data.user;

    userBalanceMap.set(tokenInfo.user_id, parseInt(user.wallet?.diamonds, 10));

    return res.status(200).json({
      code: resCode,
      message: msg,
      unique_id: uid,
      data: {
        user_id: tokenInfo.user_id,
        user_name: user.first_name || 'No Name',
        user_avatar: user.avatar || '',
        balance: parseInt(user.wallet?.diamonds, 10) || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching user info:', error.message);
    return res.status(500).json({
      code: 500,
      message: 'Failed to fetch user info',
      unique_id: uid,
      data: {},
    });
  }
});

app.post('/change-balance', async (req, res) => {
  const jsonData = req.body;
  const uid = uuidv1();
  let resCode = 0;
  let msg = 'succeed';

  console.log('change_balance Received data:', jsonData);

  const sign = makeSign(jsonData.signature_nonce, jsonData.timestamp);
  if (sign !== jsonData.signature) {
    resCode = 1003;
    msg = 'sign error';
    return res
      .status(400)
      .json({ code: resCode, message: msg, unique_id: uid, data: {} });
  }

  const tokenData = mySstokenMap.get(jsonData.ss_token);
  if (!tokenData || tokenData.expire < Date.now()) {
    resCode = 1001;
    msg = 'ss_token not found or expired';
    mySstokenMap.delete(jsonData.ss_token);
    return res
      .status(400)
      .json({ code: resCode, message: msg, unique_id: uid, data: {} });
  }

  const userId = jsonData.user_id;
  const currencyDiff = parseFloat(jsonData.currency_diff);
  const diff_msg = jsonData.diff_msg;

  if (diff_msg === 'result') {
    io.emit('user-wins', {
      userId,
      amount: currencyDiff,
    });
  }

  if (!userBalanceMap.has(userId)) {
    userBalanceMap.set(userId, 1000); // Default starting balance
  }

  // Prevent duplicate settlement if order already exists
  const orderKey = `order_${jsonData.order_id}`;
  if (userBalanceMap.has(orderKey)) {
    return res
      .status(200)
      .json({
        code: 0,
        message: 'already settled',
        unique_id: uid,
        data: { currency_balance: userBalanceMap.get(userId) },
      });
  }

  // Update balance
  const updatedBalance = userBalanceMap.get(userId) + currencyDiff;
  userBalanceMap.set(userId, updatedBalance);
  userBalanceMap.set(orderKey, true); // Mark order as processed

  await axios.post(
    `${API_BASE_URL}/update-wallet-diamonds/${userId}`,
    { diamonds: Math.floor(updatedBalance) },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );


  return res.status(200).json({
    code: resCode,
    message: msg,
    unique_id: uid,
    data: {
      currency_balance: updatedBalance,
    },
  });
});

app.post('/update-sstoken', (req, res) => {
  const jsonData = req.body;
  const uid = uuidv1();

  let resCode = 0;
  let msg = 'succeed';

  console.log('update_sstoken req:', jsonData);

  // Required fields
  const requiredFields = [
    'app_id',
    'user_id',
    'ss_token',
    'signature',
    'signature_nonce',
    'timestamp',
  ];

  for (const field of requiredFields) {
    if (!jsonData[field]) {
      return res.status(400).json({
        code: 1002,
        message: `Missing parameter: ${field}`,
        unique_id: uid,
        data: {},
      });
    }
  }

  // Signature validation
  const sign = makeSign(jsonData.signature_nonce, jsonData.timestamp);
  if (sign !== jsonData.signature) {
    return res.status(400).json({
      code: 1003,
      message: 'sign error',
      unique_id: uid,
      data: {},
    });
  }

  const oldToken = jsonData.ss_token;

  if (mySstokenMap.has(oldToken)) {
    const tokenInfo = mySstokenMap.get(oldToken);

    // Ensure token is owned by the user
    if (tokenInfo.user_id !== jsonData.user_id) {
      return res.status(400).json({
        code: 1001,
        message: 'user_id mismatch',
        unique_id: uid,
        data: {},
      });
    }

    mySstokenMap.delete(oldToken); // Invalidate old token

    const newToken = uuidv4();
    const expireDate = Date.now() + 1000 * 60 * 60 * 24; // 24 hours

    mySstokenMap.set(newToken, {
      user_id: jsonData.user_id,
      expire: expireDate,
    });

    return res.status(200).json({
      code: resCode,
      message: msg,
      unique_id: uid,
      data: {
        ss_token: newToken,
        expire_date: expireDate,
      },
    });
  } else {
    return res.status(400).json({
      code: 1001,
      message: 'ss_token not found',
      unique_id: uid,
      data: {},
    });
  }
});

app.post('/report-game-status', (req, res) => {
  const jsonData = req.body;
  const uid = uuidv1();
  let resCode = 0;
  let msg = 'success';

  console.log('report_game_status Received data:', jsonData);

  const sign = makeSign(jsonData.signature_nonce, jsonData.timestamp);
  if (sign !== jsonData.signature) {
    resCode = 1003;
    msg = 'sign error';
    return res
      .status(400)
      .json({ code: resCode, message: msg, unique_id: uid, data: {} });
  }

  return res
    .status(200)
    .json({ code: resCode, message: msg, unique_id: uid, data: {} });
});

const port = 3000;
server.listen(process.env.PORT || port, () => {
  console.log(`Game server with Socket.IO running at http://localhost:${port}`);
});
