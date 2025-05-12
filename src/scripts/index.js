import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from 'react-native';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import axiosInstance from '../Api/axiosConfig';
import envVar from '../config/envVar';

export default scripts = {
  clearError: (setError, setLoading) => {
    setLoading(false);
    setTimeout(() => {
      setError('');
    }, 3000);
  },
  updateUserInAsyncStorage: async user => {
    await AsyncStorage.setItem('user', JSON.stringify(user));
  },
};

export const checkPermission = async () => {
  if (Platform.OS === 'ios') {
    const photoPermission = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
    // const photoPermission = await PERMISSIONS.IOS.PHOTO_LIBRARY.request();
    if (photoPermission === RESULTS.GRANTED) {
      // if (cameraPermission === RESULTS.GRANTED && photoPermission === RESULTS.GRANTED) {
      return true;
    }
    if (photoPermission === 'denied') {
      const PermissionResult = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
      if (PermissionResult == 'granted') {
        return true;
      }
    } else {
      return false;
    }
  } else {
    const cameraPermission = await check(PERMISSIONS.ANDROID.CAMERA);
    if (cameraPermission == 'granted') return true;
    if (cameraPermission == 'denied') {
      let result = await request(PERMISSIONS.ANDROID.CAMERA);
      if (result == 'granted') {
        return true;
      }
    } else {
      return false;
    }
  }
};
export const checkAudioInputPermission = async () => {
  if (Platform.OS === 'ios') {
    // const cameraPermission = await PERMISSIONS.IOS.CAMERA.request();
    const photoPermission = await check(PERMISSIONS.IOS.MICROPHONE);

    // const photoPermission = await PERMISSIONS.IOS.PHOTO_LIBRARY.request();
    if (photoPermission === RESULTS.GRANTED) {
      // if (cameraPermission === RESULTS.GRANTED && photoPermission === RESULTS.GRANTED) {
      return true;
    } else {
      return false;
    }
  } else {
    const cameraPermission = await check(PERMISSIONS.ANDROID.RECORD_AUDIO);
    if (cameraPermission == 'granted') return true;
    const request2 = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
    if (request2 == 'granted') {
      return true;
    } else {
      return false;
    }
  }
};
export const renewRTCToken = (channel, role) => {
  return new Promise((resolve, reject) => {
    const url = envVar.API_URL + 'user/renew-rtc-token';
    const data = {channel, role};

    axiosInstance
      .post(url, data)
      .then(response => resolve(response.data.user)) // Resolve with the user data
      .catch(error => {
        console.log(error);
        reject(error); // Reject the promise on error
      });
  });
};
export const renewRTMToken = () => {
  return new Promise((resolve, reject) => {
    const url = envVar.API_URL + 'renew-agora-token';

    axiosInstance
      .get(url)
      .then(response => resolve(response.data.user)) // Resolve with the user data
      .catch(error => {
        console.log(error);
        reject(error); // Reject the promise on error
      });
  });
};
export const checkCamPermission = () => {
  return new Promise(async (resolve, reject) => {
    try {
      if (Platform.OS === 'ios') {
        const photoPermission = await check(PERMISSIONS.IOS.CAMERA);
        if (photoPermission === RESULTS.GRANTED) {
          return resolve(true);
        }
        if (photoPermission === RESULTS.DENIED) {
          const PermissionResult = await request(PERMISSIONS.IOS.CAMERA);
          return resolve(PermissionResult === RESULTS.GRANTED);
        }
      } else {
        const cameraPermission = await check(PERMISSIONS.ANDROID.CAMERA);
        if (cameraPermission === RESULTS.GRANTED) {
          return resolve(true);
        }
        if (cameraPermission === RESULTS.DENIED) {
          const result = await request(PERMISSIONS.ANDROID.CAMERA);
          return resolve(result === RESULTS.GRANTED);
        }
      }
      resolve(false); // If no condition matches, return false
    } catch (error) {
      reject(error); // Reject the Promise on error
    }
  });
};
export const checkMicrophonePermission = () => {
  return new Promise(async (resolve, reject) => {
    try {
      if (Platform.OS === 'ios') {
        const photoPermission = await check(PERMISSIONS.IOS.MICROPHONE);
        if (photoPermission === RESULTS.GRANTED) {
          return resolve(true);
        }
        if (photoPermission === RESULTS.DENIED) {
          const PermissionResult = await request(PERMISSIONS.IOS.MICROPHONE);
          return resolve(PermissionResult === RESULTS.GRANTED);
        }
      } else {
        const cameraPermission = await check(PERMISSIONS.ANDROID.RECORD_AUDIO);
        if (cameraPermission === RESULTS.GRANTED) {
          return resolve(true);
        }
        if (cameraPermission === RESULTS.DENIED) {
          const result = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
          return resolve(result === RESULTS.GRANTED);
        }
      }
      resolve(false); // If no condition matches, return false
    } catch (error) {
      reject(error); // Reject the Promise on error
    }
  });
};
export const checkReadStorage = () => {
  return new Promise(async (resolve, reject) => {
    try {
      if (Platform.OS === 'ios') {
        const photoPermission = await check(PERMISSIONS.IOS.MEDIA_LIBRARY);
        if (photoPermission === RESULTS.GRANTED) {
          return resolve(true);
        }
        if (photoPermission === RESULTS.DENIED) {
          const PermissionResult = await request(PERMISSIONS.IOS.MEDIA_LIBRARY);
          return resolve(PermissionResult === RESULTS.GRANTED);
        }
      } else {
        const cameraPermission = await check(
          PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        );
        if (cameraPermission === RESULTS.GRANTED) {
          return resolve(true);
        }
        console.log(cameraPermission);
        if (cameraPermission === RESULTS.DENIED) {
          const result = await request(
            PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
          );
          console.log(result, 'result');
          return resolve(result === RESULTS.GRANTED);
        }
      }
      resolve(false); // If no condition matches, return false
    } catch (error) {
      reject(error); // Reject the Promise on error
    }
  });
};
export const checkWriteStorage = () => {
  return new Promise(async (resolve, reject) => {
    try {
      if (Platform.OS === 'ios') {
        const photoPermission = await check(PERMISSIONS.IOS.MEDIA_LIBRARY);
        if (photoPermission === RESULTS.GRANTED) {
          return resolve(true);
        }
        if (photoPermission === RESULTS.DENIED) {
          const PermissionResult = await request(PERMISSIONS.IOS.MEDIA_LIBRARY);
          return resolve(PermissionResult === RESULTS.GRANTED);
        }
      } else {
        const cameraPermission = await check(
          PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        );
        if (cameraPermission === RESULTS.GRANTED) {
          return resolve(true);
        }
        if (cameraPermission === RESULTS.DENIED) {
          const result = await request(
            PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
          );
          return resolve(result === RESULTS.GRANTED);
        }
      }
      resolve(false); // If no condition matches, return false
    } catch (error) {
      reject(error); // Reject the Promise on error
    }
  });
};

// export const renewRTCToken = async (channel, role) => {
//   try {
//     const url = envVar.API_URL + 'user/renew-rtc-token';
//     const data = {
//       channel: channel,
//       role: role,
//     };
//     const res = await axiosInstance.post(url, data);
//     return res.data.user;
//   } catch (error) {
//     console.log(error);
//   }
// };
