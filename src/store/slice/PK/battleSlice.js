import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

const initialState = {
  purchase: '',
  battleId: '',
  battle: '',
  battles: [],
  battleHosts: [],
};

export const battleSlice = createSlice({
  name: 'battle',
  initialState,
  reducers: {
    setBattle: (state, action) => {
      state.battle = action.payload;
    },
    updateBattleHosts: (state, {payload}) => {
      let hosts = Array.from({length: payload}, (_, i) => ({
        id: null,
        seatNo: i + 1,
        user: null,
        occupied: false,
        muted: false,
        camOn: true,
      }));
      state.battleHosts = hosts;
    },

    setUserInBattle: (state, action) => {
      let currentUsers = state.battleHosts;
      let joined = currentUsers.find(
        item => item.user?.id === action.payload.id,
      );
      if (joined) return;

      const emptyRoomIndex = currentUsers.findIndex(item => !item.occupied);
      if (emptyRoomIndex === -1) return; // No empty room available

      // Correctly update state.battleHosts
      state.battleHosts = currentUsers.map((item, index) =>
        index === emptyRoomIndex
          ? {...item, user: action.payload, occupied: true}
          : item,
      );
    },
    updateMuteUnmuteUser: (state, {id}) => {
      state.battleHosts = state.battleHosts.map(listener =>
        listener.user?.id === id
          ? {...listener, muted: !listener.muted} // Create a new object with updated muted property
          : listener,
      );
    },
    updateUserCamera: (state, {id}) => {
      state.battleHosts = state.battleHosts.map(listener =>
        listener.user?.id === id
          ? {...listener, camOn: !listener.camOn} // Create a new object with updated muted property
          : listener,
      );
    },

    setBattleHosts: (state, action) => {
      state.battleHosts = action.payload;
    },
    setBattles: (state, action) => {
      state.battles = action.payload;
    },
    updateStreamRoomId: (state, {payload}) => {
      // state.stream.roomId
      let stream = state.stream;
      stream = {...stream, chat_room_id: payload};
      state.streams = stream;
    },
  },
});

export const {
  updateStreamRoomId,
  setBattleHosts,
  updateMuteUnmuteUser,
  updateUserCamera,
  setUserInBattle,
  setBattles,
  setBattle,
  updateBattleHosts,
} = battleSlice.actions;

export default battleSlice.reducer;
