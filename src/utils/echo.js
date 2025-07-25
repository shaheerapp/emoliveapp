import Echo from 'laravel-echo';
// import pusher
// import {io} from 'socket.io-client';
// import socketio
import socketio from 'socket.io-client';

// Initialize Laravel Echo with Reverb
const echo = new Echo({
  // broadcaster: 'reverb',
  broadcaster: 'socket.io',
  // Pusher,
  key: 'xjceygqczxvyasqh0c2d', // Replace with your Reverb app key
  host: 'localhost:8080',
  // host: 'ws://192.168.43.238:8080',
  // wsHost: 'localhost', // Replace with your Reverb server host
  // wsHost: '192.168.10.2', // Replace with your Reverb server host
  // wsHost: 'http://localhost', // Replace with your Reverb server host
  // wsPort: 8080, // Replace with your Reverb server port
  forceTLS: false, // Set to true if using SSL
  disableStats: true, // Disable stats collection
  transports: ['websocket'],

  // auth: {
  //   headers: {
  //     Authorization: 'Bearer ' + this.props.token,
  //   },
  // },
  client: socketio,

  // client: io, // Use the Socket.IO client
});

export default echo;

// {
//   "event": "pusher:subscribe",
//   "data": {
//       "auth": "",
//       "channel": "chat-channel"
//   }
// }
// {
//   "event": "pusher:unsubscribe",
//   "data": {
//       "auth": "",
//       "channel": "chat-channel"
//   }
// }
