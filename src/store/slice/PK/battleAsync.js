import {createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../../../Api/axiosConfig';
import envVar from '../../../config/envVar';
import {setBattle, setBattles, setBattleHosts} from './battleSlice';
const MAX_RETRIES = 3;
export const saveBattleRoomId = roomId => {
  return async (dispatch, getState) => {
    const attemptSave = async (retryCount = 0) => {
      try {
        const url = envVar.API_URL + 'battle/save-roomId';
        const data = {
          chatRoomId: roomId,
          id: getState().battle.id, // Assuming `stream.id` is stored in Redux state
        };
        const res = await axiosInstance.post(url, data);

        // Dispatch the success action
        dispatch(setBattle(res.data.battle));
      } catch (error) {
        console.log(error);
        const isNetworkTimeout =
          error.code === 'ECONNABORTED' || // Axios-specific timeout code
          error.message.includes('timeout') ||
          error.message.includes('Network Error');
        if (isNetworkTimeout) {
          if (retryCount < MAX_RETRIES) {
            const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
            console.log(`Retrying in ${delay / 1000} seconds...`);

            // Retry after delay
            await new Promise(resolve => setTimeout(resolve, delay));
            await attemptSave(retryCount + 1);
          } else {
            // Handle failure after max retries
            console.error(
              'Failed to create chat room after multiple attempts.',
            );
            alert(
              'Network Error',
              'Failed to create chat room after multiple attempts.',
            );
          }
        }
      }
    };

    // Start the initial attempt
    await attemptSave();
  };
};
export const getBattles = createAsyncThunk(
  'battle/getBattles',
  async (_, {getState, dispatch}) => {
    try {
      dispatch({
        type: 'users/setLoading',
        payload: true,
      });
      const {data} = await axiosInstance.get('battles');
      dispatch(setBattles(data.battles));
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
export const getUserInfoFromAPI = createAsyncThunk(
  'streaming/getUserInfoFromAPI',
  async (id, {getState, dispatch}) => {
    // async (id: number, {getState, dispatch}) => {
    try {
      const {battleHosts} = getState().battle;
      // Check if user already exists in the list
      const currentUsers = battleHosts;

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
          dispatch(setBattleHosts(updatedUsers));
          console.log('I should have');
          // dispatch({
          //   type: 'users/setGuestUser',
          //   payload: {user: data.users?.[0], state: true},
          // });
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
