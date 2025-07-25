import {View, Text, Image, Alert, StyleSheet} from 'react-native';
import React, {useRef, useEffect, useState} from 'react';
import Home from './Home';
import Search from './Tabs/Search';
import Profile from './Tabs/Profile';
import Notifications from './Notifications';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import StartLive from './Tabs/StartLive';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  setChatRoomMessages,
  setLocalConv,
  setTokenRenewed,
} from '../../../store/slice/chatSlice';
import notifee from '@notifee/react-native';

import NetInfo, {useNetInfo, refresh} from '@react-native-community/netinfo';
import axiosInstance from '../../../Api/axiosConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Context from '../../../Context/Context';
const Tab = createBottomTabNavigator();
import {
  ChatClient,
  ChatOptions,
  ChatConnectEventListener,
  ChatConversationType,
  ChatMessage,
  ChatMessageEventListener,
  ChatMessageChatType,
} from 'react-native-agora-chat';
import {
  fetchUserDetails,
  setChatLoggedIn,
} from '../../../store/slice/usersSlice';
import {colors} from '../../../styles/colors';
import envVar from '../../../config/envVar';
import {
  setInitialized,
  setConnected,
  setMessages,
} from '../../../store/slice/chatSlice';
import {useSelector, useDispatch} from 'react-redux';
import {useAppContext} from '../../../Context/AppContext';
import appStyles from '../../../styles/styles';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const MAX_RETRIES = 3;

