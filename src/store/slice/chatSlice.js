import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {ChatClient} from 'react-native-agora-chat';
const chatClient = ChatClient.getInstance();

export const getLocalConversation = createAsyncThunk(
  'chat/getLocalConversation',
  async (_, {getState, dispatch}) => {
    try {
      let conv = await chatClient.chatManager().getLocalConversation();
      const formData = {
        chatRoomId: roomId,
        id: podcast.id,
      };
      // submit data to  API

      const {data} = await axiosInstance.post(url, formData);
      dispatch(setPodcast(data.podcast));
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error; // Re-throw the error to handle it in the component if needed
    }
  },
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    initialized: false,
    connected: false,
    error: null,
    localConvGet: false,
    tokenRenewed: false,
    messages: [],
    messagesByConversation: {},
    activeConversationId: '',
    chatRoomMessages: [],
  },
  reducers: {
    setModalInfo(state, action) {
      state.modalInfo.modal = action.payload.modal;
      state.modalInfo.isHost = action.payload.isHost;
    },
    addRoomMessage: (state, {payload}) => {
      state.chatRoomMessages = [...state.chatRoomMessages, payload]; // Creates a new array
    },
    setLocalConv: (state, {payload}) => {
      state.localConvGet = payload; // Creates a new array
    },
    setHostLeftPodcast(state, action) {
      state.hostLeftPodcast = action.payload;
    },
    setChatRoomMessages: (state, {payload}) => {
      let roomMessage = [...state.chatRoomMessages];
      payload.forEach(message => {
        roomMessage.push(message);
      });
      state.chatRoomMessages = roomMessage;
    },
    resetChatRoomMessage: state => {
      state.chatRoomMessages = [];
    },
    setTokenRenewed(state, action) {
      state.tokenRenewed = action.payload;
    },
    setMessages(state, {payload}) {
      // Loop through each incoming message in the payload
      payload.forEach(message => {
        // return;
        const {from} = message;
        // Append the new message to the existing conversation's messages
        state.messagesByConversation[from] = [
          ...(state.messagesByConversation[from] || []), // Existing messages (or empty array if none)
          message, // New message
        ];
      });
    },
    setSentMessage: (state, {payload}) => {
      const {to} = payload; // Extract the recipient ID (conversationId)

      // Append the new message to the existing conversation's messages
      state.messagesByConversation[to] = [
        ...(state.messagesByConversation[to] || []), // Existing messages (or empty array if none)
        payload, // New message
      ];
    },
    setMessagesx(state, {payload}) {
      // console.log(payload);
      // Loop through each incoming message in the payload
      payload.forEach(message => {
        // return;
        const {from} = message;
        // Append the new message to the existing conversation's messages
        state.messagesByConversation[conversationId] = [
          ...(state.messagesByConversation[conversationId] || []), // Existing messages (or empty array if none)
          message, // New message
        ];
      });
    },
    setMessageStatus: (state, {payload}) => {
      const {conversationId, msgId, status} = payload;
      console.log(conversationId, msgId, status);

      // Check if the conversation exists
      if (!state.messagesByConversation[conversationId]) {
        console.warn(`Conversation ID ${conversationId} not found in state.`);
        return;
      }

      // Update the specific message's status and remotePath (if applicable)
      state.messagesByConversation[conversationId] =
        state.messagesByConversation[conversationId].map(message => {
          if (message.localMsgId === msgId) {
            // If the message is of type 'voice', update both status and remotePath
            if (message.body.type === 'voice') {
              return {
                ...message,
                status,
                body: {
                  ...message.body,
                  remotePath: payload.remotePath, // Update remotePath inside body
                },
              };
            }
            // If the message is not of type 'voice', only update the status
            return {...message, status};
          }
          // Return the message as-is if it doesn't match the msgId
          return message;
        });
    },
    setMessageStatusx: (state, {payload}) => {
      const {conversationId, msgId, status} = payload;
      console.log(conversationId, msgId, status);

      // Check if the conversation exists
      if (!state.messagesByConversation[conversationId]) {
        console.warn(`Conversation ID ${conversationId} not found in state.`);
        return;
      }

      // Update the specific message's status
      state.messagesByConversation[conversationId] =
        state.messagesByConversation[conversationId].map(message =>
          message.localMsgId === msgId ? {...message, status} : message,
        );
    },
    setInitialized(state, action) {
      state.initialized = action.payload;
    },
    setConnected(state, action) {
      state.connected = action.payload;
    },
    resetMessage: (state, {payload}) => {
      state.messagesByConversation = {};
    },
  },
});

export const {
  setMessageStatus,
  setTokenRenewed,
  setMessages,
  setLocalConv,
  setInitialized,
  addRoomMessage,
  setChatRoomMessages,
  setConnected,
  resetMessage,
  resetRoomMessages,
  setSentMessage,
  resetChatRoomMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
