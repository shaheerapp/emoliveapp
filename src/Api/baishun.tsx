import axios from 'axios';
import md5 from 'crypto-js/md5';


const APP_KEY = '7ZU6mWw61JxXGGENJUCtxCP63D6rSjiZ';
// const BASE_URL = 'https://game-cn-test.jieyou.shop';
const BASE_URL = 'https://bysk.gameapi.gg.jieyou.shop';
const SERVER_BASE_URL = 'https://emolivestreaming.com';


function generateSignature(signatureNonce: string, timestamp: number): string {
    return md5(signatureNonce + APP_KEY + timestamp).toString();
}


// 🔐 UUID-like nonce for uniqueness (non-repeating in 15s)
function generateNonce(): string {
    const hex = () =>
        Math.floor(Math.random() * 0xffffffff)
            .toString(16)
            .padStart(8, '0');
    return hex();
}

const signature_nonce = generateNonce();
const timestamp = Math.floor(Date.now() / 1000);
const signature = generateSignature(signature_nonce, timestamp);


export const fetchGameList = async (appId: number, appChannel: string) => {


    const res = await axios.post(`${BASE_URL}/v1/api/gamelist`, {
        game_list_type: 3, // 2: games, 3: show
        app_channel: appChannel,
        app_id: appId,
        signature,
        signature_nonce,
        timestamp,
    });

    return res.data.data;
};



export const generateCode = async (user_id: any) => {
    try {
        const response = await axios.get(`${SERVER_BASE_URL}/get_code`, {
            params: {
                user_id,
            },
        });

        const data = response.data;

        if (response.status === 200 && data.temp_code) {
            return data.temp_code;
        } else {
            console.error('Error:', data.message || 'Failed to get temp code');
        }
    } catch (error) {
        console.error('Fetch failed:', error);
    }
};
