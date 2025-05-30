const express = require('express');
const md5 = require('md5');
const uuidv1 = require('uuid').v1;
const uuidv4 = require('uuid').v4;
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(cors());

const port = 3000;

// ✅ FIX: Maps declared at top to persist globally
const myCodeMap = new Map(); // code -> user_id
const mySstokenMap = new Map(); // sstoken -> { user_id, expire }
const userBalanceMap = new Map();
const APP_KEY = 'N9DsdEeL5ogmlBwBUAVoN8is61Zco5cv';

const API_BASE_URL = 'https://www.emolivestreaming.online/api';

function makeSign(signature_nonce, timestamp) {
  return md5(`${signature_nonce}${APP_KEY}${timestamp}`);
}

app.get('/', (req, res) => {
  res.send('Game Server Online!');
});

app.get('/get_code', (req, res) => {
  const {user_id} = req.query;

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

    return res.status(200).json({
      code: resCode,
      message: msg,
      unique_id: uid,
      data: {
        user_id: tokenInfo.user_id,
        user_name: user.first_name || 'No Name',
        user_avatar: user.avatar || 'https://example.com/default-avatar.png',
        balance: user.wallet?.diamonds ?? 0,
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

app.post('/change-balance', (req, res) => {
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
      .json({code: resCode, message: msg, unique_id: uid, data: {}});
  }

  const tokenData = mySstokenMap.get(jsonData.ss_token);
  if (!tokenData || tokenData.expire < Date.now()) {
    resCode = 1001;
    msg = 'ss_token not found or expired';
    mySstokenMap.delete(jsonData.ss_token);
    return res
      .status(400)
      .json({code: resCode, message: msg, unique_id: uid, data: {}});
  }

  const userId = jsonData.user_id;
  const currencyDiff = parseFloat(jsonData.currency_diff);

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
        data: {currency_balance: userBalanceMap.get(userId)},
      });
  }

  // Update balance
  const updatedBalance = userBalanceMap.get(userId) + currencyDiff;
  userBalanceMap.set(userId, updatedBalance);
  userBalanceMap.set(orderKey, true); // Mark order as processed

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
      .json({code: resCode, message: msg, unique_id: uid, data: {}});
  }

  return res
    .status(200)
    .json({code: resCode, message: msg, unique_id: uid, data: {}});
});

app.listen(process.env.PORT || port, () => {
  console.log(`Game server running at http://localhost:${port}`);
});
