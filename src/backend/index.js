const express = require('express');
const md5 = require('md5');
const uuidv1 = require('uuid').v1;
const uuidv4 = require('uuid').v4;
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const port = 3000;

// ✅ FIX: Maps declared at top to persist globally
const myCodeMap = new Map();           // code -> user_id
const mySstokenMap = new Map();        // sstoken -> { user_id, expire }
const APP_KEY = 'N9DsdEeL5ogmlBwBUAVoN8is61Zco5cv';

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
      mySstokenMap.set(ss_token, { user_id: jsonData.user_id, expire: expire_date });

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


app.post('/get-user-info', (req, res) => {
  const jsonData = req.body;
  const uid = uuidv1();
  let resCode = 0;
  let msg = 'succeed'; // <-- updated to match image

  const sign = makeSign(jsonData.signature_nonce, jsonData.timestamp);
  if (sign !== jsonData.signature) {
    return res.status(400).json({
      code: 1003,
      message: 'sign error',
      unique_id: uid,
      data: {},
    });
  }

  // console.log('Looking for token:', jsonData.ss_token);
  // console.log('Stored tokens:', Array.from(mySstokenMap.keys()));

  if (mySstokenMap.has(jsonData.ss_token)) {
    const sstokenInfo = mySstokenMap.get(jsonData.ss_token);

    if (sstokenInfo.expire < Date.now()) {
      resCode = 1001;
      msg = 'sstoken expired';
      mySstokenMap.delete(jsonData.ss_token);
    } else {
      // Return full user info object (replace these values with real data if available)
      return res.status(200).json({
        code: 0,
        message: 'succeed',
        unique_id: uid,
        data: {
          user_id: sstokenInfo.user_id,
          user_name: 'tom',            // placeholder, replace with real user data
          user_avatar: 'avatar.com',   // placeholder
          balance: 1000,               // placeholder
        },
      });
    }
  } else {
    resCode = 1001;
    msg = 'sstoken not found';
  }

  return res.status(200).json({
    code: resCode,
    message: msg,
    unique_id: uid,
    data: {},
  });
});



app.post('/change-blance', (req, res) => {
  const jsonData = req.body;
  const uid = uuidv1();
  let resCode = 0;
  let msg = 'success';

  console.log('change_blance Received data:', jsonData);

  const sign = makeSign(jsonData.signature_nonce, jsonData.timestamp);
  if (sign !== jsonData.signature) {
    resCode = 1003;
    msg = 'sign error';
    return res.status(400).json({ code: resCode, message: msg, unique_id: uid, data: {} });
  }

  if (!mySstokenMap.has(jsonData.sstoken)) {
    resCode = 1001;
    msg = 'sstoken not found';
    return res.status(400).json({ code: resCode, message: msg, unique_id: uid, data: {} });
  }

  const sstokenInfo = mySstokenMap.get(jsonData.sstoken);
  if (sstokenInfo.expire < Date.now()) {
    resCode = 1001;
    msg = 'sstoken expired';
    mySstokenMap.delete(jsonData.sstoken);
    return res.status(400).json({ code: resCode, message: msg, unique_id: uid, data: {} });
  }

  console.log('Change:', jsonData.change);
  return res.status(200).json({ code: resCode, message: msg, unique_id: uid, data: {} });
});

app.post('/update-sstoken', (req, res) => {
  const jsonData = req.body;
  const uid = uuidv1();
  let resCode = 0;
  let msg = 'success';

  console.log('update_sstoken Received data:', jsonData);

  const sign = makeSign(jsonData.signature_nonce, jsonData.timestamp);
  if (sign !== jsonData.signature) {
    resCode = 1003;
    msg = 'sign error';
    return res.status(400).json({ code: resCode, message: msg, unique_id: uid, data: {} });
  }

  const old_token = jsonData.ss_token;
  if (mySstokenMap.has(old_token)) {
    const token_info = mySstokenMap.get(old_token);
    mySstokenMap.delete(old_token);
    const sstoken = uuidv4();
    const expire_date = Date.now() + 1000 * 60 * 60 * 24;
    mySstokenMap.set(sstoken, { user_id: token_info.user_id, expire: expire_date });

    return res.status(200).json({
      code: resCode,
      message: msg,
      unique_id: uid,
      data: { sstoken, expire_date },
    });
  } else {
    resCode = 1001;
    msg = 'sstoken not found';
  }

  return res.status(200).json({ code: resCode, message: msg, unique_id: uid, data: {} });
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
    return res.status(400).json({ code: resCode, message: msg, unique_id: uid, data: {} });
  }

  return res.status(200).json({ code: resCode, message: msg, unique_id: uid, data: {} });
});

app.listen(process.env.PORT || port, () => {
  console.log(`Game server running at http://localhost:${port}`);
});
