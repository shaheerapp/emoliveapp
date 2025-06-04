import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Platform,
  BackHandler,
  FlatList,
  NativeModules,
  Dimensions,
  Alert,
} from 'react-native';
const {ScreenAwake} = NativeModules;
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconM from 'react-native-vector-icons/MaterialIcons';
import liveStyles from './styles/liveStyles';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

const deviceWidth = Dimensions.get('window').width;

import React, {useRef, useCallback, useEffect, useState} from 'react';
import Tools from './Podcast/Tools';
import PodcastStatus from './Podcast/PodcastStatus';
// import PodcastSt
import {
  createAgoraRtcEngine,
  ChannelProfileType,
  ClientRoleType,
  IRtcEngine,
  AudienceLatencyLevelType,
  RtcConnection,
  IRtcEngineEventHandler,
  ConnectionStateType,
  ConnectionChangedReasonType,
  UserOfflineReasonType,
  RtcStats,
} from 'react-native-agora';
import {ChatClient} from 'react-native-agora-chat';

import AvatarSheet from './Components/AvatarSheet';
import BottomSection from './Components/BottomSection';
import PodcastGuest from './Podcast/PodcastGuest';
import {resetPodcastState, getLiveUsers} from './scripts/liveScripts';
import Header from './Podcast/Header';

import {useSelector, useDispatch} from 'react-redux';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import axiosInstance from '../../../../Api/axiosConfig';
import EndLive from './Podcast/EndLive';
import Gifts from './Podcast/Gifts';
import {setLiveStatus} from '../../../../store/slice/usersSlice';

import envVar from '../../../../config/envVar';
import Users from './Podcast/Users';
import {
  setPodcastListeners,
  setHostLeftPodcast,
  setPodcast,
  setLeaveModal,
  setUserInState,
  removeUserFromPodcast,
  getUserInfoFromAPI,
  setPrevUsersInPodcast,
  updatePodcastRoomId,
} from '../../../../store/slice/podCastSlice';
import {setIsJoined} from '../../../../store/slice/usersSlice';
import {checkMicrophonePermission} from '../../../../scripts';
import LiveLoading from './Components/LiveLoading';
import {useAppContext} from '../../../../Context/AppContext';

import LiveHeader from './LiveHeader';
import {appStyles} from './Podcast/podcastImport';
import {IMAGES} from '../../../../assets/images';
import {colors} from '../../../../styles/colors';
import {Image} from 'react-native';
import {
  getUserInfoFromAPIS,
  removeUserFromSingleStream,
} from '../../../../store/slice/streamingSlice';
const MAX_RETRIES = 3;

