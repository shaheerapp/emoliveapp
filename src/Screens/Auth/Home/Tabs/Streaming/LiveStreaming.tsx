import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  BackHandler,
  ImageBackground,
  Platform,
  NativeModules,
  StatusBar,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import React, {useRef, useEffect, useState, useCallback} from 'react';
import appStyles from '../../../../../styles/styles';
import {SafeAreaView} from 'react-native-safe-area-context';
import BottomSection from '../Components/BottomSection';
import AvatarSheet from '../Components/AvatarSheet';
import liveStyles from '../styles/liveStyles';
import SingleLive from './components/SingleLive';
import {
  createAgoraRtcEngine,
  ChannelProfileType,
  ClientRoleType,
  IRtcEngine,
  AudienceLatencyLevelType,
  UserOfflineReasonType,
  RtcSurfaceView,
  RtcConnection,
  IRtcEngineEventHandler,
  ConnectionStateType,
  ConnectionChangedReasonType,
} from 'react-native-agora';
import StreamStatus from './StreamStatus';
const {ScreenAwake} = NativeModules;
import LiveLoading from '../Components/LiveLoading';
const deviceWidth = Dimensions.get('window').width;
import Header from '../Podcast/Header';
import envVar from '../../../../../config/envVar';
import {setLiveStatus} from '../../../../../store/slice/usersSlice';
import {ChatClient} from 'react-native-agora-chat';
import {setLeaveModal} from '../../../../../store/slice/podCastSlice';
import {
  setUserInState,
  removeUserFromStream,
  getUserInfoFromAPI,
  getUserInfoFromAPIS,
  setStream,
  updateStreamRoomId,
  setPrevUsersInStream,
  removeUserFromSingleStream,
  setPrevUsersInSingleStream,
  addStreamListenerS,
  updateUserCamera,
  updatedMuteUnmuteUser,
} from '../../../../../store/slice/streamingSlice';
import {resetLiveStreaming, getLiveUsers} from '../scripts/liveScripts';
import {useSelector, useDispatch} from 'react-redux';
import EndLive from '../Podcast/EndLive';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../../../../styles/colors';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {
  checkCamPermission,
  checkMicrophonePermission,
} from '../../../../../scripts';
import {useAppContext} from '../../../../../Context/AppContext';
import Gifts from '../Podcast/Gifts';
import Users from '../Podcast/Users';
import Tools from '../Podcast/Tools';
import {setIsJoined} from '../../../../../store/slice/usersSlice';
import axiosInstance from '../../../../../Api/axiosConfig';
const MAX_RETRIES = 5;
const deviceHeight = Dimensions.get('window').height;

const STYLES = ['default', 'dark-content', 'light-content'] as const;

