import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {Alert} from 'react-native';
import axiosInstance from '../../Api/axiosConfig';

export const getUserInfoFromAPI = createAsyncThunk(
  'streaming/getUserInfoFromAPI',
  async (id, remote = false, {getState, dispatch}) => {
    // async (id: number, {getState, dispatch}) => {
    try {
      console.log(id, 'user id from stream');
      const {streamListeners} = getState().streaming;
      // Check if user already exists in the list
      const currentUsers = streamListeners;

      if (currentUsers.some(item => item.user?.id === id)) return;

      // Fetch user data from API
      const {data} = await axiosInstance.post('users-info', {users: [id]});

      if (data.users?.[0]) {
        // Find an empty slot where `occupied` is false and `user` is not assigned
        const emptyRoomIndex = currentUsers.findIndex(
          item => !item.occupied && !item.user,
        );

        if (emptyRoomIndex !== -1) {
          // Create a new array with updated user information (immutably)
          const updatedUsers = currentUsers.map((item, index) =>
            index === emptyRoomIndex
              ? {...item, user: data.users[0], occupied: true}
              : item,
          );

          // Dispatch an action to update the state
          dispatch(setStreamListeners(updatedUsers));
          if (remote) {
            dispatch({
              type: 'users/setGuestUser',
              payload: {user: data.users?.[0], state: true},
            });
          }
        } else {
          console.warn('No empty rooms available');
        }
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error; // Re-throw the error to handle it in the component if needed
    }
  },
);
export const getUserInfoFromAPIS = createAsyncThunk(
  'streaming/getUserInfoFromAPIS',
  async (id, remote = false, {getState, dispatch}) => {
    // async (id: number, {getState, dispatch}) => {
    try {
      const {streamListenersS} = getState().streaming;
      // Check if user already exists in the list
      const currentUsers = streamListenersS;

      if (currentUsers.some(item => item.user?.id === id)) return;

      // Fetch user data from API
      const {data} = await axiosInstance.post('users-info', {users: [id]});
      if (data.users?.[0]) {
        dispatch(addStreamListenerS(data.users?.[0]));
        if (remote) {
          dispatch({
            type: 'users/setGuestUser',
            payload: {user: data.users?.[0], state: true},
          });
        }
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error; // Re-throw the error to handle it in the component if needed
    }
  },
);
const streamingSlice = createSlice({
  name: 'streaming',
  initialState: {
    guests: null,
    rtcTokenRenewed: false,
    stream: '',
    loading: true,
    error: '',
    streamListeners: [],
    streamListenersS: [],
    streams: [],
    single: false,
  },
  reducers: {
    setGuests: (state, action) => {
      state.guests = action.payload;
    },
    setSingle: (state, {payload}) => {
      state.single = payload;
    },
    updateStreamListeners: (state, {payload}) => {
      let hosts = Array.from({length: payload}, (_, i) => ({
        id: null,
        seatNo: i + 1,
        user: null,
        occupied: false,
        muted: false,
        camOn: true,
      }));
      state.streamListeners = hosts;
    },
    resetSingleStreamListeners: (state, {payload}) => {
      state.streamListenersS = payload;
    },
    addStreamListenerS: (state, {payload}) => {
      // Get the last seat number from the current state
      const lastSeat =
        state.streamListenersS[state.streamListenersS.length - 1]?.seatNo || 0;
      // Create a new host object (not an array)
      const newHost = {
        id: null,
        seatNo: lastSeat + 1,
        user: payload,
        occupied: true,
        muted: false,
        camOn: true,
      };
      // Append the new host object to the existing state
      state.streamListenersS = [...state.streamListenersS, newHost];
    },
    removeUserFromSingleStream: (state, {payload}) => {
      state.streamListenersS = state.streamListenersS.filter(
        item => item.user?.id !== payload,
      );
    },

    setStream: (state, action) => {
      state.stream = action.payload;
    },
    setStreams: (state, action) => {
      state.streams = action.payload;
    },
    updateStreamRoomId: (state, {payload}) => {
      // state.stream.roomId
      let stream = state.stream;
      stream = {...stream, chat_room_id: payload};
      state.streams = stream;
    },
    setStreamListeners: (state, action) => {
      state.streamListeners = action.payload;
    },
    setUserInState: (state, {payload}) => {
      let currentUsers = state.streamListeners;
      // Check if user already exists in the list
      let joined = currentUsers.find(item => item.user?.id == payload.id);
      if (joined) return;

      // Find an empty room (unoccupied slot)
      const emptyRoomIndex = currentUsers.findIndex(item => !item.occupied);
      console.log(emptyRoomIndex, 'emptyRoomIndex', 'i am adding myself');

      if (emptyRoomIndex !== -1) {
        // Create a new array with the updated user (immutable update)
        const updatedUsers = currentUsers.map((item, index) =>
          index === emptyRoomIndex
            ? {...item, user: payload, occupied: true}
            : item,
        );
        state.streamListeners = updatedUsers;
      } else {
        console.warn('No empty rooms available');
      }
    },
    setPrevUsersInStream: (state, {payload}) => {
      let currentUsers = state.streamListeners;
      const existingUserIds = new Set(currentUsers.map(item => item.user?.id));

      const newUsers = payload
        .filter(user => !existingUserIds.has(user.id))
        .map(user => ({
          user,
          occupied: true,
          seatNo: null,
          camOn: true,
          muted: false,
        }));
      state.streamListeners = [...currentUsers, ...newUsers];
    },
    setPrevUsersInSingleStream: (state, {payload}) => {
      let currentUsers = state.streamListenersS;
      const existingUserIds = new Set(currentUsers.map(item => item.user?.id));

      const newUsers = payload
        .filter(user => !existingUserIds.has(user.id))
        .map(user => ({
          user,
          occupied: true,
          seatNo: null,
          camOn: true,
          muted: false,
        }));
      state.streamListenersS = [...currentUsers, ...newUsers];
    },
    updatedMuteUnmuteUser: (state, {payload}) => {
      if (payload.single) {
        state.streamListenersS = state.streamListenersS.map(listener =>
          listener.user?.id === payload.id
            ? {...listener, muted: !listener.muted} // Create a new object with updated muted property
            : listener,
        );
        return;
      }
      state.streamListeners = state.streamListeners.map(listener =>
        listener.user?.id === payload.id
          ? {...listener, muted: !listener.muted} // Create a new object with updated muted property
          : listener,
      );
    },
    // updatedMuteUnmuteUser: (state, {payload}) => {
    //   state.streamListeners = state.streamListeners.map(listener =>
    //     listener.user?.id === payload
    //       ? {...listener, muted: !listener.muted} // Create a new object with updated muted property
    //       : listener,
    //   );
    // },
    updateUserCamera: (state, {payload}) => {
      if (payload.single) {
        state.streamListenersS = state.streamListenersS.map(listener =>
          listener.user?.id === payload.id
            ? {...listener, camOn: !listener.camOn} // Create a new object with updated muted property
            : listener,
        );
        return;
      }
      state.streamListeners = state.streamListeners.map(listener =>
        listener.user?.id === payload.id
          ? {...listener, camOn: !listener.camOn} // Create a new object with updated muted property
          : listener,
      );
    },
    // updateUserCamera: (state, {payload}) => {
    //   state.streamListeners = state.streamListeners.map(listener =>
    //     listener.user?.id === payload
    //       ? {...listener, camOn: !listener.camOn} // Create a new object with updated muted property
    //       : listener,
    //   );
    // },
    removeUserFromStream: (state, {payload}) => {
      let currentUsers = state.streamListeners;
      console.log('Copy run key ... filtering out user', currentUsers);

      // Find the index of the user in the occupied rooms
      const emptyRoomIndex = currentUsers.findIndex(
        item => item.occupied && item.user?.id === payload,
      );

      if (emptyRoomIndex !== -1) {
        // Get the user details safely
        let leaveUser = currentUsers[emptyRoomIndex]?.user;

        // Free the room
        currentUsers[emptyRoomIndex] = {
          ...currentUsers[emptyRoomIndex],
          user: null,
          occupied: false,
        };

        // Show alert if leaveUser exists
        if (leaveUser) {
          Alert.alert('User Left:', leaveUser?.first_name || 'Unknown');
        }
        state.streamListeners = currentUsers;
      } else {
        console.warn('User not found in listener');
      }
    },
  },
});

export const {
  setGuests,
  setStream,
  setStreamListeners,
  updateStreamListeners,
  setStreams,
  setUserInState,
  updatedMuteUnmuteUser,
  addStreamListenerS,
  resetSingleStreamListeners,
  removeUserFromSingleStream,
  setPrevUsersInSingleStream,
  setSingle,
  updateStreamRoomId,
  updateUserCamera,
  setPrevUsersInStream,
  removeUserFromStream,
} = streamingSlice.actions;

export default streamingSlice.reducer;
