import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    initialized: false,
    unreadCount: null,
    unreadNotification: false,
  },
  reducers: {
    setUnreadCount(state, action) {
      state.unread = action.payload;
    },

    setUnreadNotification(state, action) {
      state.unreadNotification = action.payload;
    },
  },
});

export const {setUnreadCount, setHostId, setUnreadNotification} =
  notificationSlice.actions;

export default notificationSlice.reducer;
