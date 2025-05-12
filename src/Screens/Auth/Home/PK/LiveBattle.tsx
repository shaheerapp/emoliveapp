import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  NativeModules,
  Image,
  TextInput,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import React, {useRef, useEffect, useState, useCallback} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import appStyles from '../../../../styles/styles';
import mainStyles from './style/mainStyle';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import Gifts from '../Tabs/Podcast/Gifts';
import AvatarSheet from '../Tabs/Components/AvatarSheet';
import Users from '../Tabs/Podcast/Users';
import Tools from '../Tabs/Podcast/Tools';
const {ScreenAwake} = NativeModules;
import {
  checkCamPermission,
  checkMicrophonePermission,
} from '../../../../scripts';
import axiosInstance from '../../../../Api/axiosConfig';
import envVar from '../../../../config/envVar';
import EndLive from '../Tabs/Podcast/EndLive';
import LiveLoading from '../Tabs/Components/LiveLoading';
// import { AxiosInstance } from 'axios';

import {
  createAgoraRtcEngine,
  ChannelProfileType,
  ClientRoleType,
  IRtcEngine,
  AudienceLatencyLevelType,
  RtcSurfaceView,
  RtcConnection,
  UserOfflineReasonType,
  IRtcEngineEventHandler,
  ConnectionStateType,
  ConnectionChangedReasonType,
  VideoSourceType,
} from 'react-native-agora';
import {ChatClient} from 'react-native-agora-chat';
import {useSelector, useDispatch} from 'react-redux';
import {setLeaveModal} from '../../../../store/slice/podCastSlice';
import {setLiveStatus, setIsJoined} from '../../../../store/slice/usersSlice';
import {resetBattle} from '../Tabs/scripts/liveScripts';
import PKHeader from './components/PKHeader';
import {colors} from '../../../../styles/colors';
import BattleInfo from './components/BattleInfo';
// import PKB from './components/BattleInfo';
import PKBottom from './components/PKBottom';
import {
  setBattle,
  updateMuteUnmuteUser,
  setUserInBattle,
  updateUserCamera,
} from '../../../../store/slice/PK/battleSlice';
import {
  getUserInfoFromAPI,
  saveBattleRoomId,
} from '../../../../store/slice/PK/battleAsync';
import SupportViewers from './components/SupportViewers';
import Comment from './components/Comment';
import {useAppContext} from '../../../../Context/AppContext';
const MAX_RETRIES = 5;
const deviceHeight = Dimensions.get('window').height;

