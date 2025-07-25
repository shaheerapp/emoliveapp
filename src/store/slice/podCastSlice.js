import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Alert } from 'react-native';
import axiosInstance from '../../Api/axiosConfig';

export const getUserInfoFromAPI = createAsyncThunk(
  'podcast/getUserInfoFromAPI',
  async (id, remote, { getState, dispatch }) => {
    // async (id: number, {getState, dispatch}) => {
    try {
      console.log(id, 'user id from podcast');
      const { podcastListeners } = getState().podcast;
      // Check if user already exists in the list
      const currentUsers = podcastListeners;

      if (currentUsers.some(item => item.user?.id === id)) { return; }

      // Fetch user data from API
      const { data } = await axiosInstance.post('users-info', { users: [id] });

      if (data.users?.[0]) {
        // Find an empty slot where `occupied` is false and `user` is not assigned
        const emptyRoomIndex = currentUsers.findIndex(
          item => !item.occupied && !item.user,
        );

        if (emptyRoomIndex !== -1) {
          // Create a new array with updated user information (immutably)
          const updatedUsers = currentUsers.map((item, index) =>
            index === emptyRoomIndex
              ? { ...item, user: data.users[0], occupied: true }
              : item,
          );

          // Dispatch an action to update the state
          dispatch(setPodcastListeners(updatedUsers));
          if (remote) {
            dispatch({
              type: 'users/setGuestUser',
              payload: { user: data.users?.[0], state: true },
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
const podcastSlice = createSlice({
  name: 'podcast',
  initialState: {
    podcasts: [],
    podcast: '',
    host: null,
    hostCoins: 0,
    podcastListeners: [],
    loading: false,
    error: '',
    hostId: null,
    leaveModal: false,
    hostLeftPodcast: false,
    rtcTokenRenewed: false,
  },
  reducers: {
    setPodcast: (state, action) => {
      state.podcast = action.payload;
    },
    setPodcasts: (state, action) => {
      state.podcasts = action.payload;
    },
    updatePodcastListeners: (state, action) => {
      let hosts = Array.from({ length: action.payload }, (_, i) => ({
        id: null,
        seatNo: i + 1,
        user: null,
        occupied: false,
        muted: false,
        locked: true,
        coins: 0,
      }));
      // let hosts = Array.from({length: action.payload}, (_, i) => i + 1);
      state.podcastListeners = hosts;
    },
    updateSeatLockStatus: (state, action) => {
      const { seatNo, locked } = action.payload;
      state.podcastListeners = state.podcastListeners.map(seat =>
        seat.seatNo === seatNo ? { ...seat, locked } : seat
      );
    },
    incrementListenerCoins: (state, action) => {
      const { userId, amount } = action.payload;

      const listener = state.podcastListeners.find(
        l => l.user?.id === userId
      );

      if (listener) {
        listener.coins += amount;
      }
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setHostId(state, action) {
      state.hostId = action.payload;
    },
    setHostCoins: (state, action) => {
      state.hostCoins = action.payload;
    },
    incrementHostCoins: (state, action) => {
      const newAmount = Number(action.payload);
      state.hostCoins = Number(state.hostCoins) + (isNaN(newAmount) ? 0 : newAmount);
    },
    decrementHostCoins: (state, action) => {
      state.hostCoins -= action.payload;
    },
    setRTCTokenRenewed(state, action) {
      state.rtcTokenRenewed = action.payload;
    },
    setLeaveModal(state, action) {
      state.leaveModal = action.payload;
    },
    setPodcastListeners: (state, action) => {
      console.log('i updated array ....');
      state.podcastListeners = action.payload;
    },
    updatePodcastRoomId: (state, { payload }) => {
      let podcast = state.payload;
      podcast = { ...podcast, chat_room_id: payload };
      state.podcast = podcast;
    },
    setHostLeftPodcast: (state, action) => {
      state.hostLeftPodcast = action.payload;
    },
    setUserInState: (state, { payload }) => {
      if (payload.id === state.podcast?.host) {
        return; // Don't modify host seat
      }

      const currentUsers = state.podcastListeners;

      // Check if user already exists in any seat
      const userExists = currentUsers.some(item => item.user?.id === payload.id);
      if (userExists) { return; }

      // Must have seatNo in payload to proceed
      if (!payload.seatNo) {
        console.warn('Cannot add user - no seat number specified');
        return;
      }

      const seatIndex = currentUsers.findIndex(
        item => item.seatNo === payload.seatNo
      );

      if (seatIndex === -1) {
        console.warn(`Seat ${payload.seatNo} not found`);
        return;
      }

      const targetSeat = currentUsers[seatIndex];

      // Check if seat is available (not occupied and not locked)
      if (targetSeat.occupied) {
        console.warn(`Seat ${payload.seatNo} is already occupied`);
        return;
      }

      if (targetSeat.locked) {
        console.warn(`Seat ${payload.seatNo} is locked`);
        return;
      }

      // Only update the specific seat
      state.podcastListeners = currentUsers.map((item, index) =>
        index === seatIndex
          ? {
            ...item,
            user: payload,
            occupied: true,
            // Preserve existing locked status
            locked: item.locked,
          }
          : item
      );
    },
    setPrevUsersInPodcast: (state, { payload }) => {
      const seatMap = new Map();
      const userIdSet = new Set(); // Track unique user IDs

      // Map current seat info
      state.podcastListeners.forEach(seat => {
        seatMap.set(seat.seatNo, { ...seat });
        const userId = seat.user?.id;
        if (seat.seatNo && userId && !userIdSet.has(userId)) {
          seatMap.set(seat.seatNo, seat);
          userIdSet.add(userId);
        }
      });

      // Add/update from payload
      const usersToAdd = Array.isArray(payload) ? payload : [payload];

      usersToAdd.forEach(serverSlot => {
        const user = serverSlot.user || serverSlot;
        const userId = user?.id;

        if (!userId || userIdSet.has(userId)) { return; }

        const availableSeat = state.podcastListeners.find(
          seat => !seat.occupied && !seat.locked && !seat.user
        );

        if (availableSeat) {
          console.log("New user:  ", availableSeat.seatNo);
          seatMap.set(availableSeat.seatNo, {
            ...availableSeat,
            user,
            occupied: true,
            muted: availableSeat.muted,
            locked: availableSeat.locked,
          });
          userIdSet.add(userId);
        } else {
          for (let seatNo = 1; seatNo <= 8; seatNo++) {
            const seat = seatMap.get(seatNo);
            if (!seat || !seat.occupied) {
              seatMap.set(seatNo, {
                ...serverSlot,
                user,
                seatNo,
                occupied: true,
                muted: serverSlot.muted ?? false,
                locked: false,
              });
              userIdSet.add(userId);
              break;
            }
          }
        }

      });

      const updatedListeners = [];
      for (let i = 1; i <= 8; i++) {
        const newSeat = seatMap.get(i);
        const existing = state.podcastListeners.find(seat => seat.seatNo === i);

        updatedListeners.push(
          newSeat || existing || {
            id: null,
            seatNo: i,
            user: null,
            occupied: false,
            muted: false,
            locked: false,
            coins: 0,
          }
        );
      }


      state.podcastListeners = updatedListeners;
    },
    updatedMuteUnmuteUser: (state, { payload }) => {
      state.streamListeners = state.streamListeners.map(listener =>
        listener.user?.id === payload
          ? { ...listener, muted: !listener.muted } // Create a new object with updated muted property
          : listener,
      );
    },
    removeUserFromPodcast: (state, { payload }) => {
      let currentUsers = state.podcastListeners;
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
          // Alert.alert('User Left:', leaveUser?.first_name || 'Unknown');
        }
      } else {
        console.warn('User not found in listener');
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getUserInfoFromAPI.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserInfoFromAPI.fulfilled, state => {
        state.loading = false;
      })
      .addCase(getUserInfoFromAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setPodcast,
  setPodcasts,
  setRoomId,
  setHostId,
  setHostCoins,
  incrementHostCoins,
  decrementHostCoins,
  setLoading,
  updatedMuteUnmuteUser,
  incrementListenerCoins,
  updatePodcastRoomId,
  setPodcastListeners,
  setRTCTokenRenewed,
  updatePodcastListeners,
  updateSeatLockStatus,
  setHostLeftPodcast,
  setLeaveModal,
  setUserInState,
  setPrevUsersInPodcast,
  removeUserFromPodcast,
} = podcastSlice.actions;

export default podcastSlice.reducer;