export default function HomeB() {
  const audioPlayerRef = useRef<AudioRecorderPlayer | null>(null);

  const dispatch = useDispatch();
  const chatClient = ChatClient.getInstance();
  const chatManager = chatClient.chatManager;
  const {userAuthInfo, tokenMemo} = useAppContext();
  const {token} = tokenMemo;
  const {user, setUser} = userAuthInfo;
  const {initialized, connected, tokenRenewed, localConvGet, chatLoggedIn} =
    useSelector((state: any) => state.chat);
  const {unread} = useSelector((state: any) => state.notification);

  useEffect(() => {
    if (!audioPlayerRef.current) {
      audioPlayerRef.current = new AudioRecorderPlayer();
    }
    return () => {
      // Clean up the audio player instance on component unmount
      audioPlayerRef.current?.stopPlayer();
      audioPlayerRef.current = null;
    };
  }, []);
  // NetInfo.addEventListener(state => {
  //   if (!state.isConnected) {
  //     console.log('Network lost, reconnecting chat...');
  //     chatClient.reconnect();
  //   }

  // });

  useEffect(() => {
    if (!initialized && !connected) {
      console.log('Network available, initializing chat SDK...Home');

      initializedAgoraChat(); // Your function to initialize Agora Chat

      setInitialized(true);
    }

    const connectionListener: ChatConnectEventListener = {
      onTokenWillExpire() {
        callApiForRenewToken();
        // Alert.alert('Token Expired', 'Token will expired soon');
      },
      onTokenDidExpire() {
        callApiForRenewToken();
        console.log('token did expire');
      },
      onConnected() {
        console.log('onConnected');
        // Alert.alert('phone connected');
        dispatch(setConnected(true));
      },
      onDisconnected() {
        dispatch(setConnected(false));
        dispatch(setTokenRenewed(false));
        dispatch(setChatLoggedIn(false));
        // Alert.alert('Disconnected', 'Disconnected from agora');
        console.log('onDisconnected:x');
      },
      onUserAuthenticationFailed() {
        callApiForRenewToken();
        // loginUser();
      },
    };
    if (initialized) {
      chatClient.addConnectionListener(connectionListener);
    }

    return () => {
      chatClient.removeConnectionListener(connectionListener); // ✅ Only remove this listener, not all
    };
  }, [initialized, connected]);

  const initializedAgoraChat = () => {
    let o = new ChatOptions({
      autoLogin: true,
      appKey: envVar.AGORA_CHAT_KEY,
    });
    chatClient.removeAllConnectionListener();
    chatClient
      .init(o)
      .then(() => {
        if (!chatLoggedIn) {
          loginUser();
        }
        dispatch(setInitialized(true));
      })
      .catch(error => {
        console.log(
          'init fail: x' +
            (error instanceof Object ? JSON.stringify(error) : error),
        );
      });
  };

  useEffect(() => {
    if (connected) {
      let msgListener: ChatMessageEventListener = {
        onMessagesReceived: (messagesReceived: Array<ChatMessage>): void => {
          console.log('message received ...', messagesReceived[0]);
          if (messagesReceived[0].chatType == ChatMessageChatType.ChatRoom) {
            dispatch(setChatRoomMessages(messagesReceived));
            return;
          }
          // playNotificationSound();
          dispatch(setMessages(messagesReceived));
          dispatch(fetchUserDetails([messagesReceived[0].from]));
          onDisplayNotification(
            messagesReceived[0].body.type == 'txt'
              ? 'text Message Received'
              : 'Voice Message Received',
          );
        },
        onMessagesRead: (messages: Array<ChatMessage>): void => {
          console.log('Messages read:', messages);
        },
        onMessagesDelivered: messages =>
          console.log('Messages delivered:', messages),
      };

      chatClient.chatManager.addMessageListener(msgListener);

      return () => {
        chatClient.chatManager.removeMessageListener(msgListener);
      };
    }
  }, [connected]);

  // Logs in with an account ID and a token.
  const loginUser = async (retryCount = 0) => {
    // if (await chatClient.isConnected()) {
    //   dispatch(setChatLoggedIn(true));
    //   true;
    // }
    const isLoggedIn = await chatClient.isLoginBefore();
    if (isLoggedIn) {
      dispatch(setChatLoggedIn(true));
      console.log('User is already logged in.');
      return; // Prevent duplicate login
    }

    if (!initialized) console.log('Perform initialization first.', user.id);
    try {
      await chatClient.loginWithToken(
        String(user.id),
        String(user.agora_chat_token),
      );
      console.log('login operation success.');
      dispatch(setChatLoggedIn(true));
    } catch (error: any) {
      if (error.code === 2 || error.code === 300) {
        if (retryCount < MAX_RETRIES) {
          const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
          console.log(`Retrying in ${delay / 1000} seconds...`);
          setTimeout(() => loginUser(retryCount + 1), delay);
        } else {
          Alert.alert(
            'Network Error',
            'Failed to login chat after multiple attempts.',
          );
        }
      }
      if (error.code == 111 || error.code == 202) {
        callApiForRenewToken();
      }
    }
  };
  useEffect(() => {
    if (tokenRenewed) {
      console.log('token has been renewed login again');
      loginUser();
    }
  }, [tokenRenewed]);
  const onDisplayNotification = async (text: string) => {
    // Request permissions (required for iOS)
    await notifee.requestPermission();
    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Display a notification
    await notifee.displayNotification({
      title: 'Message Received',
      body: text,
      // body: 'Main body content of the notification',
      android: {
        channelId,
        // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
        pressAction: {
          id: 'default',
        },
        // sound: 'default',
      },
      ios: {
        sound: 'default',
      },
    });
  };
  const callApiForRenewToken = async () => {
    try {
      if (tokenRenewed) return;
      console.log('calling.api.for chat token renew');

      const res = await axiosInstance.get('/renew-agora-token');
      dispatch(setTokenRenewed(true));
      await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      // loginUser();
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Error occurred on token renewal');
    }
  };
  useEffect(() => {
    if (connected && !localConvGet) {
      getLocalConv();
    }
  }, [connected]);
  const getLocalConv = async () => {
    try {
      if (localConvGet) return;
      const local = await chatManager.getAllConversations();
      dispatch(setLocalConv(true));
      if (local.length > 0) {
        const ids = local.map((item: any) => item.convId);
        dispatch(fetchUserDetails(ids));
        getLastMessages(local);
      }
    } catch (error) {
      console.log('error while getting message from local device');
    }
  };
  const getLastMessages = async (conv: any) => {
    try {
      let lastMessages1: any = [];
      let lastMessages = await Promise.all(
        conv.map(async (item: any) => {
          // conv.map(async (item: any) => {
          const message = await chatManager.getLatestMessage(
            String(item.convId),
            ChatConversationType.PeerChat,
          );
          lastMessages1.push(message);

          return message || null; // Return null if no message is found
        }),
      );
      dispatch(setMessages(lastMessages1));
    } catch (error) {
      // setError('error occurred: please check internet connection(m)');
      console.log('error');
    }
  };

  const playNotificationSound = async () => {
    try {
      const path = 'message.mp3';
      await audioPlayerRef.current?.startPlayer(path);
      audioPlayerRef.current?.setVolume(1.0);
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {backgroundColor: '#1d1f31'},
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarActiveTintColor: colors.complimentary,
          tabBarInactiveTintColor: colors.body_text,
          tabBarIcon: ({focused}) => (
            <View style={{position: 'relative'}}>
              <Icon
                name="alpha-z-circle-outline"
                size={25}
                color={focused ? colors.complimentary : colors.body_text}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarLabel: 'Search',
          tabBarActiveTintColor: colors.complimentary,
          //   tabBarLabelStyle: {fontFamily: 'Inter-Regular', fontSize: 11},
          tabBarInactiveTintColor: colors.body_text,
          tabBarIcon: ({focused}) => (
            <View style={{position: 'relative'}}>
              <Icon
                name="magnify"
                size={25}
                color={focused ? colors.complimentary : colors.body_text}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="StartLive"
        component={StartLive}
        options={{
          tabBarLabel: 'StartLive',
          tabBarActiveTintColor: colors.complimentary,
          tabBarInactiveTintColor: colors.body_text,
          tabBarIcon: ({focused}) => (
            <View style={{position: 'relative'}}>
              <Icon
                name="camera-plus-outline"
                size={25}
                color={focused ? colors.complimentary : colors.body_text}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        // name="Alerts"
        name="Notifications"
        component={Notifications}
        options={{
          tabBarLabel: 'Alerts',
          tabBarActiveTintColor: colors.complimentary,
          tabBarInactiveTintColor: colors.body_text,
          tabBarIcon: ({focused}) => (
            <View style={{position: 'relative'}}>
              <Icon
                name="bell-ring-outline"
                size={25}
                color={focused ? colors.complimentary : colors.body_text}
              />
              {unread && (
                <View style={styles.unread}>
                  <Text
                    style={[
                      appStyles.smallM,
                      {
                        color: colors.complimentary,
                        fontSize: 10,
                      },
                    ]}>
                    {unread}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: 'You',
          tabBarActiveTintColor: colors.complimentary,
          tabBarInactiveTintColor: colors.body_text,
          tabBarIcon: () => (
            <View style={{position: 'relative'}}>
              {user.avatar ? (
                <Image
                  style={{width: 25, height: 25, borderRadius: 20}}
                  source={{
                    uri: envVar.API_URL + 'display-avatar/' + user.id,
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }}
                />
              ) : (
                <Icon name="account-circle" size={25} color="grey" />
              )}
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  unread: {
    position: 'absolute',
    right: -5,
    backgroundColor: colors.accent,
    borderRadius: 20,
    paddingHorizontal: 6,
    paddingVertical: 2,
    top: -4,
  },
});