export default function GoLive({navigation}: any) {
  const chatClient = ChatClient.getInstance();
  const agoraEngineRef = useRef<IRtcEngine>(); // IRtcEngine instance
  const eventHandler = useRef<IRtcEngineEventHandler>(); // Implement callback functions
  const dispatch = useDispatch();
  const [time, setTime] = useState(0);
  const {connected} = useSelector((state: any) => state.chat);
  const {podcast, podcastListeners, rtcTokenRenewed, leaveModal} = useSelector(
    (state: any) => state.podcast,
  );

  const {isJoined, liveStatus, roomId} = useSelector(
    (state: any) => state.users,
  );

  const {userAuthInfo, tokenMemo} = useAppContext();
  const {user, setUser} = userAuthInfo;
  const {token} = tokenMemo;
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [sheet, setSheet] = useState<boolean>(false);
  const [sheetType, setSheetType] = useState<string | null>('');

  // callbacks

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prevTime => prevTime + 1); // Increment time by 1 second
    }, 1000);
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);
  useEffect(() => {
    if (!isJoined) {
      return;
    }

    const backAction = () => {
      dispatch(setLeaveModal(true));
      return true; // Prevent default back action
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [isJoined, dispatch]);

  useEffect(() => {
    // Initialize the engine when the App starts
    if (!isJoined) {
      setupVideoSDKEngine();
    }
    // Release memory when the App is closed
    return () => {
      console.log('clearing up listners');
      // agoraEngineRef.current?.unregisterEventHandler(eventHandler.current!);
      // agoraEngineRef.current?.release();
    };
  }, [isJoined, podcast]);

  useEffect(() => {
    if (isJoined) {
      leaveAgoraChannel(); // Leave previous channel before joining new one
    }
    setupVideoSDKEngine();
  }, [podcast.channel]);

  const setupVideoSDKEngine = async () => {
    try {
      // Create RtcEngine after obtaining device permissions
      console.log('initializing engine ....', 'resetting ....');
      agoraEngineRef.current = createAgoraRtcEngine();
      const agoraEngine = agoraEngineRef.current;
      eventHandler.current = {
        onJoinChannelSuccess: (_connection: RtcConnection, elapsed: number) => {
          if (podcast.host == user.id) {
            // createUserChatRoom();
          } else {
            dispatch(getUserInfoFromAPIS({id: podcast.host}));
            // userJoinChatRoom(podcast.chat_room_id);
          }

          dispatch(setUserInState(user));

          if (_connection.localUid !== podcast.host) {
            getPodcastUsers();
          }
        },
        onUserJoined: (_connection: RtcConnection, uid: number) => {
          console.log(uid, 'remote user joined');
          if (uid !== podcast.host) {
            dispatch(getUserInfoFromAPI({id: uid, remote: true}));
          }
        },
        onLeaveChannel(connection: RtcConnection, stats: RtcStats) {
          // console.log('user leave channel ,///');
          // if (connection.localUid !== podcast.host) {
          //   dispatch(removeUserFromPodcast(connection.localUid));
          // }
          // if (connection.localUid === podcast.host) {
          //   console.log('host is lefting podcast');
          //   hostEndedPodcast();
          //   return;
          // }
          // console.log('new function', 'user has leaved the');
        },
        onUserOffline: (
          _connection: RtcConnection,
          uid: number,
          reason: UserOfflineReasonType,
        ) => {
          if (reason == 0) {
            if (uid !== podcast.host) {
              dispatch(removeUserFromPodcast(uid));
            }
            if (uid === podcast.host) {
              hostEndedPodcast();
              return;
            }
          }
          if (reason === 1) {
            console.log(uid, 'are having network issues');
          }
        },
        onConnectionStateChanged: (
          _connection: RtcConnection,
          state: ConnectionStateType,
          reason: ConnectionChangedReasonType,
        ) => {
          console.log(state, reason);
          handelConnection(state);
        },
      };

      // Register the event handler
      agoraEngine.registerEventHandler(eventHandler.current);
      // Initialize the engine
      agoraEngine.initialize({
        channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
        appId: envVar.AGORA_APP_ID,
      });

      agoraEngine.enableLocalAudio(true);
      userJoinChannel();
    } catch (e) {
      console.log(e);
    }
  };
  const getPodcastUsers = async () => {
    try {
      const users = await getLiveUsers(podcast.id, 'podcast');
      if (users.length > 0) {
        console.log('user.length', users);
        dispatch(setPrevUsersInPodcast(users));
      }
    } catch (error) {
      console.error('Error getting active podcast:', error);
    }
  };
  const handelConnection = (state: number) => {
    switch (state) {
      case 3:
        dispatch(setLiveStatus('CONNECTED'));
        dispatch(setIsJoined(true));
        timeOutScreen(false);
        break;
      case 5:
        leaveAgoraChannel();
        break;
      case 1:
        dispatch(setLiveStatus('IDLE'));
        dispatch(setIsJoined(false));
        timeOutScreen(false);
        // userJoinChannel();
        console.log('disconnected');
        break;
      default:
        break;
    }
  };
  const timeOutScreen = (val: boolean) => {
    try {
      if (Platform.OS !== 'android') {
        return;
      }
      ScreenAwake.keepAwake(val);
    } catch (error) {
      console.log(error);
    }
  };
  // Function to handle open Bottom Sheet
  const handleOpenSheet = useCallback((type: string) => {
    setSheet(true);
    setSheetType(type);
    bottomSheetRef.current?.expand();
  }, []);
  const handleOpenSheet2 = useCallback(() => {
    setSheet(true);
    setSheetType('avatar');
    bottomSheetRef.current?.expand();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    if (index < 0) {
      setSheet(false);
    }
  }, []);

  const createUserChatRoom = async (retryCount = 0) => {
    try {
      if (!connected) {
        console.log('Not connected, logging in first...');
        return;
      }

      const chatRoom = await chatClient.roomManager.createChatRoom(
        'Podcast',
        'Hi',
        'welcome',
        [],
        20,
      );

      const roomId = chatRoom.roomId;
      saveChatRoomId(roomId);
      dispatch(updatePodcastRoomId(roomId));
      userJoinChatRoom(roomId);
      console.log(roomId, 'Chat room created successfully');
    } catch (error: any) {
      console.log('Error creating chat room:', error);
      if (error.code === 2 || error.code === 300) {
        if (retryCount < MAX_RETRIES) {
          const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
          console.log(`Retrying in ${delay / 1000} seconds...`);
          setTimeout(() => createUserChatRoom(retryCount + 1), delay);
        } else {
          Alert.alert(
            'Network Error',
            'Failed to create chat room after multiple attempts.',
          );
        }
      }
    }
  };

  const saveChatRoomId = async (roomId: string) => {
    try {
      console.log('calling api to roomId');
      const url = 'podcast/save-roomId';
      const data = {
        chatRoomId: roomId,
        id: podcast.id,
      };
      const res = await axiosInstance.post(url, data);
      dispatch(setPodcast(res.data.podcast));
    } catch (error) {
      console.log(error);
    }
  };

  const userJoinChatRoom = async (roomId: string) => {
    try {
      if (!roomId) {
        throw new Error('room Id is null');
      }
      await chatClient.roomManager.joinChatRoom(roomId);
    } catch (error) {
      console.log(error, 'error in joining chat room');
    }
  };

  const hostEndedPodcast = async () => {
    dispatch(setHostLeftPodcast(true));
    dispatch(setLeaveModal(true));
  };

  const userJoinChannel = async () => {
    if (!checkPermission()) {
      Alert.alert('Error', 'Permission Required ...');
    }
    console.log('Connecting...', isJoined, user.id, podcast.host);
    // return;
    // Exit if already joined
    if (isJoined) {
      console.log('User is already in the channel.');
      // dispatch(setLiveStatus('CONNECTED'));
      return;
    }
    try {
      // Check if Agora engine is initialized
      if (!agoraEngineRef.current) {
        throw new Error('Agora engine is not initialized.');
      }
      let result1;
      if (user.id == podcast.host) {
        console.log('Joining as a host...');
        result1 = agoraEngineRef.current.joinChannel(
          user.agora_rtc_token,
          podcast.channel,
          user.id,
          {
            clientRoleType: ClientRoleType.ClientRoleBroadcaster,
            publishMicrophoneTrack: true,
            autoSubscribeAudio: true,
          },
        );
      } else {
        console.log('Joining as an audience...');
        result1 = agoraEngineRef.current.joinChannel(
          String(user.agora_rtc_token),
          String(podcast.channel),
          user.id,
          {
            clientRoleType: ClientRoleType.ClientRoleBroadcaster,
            // clientRoleType: ClientRoleType.ClientRoleAudience,
            publishMicrophoneTrack: true,
            autoSubscribeAudio: true,
            audienceLatencyLevel:
              AudienceLatencyLevelType.AudienceLatencyLevelUltraLowLatency,
          },
        );
      }
      // Check if joinChannel was successful
      if (result1 < 0) {
        throw new Error(`Failed to join channel. Error code: ${result1}`);
      }
      if (result1 == 0) {
        dispatch(setLiveStatus('LOADING'));
        console.log('Successfully joined the channel!');
      }
    } catch (error: any) {
      console.error('Failed to join the channel:', error.message);
      throw new Error('Unable to connect to the channel. Please try again.');
    }
  };

  const checkPermission = async () => {
    const cam = await checkMicrophonePermission();
    if (cam) {
      return true;
    }
  };
  const endPodcastForUser = async () => {
    try {
      if (podcast.chat_room_id) {
        if (podcast.host == user.id) {
          chatClient.roomManager.destroyChatRoom(
            podcast.chat_room_id || roomId,
          );
        } else {
          await chatClient.roomManager.leaveChatRoom(podcast.chat_room_id);
        }
      }

      destroyEngine();
      resetPodcastState(dispatch);
      setTimeout(() => {
        dispatch(setLeaveModal(false));
        dispatch(setPodcast(''));
        dispatch(setIsJoined(false));
        timeOutScreen(false);
        dispatch(setLiveStatus('IDLE'));
        navigation.navigate('HomeB');
      }, 400);
    } catch (error) {
      console.log(error);
    }
  };
  const destroyEngine = () => {
    const res = agoraEngineRef.current?.leaveChannel();
    agoraEngineRef.current?.unregisterEventHandler(eventHandler.current!);
    agoraEngineRef.current?.release();
  };

  const leaveAgoraChannel = () => {
    try {
      const res = agoraEngineRef.current?.leaveChannel();
      dispatch(setIsJoined(false)); // Important to reset flag
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const podCastNotifications = async () => {
    try {
      const res = await axiosInstance.get('podcast-notification');
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const muteUnmuteUser = (item: any) => {
    console.log(item, user.id, podcast.host);
    if (user.id !== podcast.host) {
      return;
    }
    let update = [...podcastListeners];

    const updatedData = update.map((obj: any) => {
      if (obj.id === item.id) {
        agoraEngineRef.current?.muteRemoteAudioStream(
          item.user.id,
          !item.muted,
        );
        return {...obj, muted: !item.muted};
      }
      return obj;
    });

    // Update state or variable if necessary
    dispatch(setPodcastListeners(updatedData)); // Assuming podcastListeners is state
  };
  const leavePodcast = () => {
    if (!isJoined) {
      navigation.navigate('HomeB');
      return;
    }
    dispatch(setLeaveModal(true));
  };
  const formatTime = timeInSeconds => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0',
    )}`;
  };

  return (
    <ImageBackground style={[styles.image]} source={IMAGES.streamingbg}>
      <View style={{flex: 1}}>
        <View
          style={[
            styles.image,
            {
              paddingTop: Platform.OS === 'ios' ? 50 : 10,
              justifyContent: 'space-between',
            },
          ]}>
          {/* ************ Header Start ************ */}
          <View>
            <LiveHeader
              user={user}
              navigation={navigation}
              token={token}
              liveEvent={podcast}
              envVar={envVar}
              leavePodcast={leavePodcast}
              connected={connected}
            />
            <View
              style={{
                flexDirection: 'row',
                width: '50%',
                justifyContent: 'space-around',
                marginHorizontal: 10,
              }}>
              <ImageBackground
                source={IMAGES.Rectangle}
                borderRadius={25}
                style={{padding: 7, justifyContent: 'center'}}>
                <Text style={{color: 'white'}}>
                  💎 {user?.wallet?.diamonds ? user?.wallet?.diamonds : 0}
                </Text>
              </ImageBackground>
              <ImageBackground
                source={IMAGES.Rectangle}
                borderRadius={25}
                style={{padding: 7, justifyContent: 'center'}}>
                <Text style={{color: 'white'}}>12343</Text>
              </ImageBackground>
              <ImageBackground
                source={IMAGES.Rectangle}
                borderRadius={25}
                style={{padding: 7, justifyContent: 'center'}}>
                <Image source={IMAGES.music} style={{width: 25, height: 25}} />
              </ImageBackground>
            </View>
            <Text
              onPress={() => dispatch(removeUserFromSingleStream(1))}
              style={[
                appStyles.bodyMd,
                {
                  color: colors.complimentary,
                  marginHorizontal: '8%',
                  marginVertical: '2%',
                },
              ]}>
              {/* Duration:{' '} */}
              <Text style={[{color: colors.golden}]}>{formatTime(time)}</Text>
            </Text>
          </View>

          {/* ************ Header end ************ */}
          {/* ************ second row ************ */}
          {/* <PodcastStatus /> */}
          {/* ************ second row ************ */}
          <View>
            <View style={styles.container}>
              <View style={styles.row}>
                <View style={styles.micWrapper}>
                  <Image source={IMAGES.mic} style={styles.micImage} />
                </View>

                <View style={styles.profileWrapper}>
                  <ImageBackground
                    source={IMAGES.RectangleWithLine}
                    style={styles.rectangleImage}>
                    <View style={styles.profileImageWrapper}>
                      <PodcastGuest
                        muteUnmuteUser={muteUnmuteUser}
                        token={token}
                        handleOpenSheet2={handleOpenSheet2}
                        // item={item}
                        user={user}
                        dispatch={dispatch}
                      />
                    </View>

                    <View style={styles.iconWrapper}>
                      <View style={styles.emptySeat}>
                        <Icon name="sofa-single" color={'#CDC6CE'} size={30} />
                      </View>
                    </View>
                  </ImageBackground>
                </View>
              </View>
              <View>
                <Text style={{textAlign: 'center', padding: 5}}>😉😌</Text>
                <Text style={{textAlign: 'center', color: 'white'}}>😉 0</Text>
              </View>
            </View>
            <FlatList
              data={podcastListeners}
              numColumns={4}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{
                alignItems: 'center',
              }}
              renderItem={({item, index}) => (
                <View style={[styles.podcastHost]}>
                  <View style={{alignItems: 'center', gap: 5}}>
                    <View style={styles.emptySeat}>
                      <Icon name="sofa-single" color={'#CDC6CE'} size={30} />
                    </View>

                    <Text
                      style={[
                        appStyles.regularTxtMd,
                        {color: colors.complimentary, textAlign: 'center'},
                      ]}>
                      {item.seatNo}
                    </Text>
                  </View>
                </View>
              )}
            />
          </View>
          {leaveModal && (
            <EndLive
              user={user}
              endPodcastForUser={endPodcastForUser}
              navigation={navigation}
              id={podcast.id}
              live={false}
              PK={false}
              battle={''}
            />
          )}

          <BottomSheet
            index={-1}
            enablePanDownToClose={true}
            // snapPoints={[sheetType == 'avatar' ? '45%' : '60%']}
            snapPoints={['60%']}
            ref={bottomSheetRef}
            handleStyle={{
              backgroundColor: colors.LG,
            }}
            handleIndicatorStyle={{
              backgroundColor: colors.complimentary,
            }}
            onChange={handleSheetChanges}>
            <BottomSheetView style={styles.contentContainer}>
              {sheetType == 'gifts' ? (
                <Gifts />
              ) : sheetType == 'avatar' ? (
                <AvatarSheet
                  navigation={navigation}
                  token={token}
                  envVar={envVar}
                />
              ) : sheetType == 'users' ? (
                <Users />
              ) : (
                <Tools />
              )}
            </BottomSheetView>
          </BottomSheet>

          {!sheet && (
            <BottomSection
              single={false}
              roomId={podcast.chat_room_id}
              handleOpenSheet={handleOpenSheet}
            />
          )}
        </View>
        {liveStatus == 'LOADING' && <LiveLoading />}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  ...liveStyles,
  tempBtn: {marginLeft: 10, padding: 10, backgroundColor: colors.accent},
  tempBtnTxt: {
    color: colors.complimentary,
  },
  podcastHost: {
    width: Dimensions.get('window').width * 0.25,
    alignSelf: 'stretch',
    marginBottom: 20,
  },
  rectangleImage: {
    alignSelf: 'center',
    width: 150,
    height: 50,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },

  container: {
    width: '60%',
    alignSelf: 'center',
    marginVertical: 15,
  },
  row: {
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
  },
  micWrapper: {
    alignSelf: 'center',
    width: 70,
    height: 70,
    padding: 10,
  },
  micImage: {
    width: '100%',
    height: '100%',
  },
  profileWrapper: {
    alignSelf: 'center',
  },
  rectangleImageBg: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  profileImageWrapper: {
    alignItems: 'center',
    width: 50,
    height: 50,
    borderRadius: 50,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  iconWrapper: {
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  emptySeat: {
    width: 40,
    height: 40,
    borderRadius: 25,
    borderColor: colors.accent,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBar: {
    width: '100%',
    backgroundColor: '#545454',
    alignSelf: 'center',
  },
});
