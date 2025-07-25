/**
 * Singleton WebSocketService class to manage WebSocket connections.
 */
class WebSocketService {
  private static instance: WebSocketService | null = null;
  private socket: WebSocket | null = null;
  private eventListeners: {[key: string]: Array<(data: any) => void>} = {};

  /**
   * Private constructor to prevent direct instantiation.
   */
  private constructor() {}

  /**
   * Gets the singleton instance of the WebSocketService.
   * @returns {WebSocketService} The singleton instance.
   */
  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  /**
   * Connects to the WebSocket server.
   * @param {string} url - The WebSocket server URL.
   * @param {string} authToken - The authentication token.
   */
  public connect(url: string, authToken: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log('WebSocket is already connected.');
      return;
    }

    this.socket = new WebSocket(`${url}?token=${authToken}`);

    this.socket.onopen = () => {
      console.log('✅ Connected to WebSocket server');
    };

    this.socket.onmessage = (event: any) => {
      // this.socket.onmessage = (event: MessageEvent) => {
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

    this.socket.onerror = (error: Event) => {
      console.error('❌ WebSocket Error:', error);
    };

    this.socket.onclose = () => {
      console.log('❌ WebSocket connection closed, attempting to reconnect...');
      this.socket = null;
      setTimeout(() => this.connect(url, authToken), 5000); // Reconnect after 5 seconds
    };
  }

  /**
   * Sends a message through the WebSocket connection.
   * @param {string} event - The event type to send.
   * @param {any} data - The data to send with the event.
   */
  public sendMessage(event: string, data: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({event, data}));
      console.log(`📤 Sent event: ${event}`, data);
    } else {
      console.error('❌ WebSocket is not connected.');
    }
  }

  /**
   * Disconnects the WebSocket connection.
   */
  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
    }
  }

  /**
   * Adds an event listener for a specific event type.
   * @param {string} eventType - The event type to listen for.
   * @param {(data: any) => void} callback - The callback function to execute when the event occurs.
   */
  public addListener(eventType: string, callback: (data: any) => void): void {
    if (!this.eventListeners[eventType]) {
      this.eventListeners[eventType] = [];
    }
    this.eventListeners[eventType].push(callback);
  }

  /**
   * Removes an event listener for a specific event type.
   * @param {string} eventType - The event type to stop listening for.
   * @param {(data: any) => void} callback - The callback function to remove.
   */
  public removeListener(
    eventType: string,
    callback: (data: any) => void,
  ): void {
    if (this.eventListeners[eventType]) {
      this.eventListeners[eventType] = this.eventListeners[eventType].filter(
        listener => listener !== callback,
      );
    }
  }
}

export default WebSocketService.getInstance();
