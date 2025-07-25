import {ChatClient} from 'react-native-agora-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';

const chatClient = ChatClient.getInstance();
export const login = async () => {
  const isLoggedIn = await chatClient.isLoginBefore();
  if (isLoggedIn) {
    dispatch(setConnected(true));
    console.log('User is already logged in.');
    return; // Prevent duplicate login
  }

  if (!initialized) console.log('Perform initialization first.');
  try {
    await chatClient.loginWithToken(String(user.id), user.agora_chat_token);
    console.log('login operation success.');
  } catch (error) {
    console.log(error);
    if (error.code == 2) {
      setStatus({...status, error: error.description});
      return;
    }
    if (error.code == 111 || error.code == 202) {
      callApiForRenewToken();
    }
    console.log(error);
  }
};

export const callApiForRenewToken = async () => {
  try {
    const res = await axiosInstance.get('/renew-agora-token');
    console.log(res.data.user);
    setRenewToken(true);
    setUser(res.data.user);
    // await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
  } catch (error) {
    console.log(error);
  }
};
