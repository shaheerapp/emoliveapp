import {createAsyncThunk} from '@reduxjs/toolkit';
import {setStreams} from '../streamingSlice';
import axiosInstance from '../../../Api/axiosConfig';
export const getStreams = createAsyncThunk(
  'streaming/getStreams',
  async (_, {dispatch}) => {
    try {
      dispatch(setStreams([]));
      dispatch({
        type: 'users/setLoading',
        payload: true,
      });
      const {data} = await axiosInstance.get('stream/active');
      dispatch(setStreams(data.stream));
    } catch (error) {
      console.warn('Error fetching user info:', error);
      throw error; // Re-throw the error to handle it in the component if needed
    } finally {
      dispatch({
        type: 'users/setLoading',
        payload: false,
      });
    }
  },
);