interface LiveBattle {
  navigation: any;
}
export default function LiveBattle({navigation}: LiveBattle) {
  const chatClient = ChatClient.getInstance();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const eventHandler = useRef<IRtcEngineEventHandler>(); // Implement callback functions
  const agoraEngineRef = useRef<IRtcEngine>(); // IRtcEngine instance
  const {userAuthInfo, tokenMemo} = useAppContext();
  const {battle, roomId, battleHosts} = useSelector(
    (state: any) => state.battle,
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
          if (battle.user1_id !== user.id) {
            dispatch(getUserInfoFromAPI(battle.user1_id));
            return;
          }
          dispatch(setUserInBattle(user));

          if (battle.user1_id == user.id) {
            createUserChatRoom();
          } else {
            // getStreamActiveUsers();
            userJoinChatRoom(battle.chat_room_id);
          }
        },
        onUserJoined: (_connection: RtcConnection, uid: number) => {
          if (uid !== user.id) {
            dispatch(getUserInfoFromAPI(uid));
            return;
          }
          // setRemoteUid(uid);
        },
        onLeaveChannel(connection, stats) {
          console.log('leave channel ...');
          if (connection.localUid !== battle.user1_id) {
            // dispatch(removeUserFromStream(connection.localUid));
          }
          // if (connection.localUid === podcast.host) {
          //   console.log('host is lefting podcast');
          //   hostEndedPodcast();
          //   return;
          // }
          console.log('new function', 'user has leaved the');
        },

        onUserOffline: (
          connection: RtcConnection,
          uid: number,
          reason: UserOfflineReasonType,
        ) => {
          if (reason == 0) {
            if (uid === battle.user1_id) {
              hostEndedPodcast();
              return;
            }
            // if (uid !== battle.host) {
            //   // dispatch(removeUserFromStream(uid));
            // }
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
    console.log('Connecting...', isJoined, user.id, battle.user1_id);
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
      if ([battle.user1_id, battle.user2_id].includes(user.id)) {
        // if (user.id == battle.user1_id ||battle.user2_id) {
        console.log('Joining stream as a host...');
        result1 = agoraEngineRef.current.joinChannel(
          String(user.agora_rtc_token),
          String(battle.channel),
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
          String(battle.channel),
          user.id,
          {
            clientRoleType: ClientRoleType.ClientRoleAudience,
            // clientRoleType: ClientRoleType.ClientRoleAudience,
            // publishMicrophoneTrack: true,
            autoSubscribeAudio: true,
            // publishCameraTrack: true,
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
      dispatch(saveBattleRoomId(roomId));
      userJoinChatRoom(roomId);
      // dispatch(updateStreamRoomId(roomId));
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
  const leaveStream = () => {
    dispatch(setLeaveModal(true));
  };
  // Function to handle open Bottom Sheet
  const handleOpenSheet = useCallback((type: string) => {
    setSheet(true);
    setSheetType(type);
    bottomSheetRef.current?.expand();
  }, []);

  const endPodcastForUser = async () => {
    try {
      if (battle.chat_room_id) {
        if (battle.user1_id == user.id) {
          chatClient.roomManager.destroyChatRoom(battle.chat_room_id || roomId);
        } else {
          await chatClient.roomManager.leaveChatRoom(battle.chat_room_id);
        }
      }
      destroyEngine();
      setTimeout(() => {
        dispatch(setLeaveModal(false));
        dispatch(setBattle(''));
        dispatch(setIsJoined(false));
        navigation.navigate('HomeB');
      }, 400);
    } catch (error) {
      console.log(error);
    }
  };
  const destroyEngine = () => {
    resetBattle(dispatch);
    try {
      agoraEngineRef.current?.leaveChannel();
      agoraEngineRef.current?.unregisterEventHandler(eventHandler.current!);
      agoraEngineRef.current?.release();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSheetChanges = useCallback((index: number) => {
    if (index < 0) setSheet(false);
  }, []);

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

  const toggleMute = (item: any) => {
    try {
      if (agoraEngineRef.current) {
        // Toggle mute/unmute for the remote user
        agoraEngineRef.current.muteLocalAudioStream(item.muted);
        dispatch(updateMuteUnmuteUser(item.user.id));
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
        dispatch(updateUserCamera(item.user.id));
      }
    } catch (error) {
      console.error('Error toggling mute:', error);
    }
  };

  return (
    <View style={styles.container}>
      <PKHeader
        liveEvent={battle}
        token={token}
        user={user}
        leavePodcast={leaveStream}
        navigation={navigation}
      />

      {/* match info */}
      <BattleInfo />
      <View style={{flexDirection: 'row'}}>
        <View style={styles.user1Score}>
          <Text style={styles.countLeft}>0</Text>
        </View>
        <View style={styles.user2Score}>
          <Text style={[styles.count, {textAlign: 'right'}]}>0</Text>
        </View>
      </View>
      <View style={{position: 'relative'}}>
        <View style={styles.duration}>
          <Text
            style={{color: colors.complimentary}}
            onPress={() => console.log(battleHosts)}>
            V<Text style={{color: '#6E5ED4'}}>S</Text>{' '}
            {battle.duration || '10:20'}
          </Text>
        </View>
        {/* *** main **** */}
        <View style={{flexDirection: 'row'}}>
          <View style={styles.userLeft}>
            {isJoined ? (
              <>
                <RtcSurfaceView
                  canvas={{
                    uid: battle.user1_id == user.id ? 0 : battle.user1_id,
                  }}
                />
                {user.id == battle.user1_id && (
                  <>
                    <TouchableOpacity
                      style={styles.toggleCamLeft}
                      onPress={() => toggleCamera()}>
                      <Icon
                        name="camera-flip-outline"
                        size={20}
                        color={colors.complimentary}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.toggleMuteBtn}
                      onPress={() => toggleMute(battleHosts[0])}>
                      <Icon
                        name={
                          battleHosts[0].muted ? 'microphone-off' : 'microphone'
                        }
                        size={20}
                        color={colors.complimentary}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.offCamLeft}
                      onPress={() => offCamera(battleHosts[0])}>
                      <Icon
                        name={
                          battleHosts[0].camOn
                            ? 'camera-off-outline'
                            : 'camera-outline'
                        }
                        size={25}
                        color={colors.complimentary}
                      />
                    </TouchableOpacity>
                  </>
                )}
              </>
            ) : (
              <View style={{alignItems: 'center', marginTop: 140}}>
                <Text style={{color: colors.complimentary}}>
                  Connecting....
                </Text>
              </View>
            )}

            <View style={styles.winLeft}>
              <Text style={styles.winTxt}>
                WIN
                <Text style={styles.winCount}> x 1</Text>
              </Text>
            </View>
          </View>
          <View style={styles.userRight}>
            {isJoined ? (
              <>
                <RtcSurfaceView
                  canvas={{
                    uid: battle.user2_id == user.id ? 0 : battle.user2_id,
                  }}
                />
                {user.id == battle.user2_id && (
                  <>
                    <TouchableOpacity
                      style={styles.toggleCamLeft}
                      onPress={() => toggleCamera()}>
                      <Icon
                        name="camera-flip-outline"
                        size={20}
                        color={colors.complimentary}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.toggleMuteBtn}
                      onPress={() => toggleMute(battleHosts[1])}>
                      <Icon
                        name={
                          battleHosts[1].muted ? 'microphone-off' : 'microphone'
                        }
                        size={20}
                        color={colors.complimentary}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.offCamLeft}
                      onPress={() => offCamera(battleHosts[1])}>
                      <Icon
                        name={
                          battleHosts[1].camOn
                            ? 'camera-off-outline'
                            : 'camera-outline'
                        }
                        size={25}
                        color={colors.complimentary}
                      />
                    </TouchableOpacity>
                  </>
                )}
              </>
            ) : (
              <View style={{alignItems: 'center', marginTop: 140}}>
                <Text style={{color: colors.complimentary}}>
                  Connecting....
                </Text>
              </View>
            )}

            <View style={styles.winRight}>
              <Text style={styles.winTxt}>
                WIN
                <Text style={styles.winCount}> x 10</Text>
              </Text>
            </View>
          </View>
        </View>

        {/* end */}

        {/* live support viewers */}
        <SupportViewers />
        {/* end */}

        {/* comment section */}
        <Comment />
        {/* end */}
      </View>

      {/* battle input */}
      {!sheet && (
        <PKBottom
          roomId={battle.chat_room_id}
          handleOpenSheet={handleOpenSheet}
        />
      )}

      {/* end */}

      {/* ****** ******** external ********  ********  */}

      <EndLive
        user={user}
        endPodcastForUser={endPodcastForUser}
        navigation={navigation}
        id={battle.id}
        live={false}
        PK={true}
        battle={battle}
      />

      {/* sheet  */}

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

      {/* ********  ******** end ********  ********  */}
    </View>
  );
}

const styles = StyleSheet.create({
  ...mainStyles,
  userLeft: {
    width: '50%',
    backgroundColor: colors.LR,
    height: deviceHeight * 0.35,
  },
  toggleCamLeft: {position: 'absolute', right: 5, top: 45},
  toggleMuteBtn: {position: 'absolute', left: 10, top: 45},
  offCamLeft: {
    position: 'absolute',
    right: 15,
    bottom: 10,
  },
  userRight: {width: '50%', position: 'relative'},
  user1Score: {backgroundColor: '#e93d53', width: '60%'},
  user2Score: {backgroundColor: '#058CFF', width: '40%'},
  winTxt: {...appStyles.regularTxtMd, color: '#F8E4B6'},
  winCount: {...appStyles.bodyMd, color: '#fff'},
});
