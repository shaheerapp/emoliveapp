import {
  setLeaveModal,
  setPodcastListeners,
  setPodcast,
} from '../../../../../store/slice/podCastSlice';
import envVar from '../../../../../config/envVar';
import axiosInstance from '../../../../../Api/axiosConfig';
import {
  setStreamListeners,
  setStream,
  resetSingleStreamListeners,
  setSingle,
} from '../../../../../store/slice/streamingSlice';
import {
  setIsJoined,
  setLiveStatus,
} from '../../../../../store/slice/usersSlice';
import {resetChatRoomMessage} from '../../../../../store/slice/chatSlice';
import {
  setBattle,
  setBattleHosts,
} from '../../../../../store/slice/PK/battleSlice';

export const resetPodcastState = dispatch => {
  console.log('function run');
  dispatch(setIsJoined(false));
  dispatch(setPodcastListeners([]));
  dispatch(resetChatRoomMessage());
  dispatch(setLiveStatus('IDLE'));
  dispatch(setPodcast(''));
};

export const getPodcastUsers = async id => {
  console.log(id, 'from live file');
  return new Promise(async (resolve, reject) => {
    try {
      const url = envVar.API_URL + 'podcast/users/' + id;
      console.log(url);
      const res = await axiosInstance.get(url);
      resolve(res.data.users);
    } catch (error) {
      console.log(error);
      reject(error); // Reject the Promise on error
    }
  });
};

export const getLiveUsers = (id, type) => {
  return new Promise(async (resolve, reject) => {
    try {
      const url = envVar.API_URL + type + '/users/' + id;
      console.log(url);
      const res = await axiosInstance.get(url);
      resolve(res.data.users);
    } catch (error) {
      console.log(error);
      reject(error); // Reject the Promise on error
    }
  });
};
export const resetLiveStreaming = dispatch => {
  console.log('function run');
  dispatch(setSingle(false));
  dispatch(setStreamListeners([]));
  dispatch(resetChatRoomMessage());
  dispatch(resetSingleStreamListeners([]));
  // dispatch(setStream(''));
  dispatch(setLiveStatus('IDLE'));
};
export const resetBattle = dispatch => {
  dispatch(setBattleHosts([]));
  dispatch(setBattle(''));
  dispatch(resetChatRoomMessage());
  dispatch(setLiveStatus('IDLE'));
};
