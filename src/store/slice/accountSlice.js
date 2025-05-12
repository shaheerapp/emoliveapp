import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

const initialState = {
  purchase: '',
};

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setPurchase: (state, action) => {
      state.purchase = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setPurchase} = accountSlice.actions;

export default accountSlice.reducer;
