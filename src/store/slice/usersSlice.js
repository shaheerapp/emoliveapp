import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../../Api/axiosConfig';
export const fetchUserDetails = createAsyncThunk(
  'users/fetchUserDetails',
  async (ids, {getState}) => {
    try {
      const {userDetails} = getState().users;
      const newIds = ids.filter(
        id => !Object.keys(userDetails).some(key => userDetails[key].id == id),
      );
      // const newIds = ids.filter(
      //   id => !Object.keys(userDetails).some(key => userDetails[key] == id),
      // );
      console.log(newIds);
      // If no new IDs, return early
      if (newIds.length === 0) return;
      // Fetch user data from API for new IDs
      console.log('i am calling network for user id ', newIds);
      const {data} = await axiosInstance.post('users-info', {users: newIds});

      if (data.users?.[0]) {
        return data.users;
      }
    } catch (error) {
      console.log('Error fetching user info:', error);
      throw error; // Re-throw the error to handle it in the component if needed
    }
  },
);
export const getUsers = createAsyncThunk(
  'users/getUsers',
  async (_, {dispatch}) => {
    try {
      dispatch(setLoading(true));
      // If no new IDs, return early
      // Fetch user data from API for new IDs
      const {data} = await axiosInstance.get('/chat/active-users');
      dispatch(updateUsers(data.users));
    } catch (error) {
      console.log('Error fetching user info:', error);
      dispatch(setError('Some error: internet issue'));

      throw error; // Re-throw the error to handle it in the component if needed
    } finally {
      dispatch(setLoading(false));
    }
  },
);

const initialState = {
  users: [],
  visitProfile: '',
  distTip: [],
  rtcTokenRenewed: false,
  loading: false,
  userDetails: {},
  error: '',
  isJoined: false,
  liveStatus: 'IDLE',
  selectedGuest: '',
  chatLoggedIn: false,
  chatUser: '',
  roomId: '',
  liveForm: {
    liveType: null,
    title: 'test 122',
    duration: '20',
    listeners: null,
    type: null,
    multi: false,
  },
  guestUser: {
    joined: null,
    user: '',
  },
};

export const managerSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUserDetails: (state, {payload}) => {
      state.userDetails = payload;
    },
    setError: (state, {payload}) => {
      state.error = payload;
    },
    setSelectedGuest: (state, action) => {
      state.selectedGuest = action.payload;
    },
    setGuestUser: (state, {payload}) => {
      state.guestUser.joined = payload.state;
      state.guestUser.user = payload.user;
    },
    setLiveForm: (state, {payload}) => {
      state.liveForm = {
        ...state.liveForm,
        [payload.field]: payload.value,
      };
    },
    setLiveFormFull: (state, {payload}) => {
      state.liveForm = payload;
    },
    setRoomId: (state, action) => {
      state.roomId = action.payload;
    },
    setChatUser: (state, action) => {
      state.chatUser = action.payload;
    },
    setLiveStatus: (state, action) => {
      state.liveStatus = action.payload;
    },
    setIsJoined(state, action) {
      state.isJoined = action.payload;
    },
    setChatLoggedIn(state, action) {
      state.chatLoggedIn = action.payload;
    },
    updateUsers: (state, action) => {
      state.users = action.payload;
    },
    updateVisitProfile: (state, action) => {
      state.visitProfile = action.payload;
    },
    setRTCTokenRenewed: (state, action) => {
      state.rtcTokenRenewed = action.payload;
    },
    test: (state, {payload}) => {
      payload.forEach(user => {
        state.userDetails[user.id] = user;
      });
    },
    resetD: (state, {payload}) => {
      state.userDetails = {};
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUserDetails.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, {payload}) => {
        state.loading = false;
        // Merge the fetched user details into the existing userDetails object
        payload.forEach(user => {
          // console.log(user.id);
          state.userDetails[user.id] = user;
        });
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Action creators are generated for each case reducer function
export const {
  updateUsers,
  setRoomId,
  updateVisitProfile,
  setRTCTokenRenewed,
  setUserDetails,
  setIsJoined,
  resetD,
  setError,
  test,
  setSelectedGuest,
  setLiveForm,
  setChatLoggedIn,
  setChatUser,
  setLiveFormFull,
  setGuestUser,
  setLoading,
  setLiveStatus,
} = managerSlice.actions;

export default managerSlice.reducer;