export default function LiveStreaming({navigation}) {
  const chatClient = ChatClient.getInstance();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const eventHandler = useRef<IRtcEngineEventHandler>(); // Implement callback functions
  const agoraEngineRef = useRef<IRtcEngine>(); // IRtcEngine instance
  const {userAuthInfo, tokenMemo} = useAppContext();
  const {stream, single, streamListeners, roomId} = useSelector(
    (state: any) => state.streaming,
  );
  const {isJoined, loading, liveStatus} = useSelector(
    (state: any) => state.users,
  );

  const {user, setUser} = userAuthInfo;
  const {token} = tokenMemo;
  const [sheet, setSheet] = useState<boolean>(false);
  const [sheetType, setSheetType] = useState<string | null>('');
  const dispatch = useDispatch();

  const {connected} = useSelector((state: any) => state.chat);

  useEffect(() => {
    if (!isJoined) return;

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
  // Generate a list of hosts

  useEffect(() => {
    // Initialize the engine when the App starts
    if (!isJoined) {
      setupVideoSDKEngine();
    }

    // Release memory when the App is closed
    return () => {
      // agoraEngineRef.current?.unregisterEventHandler(eventHandler.current!);
      // agoraEngineRef.current?.release();
    };
  }, [isJoined]);

  // Define the setupVideoSDKEngine method called when the App starts
  const setupVideoSDKEngine = async () => {
    try {
      // Create RtcEngine after obtaining device permissions

      console.log('initializing engine');
      agoraEngineRef.current = createAgoraRtcEngine();
      const agoraEngine = agoraEngineRef.current;
      eventHandler.current = {
        onJoinChannelSuccess: (_connection: RtcConnection, elapsed: number) => {
          if (single) {
            if (stream.host !== user.id) {
              dispatch(addStreamListenerS(user));
              return;
            }
          } else {
            if (stream.host !== user.id) {
              dispatch(getUserInfoFromAPI({id: stream.host}));
              return;
            }
            dispatch(setUserInState(user));
          }
          if (stream.host == user.id) {
            createUserChatRoom();
          } else {
            getStreamActiveUsers();
            userJoinChatRoom(stream.chat_room_id);
          }
        },
        onUserJoined: (_connection: RtcConnection, uid: number) => {
          if (uid !== user.id && !single) {
            dispatch(getUserInfoFromAPI({id: uid, remote: true}));
            return;
          }
          if (single) {
            dispatch(getUserInfoFromAPIS({id: uid, remote: true}));
          }
          // setRemoteUid(uid);
        },
        onLeaveChannel(connection, stats) {
          // if (connection.localUid !== stream.host) {
          //   if (single) {
          //     dispatch(removeUserFromSingleStream(connection.localUid));
          //     return;
          //   }
          //   dispatch(removeUserFromStream(connection.localUid));
          // }
          // if (connection.localUid === podcast.host) {
          //   console.log('host is lefting podcast');
          //   hostEndedPodcast();
          //   return;
          // }
          // console.log('new function', 'user has leaved the');
        },

        onUserOffline: (
          connection: RtcConnection,
          uid: number,
          reason: UserOfflineReasonType,
        ) => {
          if (reason == 0) {
            if (uid === stream.host) {
              hostEndedPodcast();
              return;
            }
            if (uid !== stream.host) {
              if (single) {
                dispatch(removeUserFromSingleStream(uid));
                return;
              }
              dispatch(removeUserFromStream(uid));
            }
          }
          if (reason == 1) {
            console.log(uid, 'are having network issues');
          }
        },
        onConnectionStateChanged: (
          _connection: RtcConnection,
          state: ConnectionStateType,
          reason: ConnectionChangedReasonType,
        ) => {
          console.log('state', state, 'reason', reason);
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
      agoraEngine.enableLocalVideo(true);
      userJoinChannel();
    } catch (e) {
      console.log(e);
    }
  };

  const hostEndedPodcast = async () => {
    // dispatch(setHostLeftPodcast(true));
    dispatch(setLeaveModal(true));
  };
  const getStreamActiveUsers = async () => {
    try {
      // console.log(podcast.id, 'getting podcast users ....');
      const users = await getLiveUsers(stream.id, 'stream');
      if (users.length > 0) {
        if (single) {
          dispatch(setPrevUsersInSingleStream(users));
          return;
        }
        dispatch(setPrevUsersInStream(users));
      }
    } catch (error) {
      console.error('Error getting active stream users:', error);
    }
  };
  const handelConnection = (state: number) => {
    switch (state) {
      case 3:
        dispatch(setLiveStatus('CONNECTED'));
        dispatch(setIsJoined(true));
        timeOutScreen(true);
        break;
      case 4:
        dispatch(setLiveStatus('LOADING'));
        break;
      case 5:
        dispatch(setLiveStatus('IDLE'));
        dispatch(setIsJoined(false));
        leaveAgoraChannel();
        break;
      case 1:
        dispatch(setLiveStatus('IDLE'));
        dispatch(setIsJoined(false));
        console.log('disconnected');
        break;
      default:
        break;
    }
  };
  const timeOutScreen = (val: boolean) => {
    try {
      if (Platform.OS !== 'android') return;
      ScreenAwake.keepAwake(val);
    } catch (error) {
      console.log(error);
    }
  };
  const leaveAgoraChannel = async () => {
    try {
      if (agoraEngineRef.current) {
        agoraEngineRef.current.leaveChannel(); // Leave the channel
        dispatch(setIsJoined(false));
        timeOutScreen(false);
        console.log('Left the Agora channel successfully');
      } else {
        console.log('Agora engine is not initialized');
      }
    } catch (error) {
      console.log('Error leaving the channel:', error);
    }
  };

  const userJoinChannel = async () => {
    console.log('Connecting...', isJoined, user.id, stream.host);
    // return;
    const permission = checkPermission();
    if (!permission) {
      console.log('permssion required');
      return;
    }

    // Exit if already joined
    if (isJoined) {
      console.log('User is already in the channel.');
      return;
    }

    try {
      // Check if Agora engine is initialized
      if (!agoraEngineRef.current) {
        throw new Error('Agora engine is not initialized.');
      }
      let result1;
      if (user.id == stream.host) {
        console.log('Joining stream as a host...');
        result1 = agoraEngineRef.current.joinChannel(
          String(user.agora_rtc_token),
          String(stream.channel),
          user.id,
          {
            clientRoleType: ClientRoleType.ClientRoleBroadcaster,
            publishMicrophoneTrack: true,
            autoSubscribeAudio: true,
            publishCameraTrack: true,
            autoSubscribeVideo: true,
          },
        );
      } else {
        console.log('Joining as an audience...');
        result1 = agoraEngineRef.current.joinChannel(
          String(user.agora_rtc_token),
          String(stream.channel),
          user.id,
          {
            clientRoleType: ClientRoleType.ClientRoleBroadcaster,
            // clientRoleType: ClientRoleType.ClientRoleAudience,
            publishMicrophoneTrack: true,
            autoSubscribeAudio: true,
            publishCameraTrack: true,
            autoSubscribeVideo: true,
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
        console.log('Successfully joined the channel x');
        // setIsJoined(true); // Update joined state
      }
    } catch (error: any) {
      console.error('Failed to join the channel:', error.message);
      throw new Error('Unable to connect to the channel. Please try again.');
    }
  };

  const checkPermission = async () => {
    const cam = await checkCamPermission();
    const microphone = await checkMicrophonePermission();
    if (cam || microphone) {
      return true;
    }
    Alert.alert('Permission Required', 'Unable to start Live');
  };

  const createUserChatRoom = async (retryCount = 0) => {
    try {
      if (!connected) {
        console.log('Not connected, logging in first...');
        return;
      }
      const chatRoom = await chatClient.roomManager.createChatRoom(
        'Stream Starting',
        'Hi',
        'welcome',
        [],
        5,
      );

      const roomId = chatRoom.roomId;
      saveChatRoomId(roomId);
      userJoinChatRoom(roomId);
      dispatch(updateStreamRoomId(roomId));
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

  const userJoinChatRoom = async (roomId: any) => {
    try {
      if (roomId) return;
      await chatClient.roomManager.joinChatRoom(roomId);
    } catch (error) {
      console.log(error);
    }
  };

  const saveChatRoomId = async (roomId: string, retryCount = 0) => {
    try {
      const url = 'stream/save-roomId';
      const data = {
        chatRoomId: roomId,
        id: stream.id,
      };
      const res = await axiosInstance.post(url, data);
      dispatch(setStream(res.data.stream));

      console.log(res.data);
    } catch (error) {
      console.log(error);
      if (retryCount < MAX_RETRIES) {
        const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
        console.log(`Retrying in ${delay / 1000} seconds...`);
        setTimeout(() => saveChatRoomId(roomId, retryCount + 1), delay);
      } else {
        Alert.alert(
          'Network Error',
          'Failed to create chat room after multiple attempts.',
        );
      }
    }
  };

  const toggleMute = (item: any) => {
    try {
      if (agoraEngineRef.current) {
        // Toggle mute/unmute for the remote user
        agoraEngineRef.current.muteLocalAudioStream(item.muted);
        console.log(item.user.id, single);
        dispatch(updatedMuteUnmuteUser({id: item.user.id, single}));
      }
    } catch (error) {
      console.error('Error toggling mute:', error);
    }
  };
  const offCamera = (item: any) => {
    try {
      if (agoraEngineRef.current) {
        // Toggle mute/unmute for the remote user
        if (item.camOn) {
          agoraEngineRef.current.disableVideo();
        } else {
          agoraEngineRef.current.enableVideo();
        }
        dispatch(updateUserCamera({id: item.user.id, single}));
      }
    } catch (error) {
      console.error('Error toggling mute:', error);
    }
  };
  const endPodcastForUser = async () => {
    try {
      if (stream.chat_room_id) {
        if (stream.host == user.id) {
          chatClient.roomManager.destroyChatRoom(stream.chat_room_id || roomId);
        } else {
          await chatClient.roomManager.leaveChatRoom(stream.chat_room_id);
        }
      }
      destroyEngine();
      setTimeout(() => {
        dispatch(setLeaveModal(false));
        dispatch(setStream(''));
        dispatch(setIsJoined(false));
        navigation.navigate('HomeB');
      }, 400);
    } catch (error) {
      console.log(error);
    }
  };

  const destroyEngine = () => {
    resetLiveStreaming(dispatch);
    try {
      agoraEngineRef.current?.leaveChannel();
      agoraEngineRef.current?.unregisterEventHandler(eventHandler.current!);
      agoraEngineRef.current?.release();
    } catch (error) {
      console.log(error);
    }
  };
  const toggleCamera = () => {
    try {
      if (agoraEngineRef.current) {
        const res = agoraEngineRef.current.switchCamera();
        console.log(res);
      }
    } catch (error) {
      console.error('Error toggling mute:', error);
    }
  };

  const leaveStream = () => {
    dispatch(setLeaveModal(true));
  };

  // Function to handle open Bottom Sheet
  const handleOpenSheet = useCallback((type: string) => {
    setSheet(true);
    setSheetType(type);
    bottomSheetRef.current?.expand();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    if (index < 0) setSheet(false);
  }, []);
  // Render a single host view
  return (
    <SafeAreaView edges={['top']} style={{flex: 1, backgroundColor: colors.LG}}>
      <StatusBar
        barStyle="light-content" // Text color: 'dark-content' or 'light-content'
        hidden={false} // Whether the status bar should be hidden or not
      />
      <View style={styles.container}>
        {single ? (
          <View
            style={{
              position: 'relative',
              flex: 1,
              backgroundColor: colors.LG,
            }}>
            <View style={{position: 'relative'}}>
              <Header
                user={user}
                navigation={navigation}
                token={token}
                liveEvent={stream}
                envVar={envVar}
                leavePodcast={leaveStream}
                connected={connected}
              />
            </View>
            <View style={{height: deviceHeight * 1, position: 'relative'}}>
              <SingleLive
                token={token}
                user={user}
                isJoined={isJoined}
                toggleMute={toggleMute}
                offCamera={offCamera}
                toggleCamera={toggleCamera}
              />
              {/* {isJoined && <SingleLive user={user} />} */}
            </View>
            {!sheet && (
              <BottomSection
                single={true}
                roomId={stream.chat_room_id}
                handleOpenSheet={handleOpenSheet}
              />
            )}
          </View>
        ) : (
          <ImageBackground
            style={styles.image}
            source={require('../../../../../assets/images/LiveBg.png')}>
            <Header
              user={user}
              navigation={navigation}
              token={token}
              liveEvent={stream}
              envVar={envVar}
              leavePodcast={leaveStream}
              connected={connected}
            />
            <StreamStatus />
            <View
              style={{
                height:
                  streamListeners.length > 6
                    ? deviceWidth * 0.963
                    : streamListeners.length > 3
                    ? deviceWidth * 0.7
                    : deviceWidth * 0.4,
              }}>
              <FlatList
                data={streamListeners}
                contentContainerStyle={{paddingBottom: 40}}
                renderItem={({item}) => (
                  <View style={styles.hostView}>
                    {item.user ? (
                      <>
                        <React.Fragment key={item.user.id}>
                          {item.camOn ? (
                            <RtcSurfaceView
                              canvas={{
                                uid: user.id == item.user.id ? 0 : item.user.id,
                              }}
                              style={styles.videoView}
                            />
                          ) : (
                            <View style={{backgroundColor: colors.accent}}>
                              <Image
                                source={
                                  item.user.avatar
                                    ? {
                                        uri:
                                          envVar.API_URL +
                                          'display-avatar/' +
                                          item.user.id,
                                        headers: {
                                          Authorization: `Bearer ${token}`,
                                        },
                                      }
                                    : require('../../../../../assets/images/place.jpg')
                                }
                              />
                            </View>
                          )}

                          <Text style={styles.userTxt}>
                            {item.user.first_name + ' ' + item.user.last_name}
                          </Text>
                          {item.user.id == user.id && (
                            <>
                              <TouchableOpacity
                                style={{position: 'absolute', right: 5, top: 3}}
                                onPress={() => toggleCamera()}>
                                <Icon
                                  name="camera-flip-outline"
                                  size={20}
                                  color={colors.complimentary}
                                />
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={{position: 'absolute', left: 2, top: 3}}
                                onPress={() => toggleMute(item)}>
                                <Icon
                                  name={
                                    item.muted ? 'microphone-off' : 'microphone'
                                  }
                                  size={20}
                                  color={colors.complimentary}
                                />
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={{
                                  position: 'absolute',
                                  right: 5,
                                  bottom: 3,
                                }}
                                onPress={() => offCamera(item)}>
                                <Icon
                                  name={
                                    item.camOn
                                      ? 'camera-off-outline'
                                      : 'camera-outline'
                                  }
                                  size={20}
                                  color={colors.complimentary}
                                />
                              </TouchableOpacity>
                            </>
                          )}
                        </React.Fragment>
                      </>
                    ) : (
                      <View style={{alignItems: 'center'}}>
                        <TouchableOpacity>
                          <Icon
                            name="sofa-single"
                            color={'#CDC6CE'}
                            size={60}
                          />
                          <Text
                            style={[
                              appStyles.bodyMd,
                              {color: colors.complimentary},
                            ]}>
                            Apply to join
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
                numColumns={3}
              />
            </View>
            {/* <KeyboardAvoidingView> */}
            {!sheet && (
              <BottomSection
                single={single}
                roomId={stream.chat_room_id}
                handleOpenSheet={handleOpenSheet}
              />
            )}
            {/* </KeyboardAvoidingView> */}
          </ImageBackground>
        )}
        <EndLive
          user={user}
          endPodcastForUser={endPodcastForUser}
          navigation={navigation}
          id={stream.id}
          live={true}
          PK={false}
          battle={''}
        />
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

        {liveStatus == 'LOADING' && <LiveLoading />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  ...liveStyles,
  muteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 5,
    borderRadius: 50,
  },
  CamButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 5,
    borderRadius: 50,
  },
  tempBtn: {marginLeft: 10, padding: 10, backgroundColor: colors.accent},
  tempBtnTxt: {
    color: colors.complimentary,
  },
  hostView: {
    // flex: 0.3,
    width: deviceWidth * 0.332,
    height: deviceWidth * 0.32,
    // aspectRatio: 1, // Ensure each host view is square
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Transparent white
    borderWidth: 1,
    borderColor: '#ccc',
  },
  videoView: {
    width: '100%',
    flex: 1,
    height: '100%',
    backgroundColor: 'red',
  },
  userTxt: {
    position: 'absolute',
    bottom: 10,
    textAlign: 'center',
    alignSelf: 'center',
    color: colors.complimentary,
  },
});
