import {configureStore} from '@reduxjs/toolkit';
import usersReducer from './slice/usersSlice';
import chatReducer from './slice/chatSlice';
import notificationReducer from './slice/notificationSlice';
import podcastReducer from './slice/podCastSlice';
import streamingReducer from './slice/streamingSlice';
import accountReducer from './slice/accountSlice';
import battleReducer from './slice/PK/battleSlice';
// import {composeWithDevTools} from 'redux-devtools-extension';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    account: accountReducer,
    chat: chatReducer,
    notification: notificationReducer,
    // podcast: podcastReducer,
    podcast: podcastReducer,
    streaming: streamingReducer,
    battle: battleReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'chat/setMessages',
          'chat/setChatRoomMessages',
          'chat/setMessageStatus',
          'chat/setSentMessage',
          'chat/addRoomMessage',
        ],
        ignoredPaths: [
          'chat.messages',
          'chat.chatRoomMessages',
          'chat.messagesByConversation',
        ], // Ignore this path in the state
      },
    }),
  // enhancers: [composeWithDevTools],
  // middleware:(getDefaultMiddleware) =>
});
export default store;
// export type AppDispatch = typeof store.dispatch

// // Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>;
// // Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
// export type AppDispatch = typeof store.dispatch;
// chat.messagesByConversation
