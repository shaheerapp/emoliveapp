import {createAsyncThunk} from '@reduxjs/toolkit';

export const saveChatRoomId = createAsyncThunk(
  'podcast/saveChatRoomId',
  async (id, {getState, dispatch}) => {
    try {
      const url = envVar.API_URL + 'podcast/save-roomId';

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
