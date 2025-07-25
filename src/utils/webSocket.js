class WebSocketService {
  static instance = null;
  socket = null;
  eventListeners = {};
  url = '';
  authToken = '';
  retryCount = 0;
  maxRetries = 5; // Limit reconnection attempts

  constructor() {
    if (WebSocketService.instance) {
      throw new Error('Use WebSocketService.getInstance() instead of new.');
    }
  }

  static getInstance() {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  connect(url, authToken) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log('✅ WebSocket already connected.');
      return;
    }

    this.url = url;
    this.authToken = authToken;

    this.socket = new WebSocket(`${url}?token=${authToken}`);

    this.socket.onopen = () => {
      console.log('✅ Connected to WebSocket server');
      this.retryCount = 0; // Reset retry count on successful connection
    };

    this.socket.onmessage = event => {
      try {
        const {event: eventType, data} = JSON.parse(event.data);
        console.log(`📩 Received event: ${eventType}`, data);

        if (this.eventListeners[eventType]) {
          this.eventListeners[eventType].forEach(callback => callback(data));
        }
      } catch (error) {
        console.error('❌ WebSocket message parsing error:', error);
      }
    };

    this.socket.onerror = error => {
      console.error('❌ WebSocket Error:', error);
    };

    this.socket.onclose = () => {
      console.log('❌ WebSocket connection closed.');
      this.socket = null;

      // if (this.retryCount < this.maxRetries) {
      //   this.retryCount++;
      //   console.log(`🔄 Reconnecting in 5s... (Attempt ${this.retryCount})`);
      //   setTimeout(() => this.connect(this.url, this.authToken), 5000);
      // } else {
      //   console.error('❌ Max reconnection attempts reached.');
      // }
    };
  }

  sendMessage(event, data) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({event, data}));
      console.log(`📤 Sent event: ${event}`, data);
    } else {
      console.error('❌ WebSocket is not connected.');
    }
  }

  disconnect() {
    if (this.socket) {
      console.log('🔌 Disconnecting WebSocket...');
      this.socket.close();
      this.socket = null;
    }
  }

  addListener(eventType, callback) {
    if (!this.eventListeners[eventType]) {
      this.eventListeners[eventType] = [];
    }
    this.eventListeners[eventType].push(callback);
  }

  removeListener(eventType, callback) {
    if (this.eventListeners[eventType]) {
      this.eventListeners[eventType] = this.eventListeners[eventType].filter(
        listener => listener !== callback,
      );
    }
  }
}

export default WebSocketService.getInstance();
