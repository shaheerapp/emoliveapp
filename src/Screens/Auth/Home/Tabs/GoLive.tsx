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
  AppState,
  AppStateStatus,
  TouchableOpacity,
  Modal,
} from 'react-native';
const { ScreenAwake } = NativeModules;
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconM from 'react-native-vector-icons/FontAwesome6';
import liveStyles from './styles/liveStyles';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const deviceWidth = Dimensions.get('window').width;

import React, {
  useRef,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from 'react';
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
  AudioProfileType,
  AudioScenarioType,
  UserInfo,
} from 'react-native-agora';
import { ChatClient } from 'react-native-agora-chat';

import AvatarSheet from './Components/AvatarSheet';
import BottomSection from './Components/BottomSection';
import PodcastGuest from './Podcast/PodcastGuest';
import { resetPodcastState, getLiveUsers } from './scripts/liveScripts';
import Header from './Podcast/Header';

import { useSelector, useDispatch } from 'react-redux';
import axiosInstance from '../../../../Api/axiosConfig';
import EndLive from './Podcast/EndLive';
import Gifts from './Podcast/Gifts';
import {
  setLiveStatus,
  setSelectedWallpaper,
} from '../../../../store/slice/usersSlice';

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
  updatePodcastListeners,
  updateSeatLockStatus,
  incrementListenerCoins,
} from '../../../../store/slice/podCastSlice';
import { setIsJoined } from '../../../../store/slice/usersSlice';
import { checkMicrophonePermission } from '../../../../scripts';
import LiveLoading from './Components/LiveLoading';
import { useAppContext } from '../../../../Context/AppContext';

import LiveHeader from './LiveHeader';
import { appStyles, axios } from './Podcast/podcastImport';
import { IMAGES } from '../../../../assets/images';
import { colors } from '../../../../styles/colors';
import { Image } from 'react-native';
import {
  getUserInfoFromAPIS,
  removeUserFromSingleStream,
} from '../../../../store/slice/streamingSlice';
import Games from '../../Games/Games';
import BottomGames from '../../Games/BottomGames';
import RoomSkin from './Components/RoomSkin';
import RBSheet from 'react-native-raw-bottom-sheet';
import { fetchText } from 'react-native-svg';
import Emoji from './Podcast/Emoji';
import { io } from 'socket.io-client';
import WaitingList from './Podcast/WaitingList';
import AnimatedToast from './Components/AnimatedToast';
import WinnerBanner from '../../../../Components/WinnerBanner';
import AnimatedComment from './Components/AnimatedComments';
import Toast from 'react-native-toast-message';
import LottieView from 'lottie-react-native';
import KeepAwake from 'react-native-keep-awake';
import { formatNumber } from '../../../../utils/generalScript';

const MAX_RETRIES = 3;

export default function GoLive({ navigation, route }: any) {
  const chatClient = ChatClient.getInstance();
  const agoraEngineRef = useRef<IRtcEngine | null>(null);
  const eventHandler = useRef<IRtcEngineEventHandler | null>(null);
  const dispatch = useDispatch();
  const [time, setTime] = useState(0);
  const { selectedWallpaper } = useSelector((state: any) => state.users);
  const { connected } = useSelector((state: any) => state.chat);
  const { podcast, podcastListeners, rtcTokenRenewed, leaveModal } =
    useSelector((state: any) => state.podcast);
  const [activeEmojis, setActiveEmojis] = useState<{
    [key: number]: { emoji: any; timestamp: number };
  }>({});
  const socketRef = useRef<any>(null);
  const { isJoined, liveStatus, roomId } = useSelector(
    (state: any) => state.users,
  );

  const { userAuthInfo, tokenMemo } = useAppContext();
  const { user, setUser } = userAuthInfo;
  const [hostUser, setHostUser] = useState<any>([]);
  const [hostCoins, setHostCoins] = useState(0);
  const { token } = tokenMemo;
  const bottomSheetRef = useRef<RBSheet>(null);
  const lockUnlockRBSheetRef = useRef<RBSheet>(null);
  const bottomEmojiSheetRef = useRef<RBSheet>(null);
  const seatSelectionSheetRef = useRef<RBSheet>(null);
  const commentsListRef = useRef<FlatList>(null);
  const [sheetType, setSheetType] = useState<string | null>('');
  const [waitingList, setWaitingList] = useState<any[]>([]);
  const isHost = podcast.host === user.id;
  const [isWaitingApproval, setIsWaitingApproval] = useState(false);
  const [hostMuted, setHostMuted] = useState(false);
  const [IsGameWinner, setIsGameWinner] = useState<any>({});
  const [winAmount, setWinAmount] = useState(0);
  const [isToggleOn, setIsToggleOn] = useState(false);
  const [showSeatModal, setShowSeatModal] = useState(false);
  const [availableSeats, setAvailableSeats] = useState<any[]>([]);
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [giftAnimationForUser, setGiftAnimationForUser] = useState<{
    userId: any;
    giftImage: any;
  } | null>(null);

  const { isWaiting, currentPodcast } = route.params || {};
  const [toasts, setToasts] = useState<
    Array<{ id: string; message: string; type: 'success' | 'error' }>
  >([]);
  const [comments, setComments] = useState<
    Array<{
      id: string;
      message: string;
      name: string;
      userId: any;
      avatar: any;
      type: 'message' | 'comment';
    }>
  >([]);

  const [selectedSeat, setSelectedSeat] = useState<{
    seatNo: number;
    locked: boolean;
  } | null>(null);

  const stateRef = useRef<any>();
  stateRef.current = {
    podcast,
    user,
    dispatch,
    podcastListeners,
  };

  // callbacks

  useEffect(() => {
    KeepAwake.activate();
    return () => {
      KeepAwake.deactivate();
    };
  }, []);

  useEffect(() => {
    if (podcast.coin_earned > 0) {
      setHostCoins(podcast.coin_earned);
    }
  }, []);

  useEffect(() => {
    console.log('Podcast Lintiners: ', podcastListeners);
  }, [podcastListeners]);

  useEffect(() => {
    if (isWaiting) {
      getPodcastUsers();
      setIsWaitingApproval(true);
    }
  }, []);

  useEffect(() => {
    Toast.show({
      type: 'error', // or 'error' | 'info'
      text1: 'Important Notice!',
      text2:
        'Any sexual or violation content is strictly prohibited.All violators will be banned.Do not expose your personal info such as phone or location.',
      position: 'top', // or 'bottom'
      visibilityTime: 5000, // in milliseconds (5 seconds)
      autoHide: true,
    });
  }, []);

  useEffect(() => {
    console.log('Received User: ', IsGameWinner);
    if (IsGameWinner?.id && winAmount > 0) {
      const timer = setTimeout(() => {
        setIsGameWinner({});
        setWinAmount(0);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [IsGameWinner, winAmount]);

  // Helper function to add toasts
  const addToast = (message: string, type: 'success' | 'error') => {
    const id = Math.random().toString(36).substring(7);
    setToasts(prev => [...prev, { id, message, type }]);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handleApproval = async (data: {
    podcastId: string;
    channelId: string;
  }) => {
    try {
      // Join the podcast channel
      const joinResponse = await axiosInstance.post('podcast/join', {
        channel: data.channelId,
        id: data.podcastId,
      });

      // Update state with the joined podcast
      setUser(joinResponse.data.user);
      // Initialize Agora engine if not already done
      if (!agoraEngineRef.current) {
        await setupVideoSDKEngine();
      }

      // Join the Agora channel with proper token and UID
      await agoraEngineRef.current?.joinChannel(
        joinResponse.data.user.agora_rtc_token,
        data.channelId,
        Number(joinResponse.data.user.id), // UID should be number
        {
          channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
          clientRoleType: ClientRoleType.ClientRoleBroadcaster,
        },
      );

      // Set joined status
      setIsWaitingApproval(false);
      console.log('Successfully joined channel');
    } catch (error) {
      console.error('Error joining after approval:', error);
      Alert.alert('Error', 'Failed to join after approval');
    }
  };

  useEffect(() => {
    console.log('podcast: ', podcast);
    console.log('User: ', user);
    // console.log('podcastListeners: ', podcastListeners);
    // console.log('Live Status: ', liveStatus);
    // console.log('Host: ', isHost);

    const interval = setInterval(() => {
      setTime(prevTime => prevTime + 1); // Increment time by 1 second
    }, 1000);
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const appState = useRef<AppStateStatus>(AppState.currentState);

  // useEffect(() => {
  //   const handleAppStateChange = (nextAppState: AppStateStatus) => {
  //     if (
  //       appState.current === 'active' &&
  //       (nextAppState === 'background' || nextAppState === 'inactive')
  //     ) {
  //       if (isJoined) {
  //         endPodcast();
  //       }
  //     }
  //     appState.current = nextAppState;
  //   };

  //   const subscription = AppState.addEventListener(
  //     'change',
  //     handleAppStateChange,
  //   );

  //   return () => {
  //     subscription.remove();
  //   };
  // }, [isJoined]);

  const fetchHost = async () => {
    try {
      const response = await axios.get(
        `${envVar.API_URL}public-user-info/${podcast.host}`,
      );
      const podcastResponse = await axios.get(
        `${envVar.API_URL}podcast/details/${podcast.id}`,
      );
      setHostUser(response.data.user);
      console.log(
        'Host Coins: ',
        Number(podcastResponse.data.podcast.coin_earned),
      );
      setHostCoins(Number(podcastResponse.data.podcast.coin_earned));
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    console.log('Host coins updated:', hostCoins);
  }, [hostCoins]);

  useEffect(() => {
    // Call initially
    fetchHost();

    // Set interval
    const interval = setInterval(() => {
      fetchHost();
    }, 3000); // 3000ms = 3 seconds

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, [podcast.host]);

  const handleHostMuteUpdate = (data: { hostId: string; muted: boolean }) => {
    setHostMuted(data.muted);
  };

  useEffect(() => {
    // Only initialize socket and emit join request if not host
    const initializeSocketAndJoinRequest = async () => {
      const newSocket = io(envVar.SOCKET_URL, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        query: {
          roomId: podcast.id,
          userId: user.id,
          isHost: isHost,
        },
      });

      // Store socket in ref
      socketRef.current = newSocket;

      // Connection events
      newSocket.on('connect', async () => {
        console.log('Socket connected:', newSocket.id);
        newSocket.emit('join-podcast-room', podcast.id);

        if (isWaiting) {
          newSocket.emit('request-seat-state', { requesterId: newSocket.id });
          console.log('request-seat-state sent...', newSocket.id);
        }
      });

      newSocket.on('connect_error', err => {
        console.log('Socket connection error:', err.message);
      });

      newSocket.on('disconnect', reason => {
        console.log('Socket disconnected:', reason);
        if (reason === 'io server disconnect') {
          setTimeout(() => newSocket.connect(), 1000);
        }
      });

      // Event handlers
      newSocket.on('user-wins', handleUserWin);
      newSocket.on('new-join-request', (request: any) => {
        console.log('New join request received:', request);
        if (request.podcastId === podcast.id) {
          if (user.id === podcast.host) {
            addToast(`${request.userData.name} wants to join`, 'success');
          }
          setWaitingList(prev => {
            const exists = prev.some(item => item.userId === request.userId);
            return exists
              ? prev
              : [
                  ...prev,
                  {
                    userId: request.userId,
                    userData: request.userData,
                    podcastId: request.podcastId,
                  },
                ];
          });
        }
      });

      // For users waiting for approval
      if (!isHost && route.params?.isWaiting) {
        newSocket.on(`user-approved-${user.id}`, handleApproval);
      }

      newSocket.on(
        `user-rejected-${user.id}`,
        (data: {
          podcastId: string;
          rejectedBy: string;
          timestamp: string;
        }) => {
          if (data.podcastId === podcast.id) {
            addToast('Your request was rejected', 'error');
          }
        },
      );

      // Keep this for host UI updates
      newSocket.on('user-rejected', data => {
        if (data.podcastId === podcast.id) {
          setWaitingList(prev => prev.filter(u => u.userId !== data.userId));
        }
      });

      newSocket.on('seat-locked', handleSeatLocked);

      newSocket.on('host-mute-updated', handleHostMuteUpdate);

      newSocket.on('user-mute-updated', data => {
        console.log('user-mute-updated received:', data);

        // Find the listener by seatNo or userId
        const listener = podcastListeners.find(
          (l: any) => l.seatNo === data.seatNo || l.user?.id === data.userId,
        );

        if (listener) {
          handleSocketMuteUnmuteUser({
            ...listener,
            muted: data.muted,
          });
        }
      });

      newSocket.on('bulk-seat-locked', ({ seats }) => {
        console.log('✅ Received bulk-seat-locked:', seats);
        seats.forEach(({ seatNo, locked }: any) => {
          dispatch(updateSeatLockStatus({ seatNo, locked }));
        });
      });

      newSocket.on('receive-comment', ({ name, userId, message, avatar }) => {
        console.log('📥 New comment received:', userId);
        if (userId !== user.id) {
          addComment(message, 'comment', name, userId, avatar);
        }
      });

      newSocket.on('force-leave-user', data => {
        if (data.userId === user.id && data.podcastId === podcast.id) {
          console.log('You were kicked. Leaving podcast...');
          endPodcastForUser();
        }
      });

      if (isHost) {
        newSocket.on('provide-seat-state', ({ requesterId }) => {
          console.log('Host received seat state request from', requesterId);

          const freshSeatStates = stateRef.current?.podcastListeners || [];

          newSocket.emit('send-seat-state-to-server', {
            to: requesterId,
            seatStates: freshSeatStates,
          });

          console.log('Host sent initial seat state to', requesterId);
        });
      }

      newSocket.on('wallpaper-changed-receive', data => {
        console.log('wallpaper received: ', data);
        if (data.podcastId === podcast.id) {
          dispatch(setSelectedWallpaper(data.wallpaperUrl));
        }
      });

      // Add this event listener
      newSocket.on(
        'emoji-received',
        (data: { userId: string; emoji: string; timestamp: number }) => {
          console.log('Received emoji from server:', data);
          setActiveEmojis(prev => ({
            ...prev,
            [data.userId]: {
              emoji: data.emoji,
              timestamp: data.timestamp,
            },
          }));
        },
      );

      newSocket.on('gift_received', data => {
        console.log('🎁 Gift received via socket:', data);

        const receiverId = Number(data.receiver_id);
        const rawAmount = data.amount;

        const amount = Number(rawAmount);
        if (isNaN(amount)) {
          console.warn('Invalid amount received:', rawAmount);
          return; // Skip invalid data
        }

        if (Number(receiverId) === Number(podcast.host)) {
          console.log('Amount:', amount + 'HostCoins: ' + hostCoins);
          fetchHost();
          // dispatch(incrementHostCoins(amount));
        } else {
          dispatch(
            incrementListenerCoins({ userId: Number(receiverId), amount }),
          );
        }

        // Trigger animation for receiver
        setGiftAnimationForUser({
          userId: receiverId,
          giftImage: `${envVar.IMAGES_URL}${data.gift_image}`,
        });
      });

      if (isWaiting) {
        // Any client: Receive seat state if it's for them
        newSocket.on('initial-seat-state', ({ to, seatStates }) => {
          console.log(
            'Received initial seat state for',
            to,
            'Current socket:',
            newSocket.id,
          );

          if (to === newSocket.id) {
            console.log('✅ Received seat state:', seatStates);
            dispatch(setPodcastListeners(seatStates));
          }
        });
      }

      return () => {
        newSocket.off('connect');
        newSocket.off('connect_error');
        newSocket.off('disconnect');
        newSocket.off('user-wins');
        newSocket.off('new-join-request');
        newSocket.off('user-rejected');
        newSocket.off('seat-locked');
        newSocket.off('bulk-seat-locked');
        newSocket.off('receive-comment');
        newSocket.off('initial-seat-state');
        newSocket.off('request-seat-state');
        newSocket.off('host-mute-updated');
        newSocket.off('force-leave-user');
        newSocket.off('emoji-received');
        newSocket.off('wallpaper-changed-receive');
        if (!isHost && route.params?.isWaiting) {
          newSocket.off(`user-approved-${user.id}`);
          newSocket.off(`user-rejected-${user.id}`);
        }
        newSocket.disconnect();
        socketRef.current = null;
      };
    };

    initializeSocketAndJoinRequest();
  }, [podcast.id, user.id, isHost, route.params?.isWaiting]);

  // Fetch initial waiting list
  useEffect(() => {
    fetchWaitingList();
  }, [isHost, podcast.id]);

  const fetchWaitingList = async () => {
    try {
      const response = await axiosInstance.get(
        `podcast/waiting-list/${podcast.id}`,
      );
      setWaitingList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSeatLocked = (data: { seatNo: number; locked: boolean }) => {
    console.log('Received seat-locked event:', data); // Add this for debugging
    dispatch(updateSeatLockStatus(data));
  };

  const addComment = (
    message: string,
    type: 'message' | 'comment',
    nameOverride?: string,
    userIdOverride?: any,
    avatar?: any,
  ) => {
    const id = Math.random().toString(36).substring(7);
    const name = nameOverride || `${user.first_name} ${user.last_name}`;
    const userIdToUse = userIdOverride || user.id;

    setComments(prev => {
      const updated = [
        ...prev,
        {
          id,
          message,
          name,
          userId: userIdToUse,
          avatar,
          type,
        },
      ];
      return updated.slice(-15); // Keep only the latest 15 comments
    });

    if (!nameOverride && !userIdOverride) {
      socketRef.current?.emit('comment-sent', {
        podcastId: podcast.id,
        userId: user.id,
        avatar: user?.avatar,
        name,
        message,
      });
    }
  };

  const approveUser = (userId: string) => {
    if (!podcastListeners || podcastListeners.length === 0) {
      console.warn('No podcast listeners available');
      return;
    }

    setAvailableSeats(podcastListeners.filter(seat => !seat.user)); // Only show empty seats
    setPendingUserId(userId);
    bottomSheetRef.current?.close();
    seatSelectionSheetRef.current?.open();
    console.log('After opening sheet');
  };

  const rejectUser = async (userId: string) => {
    try {
      await axiosInstance.post('podcast/reject-user', {
        podcast_id: podcast.id,
        user_id: userId,
      });

      setWaitingList(waitingList.filter(u => u.userData.id !== userId));

      if (socketRef.current) {
        socketRef.current.emit('reject-user', {
          userId: userId,
          podcastId: podcast.id,
          rejectedBy: user.id,
          timestamp: new Date().toISOString(),
        });

        // Also emit general event for host UI updates
        socketRef.current.emit('user-rejected', {
          userId: userId,
          podcastId: podcast.id,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUserWin = async (data: any) => {
    try {
      console.log('Processing win for user:', data.userId);
      const response = await axios.get(
        `${envVar.API_URL}public-user-info/${data.userId}`,
      );
      if (response.data.user) {
        console.log('Winner:', response.data.user);
        console.log('Won amount:', data.amount);

        setIsGameWinner({}); // clear before setting new
        setTimeout(() => {
          setIsGameWinner(response.data.user);
          setWinAmount(data.amount);
        }, 0);
      }
    } catch (error) {
      console.error('Error handling user win:', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setActiveEmojis(prev => {
        const updated: typeof prev = {};

        for (const key in prev) {
          if (now - prev[key].timestamp < 2000) {
            updated[key] = prev[key]; // Keep only recent emojis
          }
        }

        return updated;
      });
    }, 500); // Check more frequently for smoother cleanup

    return () => clearInterval(interval);
  }, []);

  const handleEmojiPress = (emoji: string) => {
    const timestamp = Date.now();
    console.log(`User ${user.id} pressed emoji:`, emoji, { timestamp });

    // Update local state immediately for instant feedback
    setActiveEmojis(prev => ({
      ...prev,
      [user.id]: { emoji, timestamp },
    }));

    if (socketRef.current?.connected) {
      console.log('Sending emoji to server...');
      socketRef.current.emit('emoji-selected', {
        userId: user.id, // Send just the current user's ID
        emoji: emoji,
        podcastId: podcast.id,
        timestamp: timestamp,
      });
    } else {
      console.warn('Socket not connected - emoji not sent to server');
    }
  };
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

  // Initialize engine only once
  useEffect(() => {
    setupVideoSDKEngine();
    return () => {
      destroyEngine();
    };
  }, []);

  useEffect(() => {
    const init = async () => {
      await setupVideoSDKEngine();
      // if (user.id !== podcast.host) {
      //   await fetchAgoraToken();
      // }
    };

    init(); // run the async logic

    return () => {
      destroyEngine();
    };
  }, []);

  const fetchAgoraToken = async () => {
    console.log('fetching...');
    const response = await axiosInstance.post('/generate-agora-token', {
      channel: podcast.channel,
      podcast_id: podcast.id,
    });
    const { token, uid } = response.data;
    console.log('token: ', token);

    try {
      const { podcast } = stateRef.current; // Use stateRef
      if (!agoraEngineRef.current) {
        return;
      }

      await checkPermission();

      // Remove isJoined check - handled by stateRef
      let result;
      if (user.id !== podcast.host) {
        console.log('User Joining channel...');
        result = agoraEngineRef.current.joinChannel(
          String(token),
          String(podcast.channel),
          uid,
          {
            clientRoleType: ClientRoleType.ClientRoleBroadcaster,
            publishMicrophoneTrack: true,
            autoSubscribeAudio: true,
          },
        );
      }

      if (result === 0) {
        dispatch(setLiveStatus('LOADING'));
      } else {
        console.error('Join failed with code:', result);
      }
    } catch (error: any) {
      console.error('Join error:', error.message);
    }
  };

  // Handle channel changes
  useEffect(() => {
    if (!agoraEngineRef.current || !podcast.channel) {
      return;
    }

    const handleChannelChange = async () => {
      await leaveAgoraChannel();
      userJoinChannel();
      console.log('called....');
    };

    handleChannelChange();
  }, [podcast.channel]);

  useEffect(() => {
    const fetchUsersInterval = setInterval(() => {
      if (isJoined && podcast.id) {
        getPodcastUsers();
        console.log('podcast: ', podcast);
        console.log('podcastListeners: ', podcastListeners);
      }
    }, 20000); // Refresh every 2 seconds

    return () => clearInterval(fetchUsersInterval);
  }, [isJoined, podcast.id]);

  const setupVideoSDKEngine = async () => {
    if (agoraEngineRef.current) {
      return;
    } // Prevent re-initialization

    try {
      agoraEngineRef.current = createAgoraRtcEngine();
      const agoraEngine = agoraEngineRef.current;

      (eventHandler.current = {
        onConnectionStateChanged: (connection, state, reason) => {
          console.log('Connection state changed:', state, reason);
          handelConnection(state);
        },
        onJoinChannelSuccess: (_connection: RtcConnection, elapsed: number) => {
          if (_connection.localUid !== podcast.host) {
            // Subscribe to all existing users' audio
            podcastListeners.forEach((listener: any) => {
              if (listener.user?.id) {
                agoraEngineRef.current?.muteRemoteAudioStream(
                  listener.user.id,
                  false,
                );
              }
            });

            // Also subscribe to host's audio
            agoraEngineRef.current?.muteRemoteAudioStream(podcast.host, false);
          }

          if (podcast.host === user.id) {
            // createUserChatRoom();
          } else {
            (dispatch as any)(getUserInfoFromAPI({ id: podcast.host }));
            // userJoinChatRoom(podcast.chat_room_id);
          }
          dispatch(setUserInState(user));

          if (_connection.localUid !== podcast.host) {
            getPodcastUsers();
          }
        },
        onUserJoined: async (_connection: RtcConnection, uid: number) => {
          console.log(uid, 'remote user joined');

          agoraEngine.muteRemoteAudioStream(uid, false);
          await getPodcastUsers();

          if (uid !== podcast.host) {
            (dispatch as any)(getUserInfoFromAPI({ id: uid, remote: true }));
          }
        },
        onUserOffline: (
          _connection: RtcConnection,
          uid: number,
          reason: UserOfflineReasonType,
        ) => {
          if (reason === 0) {
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
      }),
        agoraEngine.registerEventHandler(eventHandler.current);
      agoraEngine.initialize({
        channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
        appId: envVar.AGORA_APP_ID,
      });

      agoraEngine.setAudioProfile(
        AudioProfileType.AudioProfileMusicHighQuality,
        AudioScenarioType.AudioScenarioGameStreaming,
      );

      agoraEngine.enableAudio();
      agoraEngine.enableLocalAudio(true);
    } catch (e) {
      console.log(e);
    }
  };

  // Proper engine cleanup
  const destroyEngine = () => {
    if (agoraEngineRef.current) {
      agoraEngineRef.current.leaveChannel();
      agoraEngineRef.current.unregisterEventHandler(eventHandler.current!);
      agoraEngineRef.current.release();
      agoraEngineRef.current = null;
    }
  };

  // Update leave function
  const leaveAgoraChannel = async () => {
    try {
      if (agoraEngineRef.current) {
        agoraEngineRef.current.leaveChannel();
        dispatch(setIsJoined(false));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const normalizeHostSeat = (slots: any[], podcast: any) => {
    return slots
      .filter(slot => slot.user?.id !== podcast.host) // Exclude host
      .map(slot => ({
        ...slot,
        occupied: !!slot.user,
        user: slot.user ? { ...slot.user } : null,
      }));
  };

  // Update the getPodcastUsers function to handle null seats
  const getPodcastUsers = async () => {
    try {
      const users = await getLiveUsers(podcast.id, 'podcast');
      console.log('live users: ', users);
      if (users.length > 0) {
        const normalizedUsers = normalizeHostSeat(users, podcast);
        // Handle cases where seatNo might be null
        const finalUsers = normalizedUsers.map(user => ({
          ...user,
        }));

        dispatch(setPrevUsersInPodcast(finalUsers));
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

  const handleJoinRequest = async () => {
    try {
      if (!socketRef.current) {
        Alert.alert('Error', 'Connection not established');
        return;
      }

      console.log('running..');

      // Emit join request via socket
      socketRef.current.emit('join-request', {
        podcastId: podcast.id,
        channelId: podcast.channel,
        userId: user.id,
        userData: {
          id: user.id,
          name: `${user.first_name} ${user.last_name}`,
          avatar: user.avatar,
        },
      });

      // Send API request
      await axiosInstance.post('podcast/request-to-join', {
        podcast_id: podcast.id,
        user_id: user.id,
      });

      addToast('Your request has been sent', 'success');
    } catch (error) {
      console.error('Join request error:', error);
      Alert.alert('Error', 'Failed to send join request');
    }
  };

  // Function to handle open Bottom Sheet
  const handleOpenSheet = useCallback((type: string) => {
    setSheetType(type);
    bottomSheetRef.current?.open();
  }, []);
  const handleOpenSheet2 = useCallback(() => {
    setSheetType('avatar');
    bottomSheetRef.current?.open();
  }, []);

  const handleOpenLockUnlockSheet = useCallback((seatNo: any, locked: any) => {
    lockUnlockRBSheetRef.current?.open();
    setSelectedSeat({
      seatNo: seatNo,
      locked: locked,
    });
  }, []);

  const handleOpenEmojiSheet = useCallback(() => {
    bottomEmojiSheetRef.current?.open();
  }, []);

  const handleWaitingList = async () => {
    if (isHost) {
      setSheetType('waitingList');
      bottomSheetRef.current?.open();
      return; // Early return for host
    }

    // ✅ CHECK: is user already part of the podcastListeners?
    const isAlreadyJoined = podcastListeners.some(
      (listener: any) => listener?.user?.id === user.id,
    );

    if (isAlreadyJoined) {
      console.log('User is already in the podcast. No need to request again.');
      return;
    }

    try {
      // Find first available seat that's not locked and not occupied
      const availableSeat = podcastListeners.find(
        (seat: any) =>
          !seat.locked && (!seat.user || seat.user === null) && !seat.occupied,
      );

      if (availableSeat) {
        console.log('Available seat found:', availableSeat.seatNo);

        // Join the available seat
        const joinResponse = await axiosInstance.post('podcast/join', {
          channel: podcast.channel,
          id: podcast.id,
        });

        await checkPermission();

        dispatch(
          setUserInState({
            user: joinResponse.data.user,
            seatNo: availableSeat.seatNo,
          }),
        );

        setUser(joinResponse.data.user);

        if (!agoraEngineRef.current) {
          await setupVideoSDKEngine();
        }

        agoraEngineRef.current?.joinChannel(
          joinResponse.data.user.agora_rtc_token,
          podcast.channel,
          Number(joinResponse.data.user.id),
          {
            channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
            clientRoleType: ClientRoleType.ClientRoleBroadcaster,
          },
        );

        addToast(`Joined seat ${availableSeat.seatNo}`, 'success');
      } else {
        console.log('No available seats, sending join request...');
        // If no seats available, send join request
        await handleJoinRequest();
      }
    } catch (error) {
      console.error('Error in handleWaitingList:', error);
      addToast('Failed to join or request seat', 'error');
    }
  };

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
    Alert.alert(
      'Podcast Ended',
      'The host has ended the podcast session',
      [
        {
          text: 'OK',
          onPress: () => {
            dispatch(setLeaveModal(true));
            endPodcastForUser();
          },
        },
      ],
      { cancelable: false },
    );
  };

  const userJoinChannel = async () => {
    try {
      const { podcast, user } = stateRef.current; // Use stateRef
      if (!agoraEngineRef.current) {
        return;
      }

      await checkPermission();

      // Remove isJoined check - handled by stateRef
      let result;
      if (user.id === podcast.host) {
        result = agoraEngineRef.current.joinChannel(
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
        console.log('Joining channel...');
        result = agoraEngineRef.current.joinChannel(
          String(user.agora_rtc_token),
          String(podcast.channel),
          user.id,
          {
            channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting,
            clientRoleType: ClientRoleType.ClientRoleAudience,
            publishMicrophoneTrack: false,
            autoSubscribeAudio: true,
          },
        );
      }

      console.log("result", result);
      if (result === 0) {
        dispatch(setLiveStatus('LOADING'));
      } else {
        console.error('Join failed with code:', result);
      }
    } catch (error: any) {
      console.error('Join error:', error.message);
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
        if (podcast.host === user.id) {
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
        navigation.navigate('HomeB');
        dispatch(setLeaveModal(false));
        dispatch(setPodcast(''));
        dispatch(setIsJoined(false));
        timeOutScreen(false);
        dispatch(setLiveStatus('IDLE'));
        setHostCoins(0);
      }, 400);
    } catch (error) {
      console.log(error);
    }
  };

  const endPodcast = async () => {
    try {
      dispatch(setLiveStatus('IDLE'));
      let url = 'podcast/end/' + podcast.id;
      if (user.id !== podcast.host) {
        url += '/guest';
      }
      // console.log(url);
      // console.log('IDS: ', user.id, podcast.host);
      await axiosInstance.get(url);
    } catch (error) {
      console.log('Error: ', error);
    } finally {
      endPodcastForUser();
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

  const handleSocketMuteUnmuteUser = (item: any) => {
    // Calculate new mute state
    const newMuteState = item.muted;

    // Update remote audio stream
    if (item.user?.id) {
      agoraEngineRef.current?.muteRemoteAudioStream(item.user.id, newMuteState);
      console.log('user-muted: ', item.user?.id);
    }
  };

  const muteUnmuteUser = (item: any, fromSocket: boolean = false) => {
    // Allow action if:
    // 1. Current user is the host OR
    // 2. Current user is muting themselves OR
    // 3. Current user is muting someone else (with host's permission if needed)

    const isHost = user.id === podcast.host;
    const isSelf = user.id === item.user?.id;

    if (!isHost && !isSelf) {
      // Guests can only mute others if enabled in settings
      if (!podcast.settings?.allowGuestMuting) {
        return;
      }
    }

    // Calculate new mute state
    const newMuteState = fromSocket ? item.muted : !item.muted;

    // Update remote audio stream
    if (item.user?.id) {
      agoraEngineRef.current?.muteRemoteAudioStream(item.user.id, newMuteState);
    }

    // Update local state
    const updatedListeners = podcastListeners.map((listener: any) => {
      if (listener.seatNo === item.seatNo) {
        return { ...listener, muted: newMuteState };
      }
      return listener;
    });

    dispatch(setPodcastListeners(updatedListeners));

    // Only emit socket event if this is a local action
    if (!fromSocket && socketRef.current) {
      socketRef.current.emit('user-mute-updated', {
        seatNo: item.seatNo,
        userId: item.user?.id,
        muted: newMuteState,
        podcastId: podcast.id,
      });
    }
  };

  const leavePodcast = () => {
    if (!isJoined) {
      navigation.navigate('HomeB');
      return;
    }
    dispatch(setLeaveModal(true));
  };
  const formatTime = (timeInSeconds: any) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0',
    )}`;
  };

  const openGamesSheet = () => {
    setSheetType('games');
    bottomSheetRef.current?.open();
  };

  const openRoomSkinSheet = () => {
    setSheetType('room-skin');
    bottomSheetRef.current?.open();
  };

  const closeGiftSheet = () => {
    bottomSheetRef.current?.close();
  };

  const sendGift = async (
    giftId: any,
    receiverId: any,
    senderId: any,
    receiverName: any,
  ) => {
    try {
      if (!podcast?.id || !user?.id) {
        Toast.show({
          type: 'error',
          text1: 'Missing Data',
          text2: 'User or Podcast information is missing',
        });
      }

      const response = await axiosInstance.post('/gifts/send', {
        sender_id: user.id,
        receiver_id: receiverId,
        gift_id: giftId,
        podcast_id: podcast.id,
      });

      if (response.data.status) {
        const { gift, sender } = response.data.data;

        const amount = Number(gift.coins);

        // if (Number(receiverId) === Number(podcast.host)) {
        //   dispatch(incrementHostCoins(amount));
        // } else {
        //   dispatch(
        //     incrementListenerCoins({ userId: Number(receiverId), amount }),
        //   );
        // }

        setUser(sender);

        if (socketRef.current) {
          // ✅ Emit gift via socket to everyone in podcast
          socketRef.current?.emit('gift_sent', {
            gift_image: gift.image,
            amount: gift.coins,
            podcast_id: podcast.id,
            receiver_id: receiverId,
          });
        }

        addComment(
          `send ${amount} diamonds gift to ${
            senderId === receiverId ? 'yourself' : receiverName
          }`,
          'comment',
        );
      } else {
        Toast.show({
          type: 'error',
          text1: 'Gift Failed',
          text2: response.data.message || 'Could not send the gift.',
        });
      }
    } catch (error: any) {
      console.error('Error sending gift:', error.message);
      Toast.show({
        type: 'error',
        text1: 'Send Error',
        text2:
          error?.response?.data?.message ||
          error.message ||
          'Unexpected error occurred.',
      });
    }
  };

  // In GoLive.tsx
  const handleLockSeat = (seatNo: number, lock: boolean) => {
    if (!isHost) {
      return;
    }

    // Optimistic update - update UI immediately
    dispatch(updateSeatLockStatus({ seatNo, locked: lock }));

    // Broadcast via socket only
    socketRef.current?.emit('lock-seat', {
      seatNo,
      locked: lock,
      podcastId: podcast.id,
      userId: user.id, // Include who made the change
    });
  };

  const handleLockAllSeats = (lock: boolean) => {
    if (!isHost) return;

    const bulkSeatUpdates = podcastListeners
      .filter(
        (listener: any) =>
          listener.user === null &&
          !listener.occupied &&
          listener.user?.id !== podcast.host,
      )
      .map((listener: any) => ({
        seatNo: listener.seatNo,
        locked: lock,
      }));

    // Dispatch all updates locally
    bulkSeatUpdates.forEach((seat: any) => {
      dispatch(updateSeatLockStatus(seat));
    });

    // Emit a single event with all seat updates
    socketRef.current?.emit('bulk-lock-seat', {
      podcastId: podcast.id,
      userId: user.id,
      seats: bulkSeatUpdates,
    });

    console.log('sent...');
  };

  const toggleMute = async () => {
    try {
      const newMuteState = !hostMuted;

      // Update local audio
      agoraEngineRef.current?.muteLocalAudioStream(newMuteState);

      // Update state
      setHostMuted(newMuteState);

      // Broadcast to all users via socket
      if (socketRef.current) {
        socketRef.current.emit('host-mute-updated', {
          hostId: user.id,
          muted: newMuteState,
          podcastId: podcast.id,
        });
      }
    } catch (error) {
      console.error('Error toggling mute:', error);
      addToast('Failed to toggle mute', 'error');
    }
  };

  const kickUserFromPodcast = async (userToSend: any) => {
    try {
      let url = 'podcast/end/' + podcast.id + '/userKick';
      await axiosInstance.post(url, {
        user: userToSend,
      });

      // Update local state immediately
      dispatch(removeUserFromPodcast(userToSend.id));

      // Emit to specific user to force leave
      socketRef.current?.emit('force-leave-user', {
        userId: userToSend.id,
        podcastId: podcast.id,
      });

      // Force the user to leave the Agora channel
      agoraEngineRef.current?.muteRemoteAudioStream(userToSend.id, true);
    } catch (error) {
      console.error('Error kicking user:', error);
      addToast('Failed to kick user', 'error');
    } finally {
      setSheetType('');
      bottomSheetRef.current?.close();
    }
  };

  const handleWallpaperSelect = (number: number) => {
    const WALLPAPER_BASE_URL =
      'https://emolivestreaming.online/wallpapers/wallpaper-';
    if (user.id === podcast.host) {
      const wallpaperUrl = `${WALLPAPER_BASE_URL}${number}.jpeg`;
      dispatch(setSelectedWallpaper(wallpaperUrl));

      if (socketRef.current) {
        console.log('wallpaper-changed-to-server sent...');
        // Emit the wallpaper change to all connected clients
        socketRef.current?.emit('wallpaper-changed-sent', {
          podcastId: podcast.id,
          wallpaperUrl: wallpaperUrl,
          changedBy: user.id,
        });
      }
    }
  };

  return (
    <>
      <View style={{ flex: 1 }}>
        <ImageBackground
          style={[StyleSheet.absoluteFill, { zIndex: 1 }]}
          source={
            selectedWallpaper
              ? { uri: selectedWallpaper }
              : IMAGES.postCastBackground
          }
        >
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
              {IsGameWinner?.id && winAmount > 0 && (
                <WinnerBanner
                  userImage={IsGameWinner.avatar || ''}
                  username={IsGameWinner.name || 'Winner'}
                  userId={IsGameWinner.id}
                  amount={winAmount}
                  token={token}
                />
              )}

              {/* Toast notifications */}
              {toasts.map(toast => (
                <AnimatedToast
                  key={toast.id}
                  message={toast.message}
                  type={toast.type}
                />
              ))}

              {giftAnimationForUser?.userId && (
                <View style={styles.giftAnimationWrapper}>
                  <LottieView
                    source={{ uri: giftAnimationForUser?.giftImage }}
                    autoPlay
                    loop={false}
                    style={styles.giftAnimation}
                    onAnimationFinish={() => {
                      setTimeout(() => {
                        setGiftAnimationForUser(null);
                      }, 500);
                    }}
                  />
                </View>
              )}

              <View style={styles.commentContainer}>
                <FlatList
                  ref={commentsListRef}
                  data={comments}
                  keyExtractor={item => item.id}
                  renderItem={({ item }) => (
                    <AnimatedComment name={item.name} message={item.message} />
                  )}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingBottom: 20, // Space for bottom controls
                  }}
                  nestedScrollEnabled
                  onContentSizeChange={() =>
                    commentsListRef.current?.scrollToEnd({ animated: true })
                  }
                  onLayout={() =>
                    commentsListRef.current?.scrollToEnd({ animated: true })
                  }
                />
              </View>

              <View
                style={[
                  {
                    paddingTop: Platform.OS === 'android' ? 10 : 50,
                    justifyContent: 'space-between',
                  },
                ]}
              >
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
                    handleAddComment={addComment}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '44%',
                      // justifyContent: 'space-around',
                      marginHorizontal: 10,
                    }}
                  >
                    <ImageBackground
                      source={IMAGES.Rectangle}
                      borderRadius={25}
                      style={{
                        padding: 7,
                        paddingLeft: 12,
                        paddingRight: 12,
                        justifyContent: 'center',
                      }}
                    >
                      <Text style={[appStyles.bodyRg]}>
                        💎 {formatNumber(hostUser.total_gifts_received)}
                      </Text>
                    </ImageBackground>

                    <ImageBackground
                      source={IMAGES.Rectangle}
                      borderRadius={25}
                      style={{
                        padding: 7,
                        paddingLeft: 12,
                        paddingRight: 12,
                        justifyContent: 'center',
                        marginLeft: 10,
                      }}
                    >
                      <Image
                        source={IMAGES.music}
                        style={{ width: 20, height: 20 }}
                      />
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
                    ]}
                  >
                    {/* Duration:{' '} */}
                    <Text style={[{ color: colors.golden }]}>
                      {formatTime(time)}
                    </Text>
                  </Text>
                </View>

                {/* ************ Header end ************ */}
                {/* ************ second row ************ */}
                {/* <PodcastStatus /> */}
                {/* ************ second row ************ */}
                <View style={{ paddingTop: 40 }}>
                  {/* Host section */}
                  {hostUser && (
                    <View style={styles.container} key={`host-${hostUser.id}`}>
                      <View style={styles.row}>
                        <TouchableOpacity
                          style={styles.micWrapper}
                          onPress={toggleMute}
                        >
                          <Icon
                            name={hostMuted ? 'microphone-off' : 'microphone'}
                            size={25}
                            color={colors.complimentary}
                          />
                        </TouchableOpacity>

                        <View style={styles.profileWrapper}>
                          <ImageBackground
                            source={IMAGES.RectangleWithLine}
                            style={styles.rectangleImage}
                          >
                            <View style={styles.profileImageWrapper}>
                              {hostUser?.active_frame && (
                                <LottieView
                                  source={{
                                    uri:
                                      envVar.IMAGES_URL +
                                      hostUser.active_frame.image,
                                  }} // update path if needed
                                  autoPlay
                                  loop
                                  style={styles.lottieFrame}
                                />
                              )}
                              <Image
                                source={
                                  activeEmojis[hostUser.id]
                                    ? { uri: activeEmojis[hostUser.id].emoji }
                                    : hostUser?.avatar
                                    ? {
                                        uri:
                                          envVar.API_URL +
                                          'display-avatar/' +
                                          hostUser.id,
                                        headers: {
                                          Authorization: `Bearer ${token}`,
                                        },
                                      }
                                    : require('../../../../assets/images/place.jpg')
                                }
                                style={styles.profileImage}
                              />
                            </View>

                            <View style={styles.specialSeat}>
                              <Icon
                                name="sofa-single"
                                color={'#CDC6CE'}
                                size={35}
                              />
                            </View>
                          </ImageBackground>
                          <View>
                            <View style={{ maxWidth: 80 }}>
                              {hostUser.first_name && (
                                <Text
                                  numberOfLines={1}
                                  ellipsizeMode="tail"
                                  style={[
                                    appStyles.bodyMd,
                                    {
                                      color: colors.complimentary,
                                      marginVertical: 5,
                                    },
                                  ]}
                                >
                                  {hostUser.first_name +
                                    ' ' +
                                    hostUser.last_name}
                                </Text>
                              )}
                              <View
                                style={[styles.points, { alignSelf: 'center' }]}
                              >
                                <Icon
                                  name="star-four-points"
                                  size={16}
                                  color={colors.dominant}
                                />
                                <Text
                                  style={[
                                    appStyles.smallTxt,
                                    { color: colors.dominant },
                                  ]}
                                >
                                  {formatNumber(hostCoins) || 0}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  )}

                  {/* All other listeners */}
                  <FlatList
                    data={podcastListeners.filter(
                      (slot: any) => slot.user?.id !== podcast.host,
                    )}
                    numColumns={4}
                    keyExtractor={(item, index) => `${item.seatNo}-${index}`}
                    contentContainerStyle={{ alignItems: 'center' }}
                    renderItem={({ item, index }) => {
                      return (
                        <View style={styles.podcastHost}>
                          {item.user ? (
                            <PodcastGuest
                              muteUnmuteUser={muteUnmuteUser}
                              token={token}
                              handleOpenSheet2={handleOpenSheet2}
                              item={item}
                              user={user}
                              dispatch={dispatch}
                              activeEmojis={activeEmojis}
                              podcast={podcast.host}
                            />
                          ) : (
                            <View style={{ alignItems: 'center' }}>
                              <TouchableOpacity
                                style={styles.emptySeat}
                                onPress={async () => {
                                  if (isHost) {
                                    handleOpenLockUnlockSheet(
                                      item.seatNo,
                                      item.locked,
                                    );
                                  } else {
                                    // Regular user can join available seats
                                    if (!item.locked && !isJoined) {
                                      try {
                                        // Join the podcast channel
                                        const joinResponse =
                                          await axiosInstance.post(
                                            'podcast/join',
                                            {
                                              channel: podcast.channel,
                                              id: podcast.id,
                                            },
                                          );

                                        await checkPermission();

                                        // Update user state with seat number
                                        dispatch(
                                          setUserInState({
                                            user: joinResponse.data.user,
                                            seatNo: item.seatNo,
                                          }),
                                        );

                                        setUser(joinResponse.data.user);

                                        if (!agoraEngineRef.current) {
                                          await setupVideoSDKEngine();
                                        }
                                        // Join Agora channel
                                        agoraEngineRef.current?.joinChannel(
                                          joinResponse.data.user
                                            .agora_rtc_token,
                                          podcast.channel,
                                          Number(joinResponse.data.user.id),
                                          {
                                            channelProfile:
                                              ChannelProfileType.ChannelProfileLiveBroadcasting,
                                            clientRoleType:
                                              ClientRoleType.ClientRoleBroadcaster,
                                          },
                                        );

                                        addToast(
                                          `Joined seat ${item.seatNo}`,
                                          'success',
                                        );
                                      } catch (error) {
                                        console.error(
                                          'Error joining seat:',
                                          error,
                                        );
                                        addToast(
                                          'Failed to join seat',
                                          'error',
                                        );
                                      }
                                    } else {
                                      addToast('This seat is locked', 'error');
                                    }
                                  }
                                }}
                              >
                                <IconM
                                  name={item.locked ? 'lock' : 'plus'}
                                  color={'#CDC6CE'}
                                  size={item.locked ? 20 : 26}
                                />
                              </TouchableOpacity>
                              {/* <View style={styles.emptySeat}>
                                  <IconM
                                    name={item.locked ? 'lock' : 'plus'}
                                    size={item.locked ? 20 : 26}
                                    color={'#CDC6CE'}
                                  />
                                </View> */}

                              <Text
                                style={[
                                  appStyles.paragraph1,
                                  {
                                    color: colors.complimentary,
                                    textAlign: 'center',
                                  },
                                ]}
                              >
                                {item.seatNo}
                              </Text>
                            </View>
                          )}
                        </View>
                      );
                    }}
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
              </View>
            </View>

            <BottomSection
              single={false}
              roomId={podcast.chat_room_id}
              handleOpenSheet={handleOpenSheet}
              handleOpenEmojiSheet={handleOpenEmojiSheet}
              handleWaitingList={handleWaitingList}
              waitingListLength={waitingList.length}
              isHost={isHost}
              addComment={addComment}
              muteUnmuteUser={muteUnmuteUser}
            />
          </View>

          {liveStatus == 'LOADING' && <LiveLoading />}
        </ImageBackground>

        <RBSheet
          ref={lockUnlockRBSheetRef}
          draggable={true}
          height={Platform.OS === 'ios' ? 200 : 170}
          closeOnPressMask={true}
          closeOnPressBack={true}
          customStyles={{
            wrapper: {
              backgroundColor: 'transparent',
            },
            container: {
              backgroundColor: colors.LG,
              paddingLeft: 20,
              paddingRight: 20,
              paddingBottom: 20,
            },
            draggableIcon: {
              backgroundColor: colors.complimentary,
            },
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: colors.dark_gradient,
              padding: 12,
              borderRadius: 8,
              marginBottom: 10,
              marginTop: 20,
            }}
            onPress={() => {
              if (selectedSeat) {
                handleLockSeat(selectedSeat.seatNo, !selectedSeat.locked);
                lockUnlockRBSheetRef.current?.close();
              }
            }}
          >
            <Text style={{ color: '#fff', textAlign: 'center' }}>
              {selectedSeat?.locked ? 'Unlock Seat' : 'Lock Seat'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              padding: 12,
              borderRadius: 8,
            }}
            onPress={() => lockUnlockRBSheetRef.current?.close()}
          >
            <Text style={{ color: '#fff', textAlign: 'center' }}>Cancel</Text>
          </TouchableOpacity>
        </RBSheet>

        <RBSheet
          ref={bottomEmojiSheetRef}
          draggable={true}
          customStyles={{
            wrapper: {
              backgroundColor: 'transparent',
            },
            container: {
              backgroundColor: colors.LG,
            },
            draggableIcon: {
              backgroundColor: colors.complimentary,
            },
          }}
          height={300}
          closeOnPressMask={true}
          closeOnPressBack={true}
        >
          <Emoji handleEmojiPress={handleEmojiPress} />
        </RBSheet>

        <RBSheet
          ref={bottomSheetRef}
          draggable={true}
          customStyles={{
            wrapper: {
              backgroundColor: 'transparent',
            },
            container: {
              backgroundColor: colors.LG,
            },
            draggableIcon: {
              backgroundColor: colors.complimentary,
            },
          }}
          height={550}
          closeOnPressMask={true}
          closeOnPressBack={true}
        >
          {sheetType === 'gifts' ? (
            <Gifts
              sendGift={sendGift}
              podcastListeners={podcastListeners}
              podcastHost={podcast.host}
              token={token}
              hostUser={hostUser}
              currentUser={user}
              closeGiftSheet={closeGiftSheet}
            />
          ) : sheetType === 'waitingList' ? (
            <WaitingList
              waitingList={waitingList}
              approveUser={approveUser}
              rejectUser={rejectUser}
              isHost={isHost}
              handleLockAllSeats={handleLockAllSeats}
              isToggleOn={isToggleOn}
              setIsToggleOn={setIsToggleOn}
            />
          ) : sheetType === 'avatar' ? (
            <AvatarSheet
              navigation={navigation}
              token={token}
              envVar={envVar}
              kickUserFromPodcast={kickUserFromPodcast}
              userId={user.id}
              isHost={isHost}
            />
          ) : sheetType === 'users' ? (
            <Users />
          ) : sheetType === 'games' ? (
            <Games navigation={navigation} />
          ) : sheetType === 'room-skin' ? (
            <RoomSkin
              navigation={navigation}
              handleWallpaperSelect={handleWallpaperSelect}
            />
          ) : (
            <Tools
              onGamesPress={openGamesSheet}
              onRoomSkinPress={openRoomSkinSheet}
            />
          )}
        </RBSheet>

        <RBSheet
          ref={seatSelectionSheetRef}
          draggable={true}
          height={400} // Adjust height as needed
          closeOnPressMask={true}
          closeOnPressBack={true}
          customStyles={{
            wrapper: {
              backgroundColor: 'transparent',
              zIndex: 1000,
            },
            container: {
              backgroundColor: colors.LG,
              padding: 20,
              zIndex: 1001,
            },
            draggableIcon: {
              backgroundColor: colors.complimentary,
            },
          }}
        >
          <View style={{ padding: 10 }}>
            <Text
              style={[
                appStyles.bodyMd,
                { color: colors.complimentary, marginBottom: 20 },
              ]}
            >
              Assign a Seat
            </Text>

            <FlatList
              data={availableSeats}
              keyExtractor={item => item.seatNo.toString()}
              numColumns={4}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              contentContainerStyle={{ marginVertical: 10 }}
              renderItem={({ item: seat }) => (
                <TouchableOpacity
                  style={[
                    styles.seatOption,
                    {
                      backgroundColor: colors.dark_gradient,
                      padding: 10,
                      borderRadius: 8,
                      margin: 5,
                      alignItems: 'center',
                      justifyContent: 'center',
                    },
                  ]}
                  onPress={async () => {
                    try {
                      if (seat.locked && socketRef.current) {
                        socketRef.current.emit('unlock-seat', {
                          podcastId: podcast.id,
                          seatNo: seat.seatNo,
                        });
                      }

                      await axiosInstance.post('podcast/approve-user', {
                        podcast_id: podcast.id,
                        user_id: pendingUserId,
                      });

                      dispatch(
                        updateSeatLockStatus({
                          seatNo: seat.seatNo,
                          locked: false,
                        }),
                      );

                      socketRef.current?.emit('lock-seat', {
                        seatNo: seat.seatNo,
                        locked: false,
                        podcastId: podcast.id,
                        userId: user.id,
                      });

                      socketRef.current?.emit('approve-user', {
                        userId: pendingUserId,
                        podcastId: podcast.id,
                        channelId: podcast.channel,
                        seatNo: seat.seatNo,
                      });

                      console.log('Approval sent with:', {
                        pendingUserId,
                        podcastId: podcast.id,
                        channelId: podcast.channel,
                        seatNo: seat.seatNo,
                      });

                      setWaitingList(prev =>
                        prev.filter(u => u.userData.id !== pendingUserId),
                      );
                    } catch (err) {
                      console.log(err);
                      addToast('Approval failed', 'error');
                    } finally {
                      setShowSeatModal(false);
                      setPendingUserId(null);
                    }
                  }}
                >
                  <Icon
                    name="sofa-single"
                    size={24}
                    color={colors.complimentary}
                  />
                  <Text
                    style={[
                      appStyles.smallTxt,
                      { color: colors.complimentary },
                    ]}
                  >
                    Seat {seat.seatNo}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={{
                backgroundColor: colors.dark_gradient,
                padding: 12,
                borderRadius: 8,
                marginTop: 20,
              }}
              onPress={() => seatSelectionSheetRef.current?.close()}
            >
              <Text
                style={{ color: colors.complimentary, textAlign: 'center' }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </RBSheet>
      </View>
    </>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  ...liveStyles,

  mainContainer: {
    flex: 1,
  },

  tempBtn: { marginLeft: 10, padding: 10, backgroundColor: colors.accent },
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
    width: 165,
    height: 55,
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
    width: 55,
    height: 55,
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
    width: 55,
    height: 55,
    borderRadius: 50,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  iconWrapper: {
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  emptySeat: {
    width: 45,
    height: 45,
    borderRadius: 25,
    borderColor: colors.accent,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  specialSeat: {
    width: 55,
    height: 55,
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
  bottomSheetOverlay: {
    zIndex: 999,
    elevation: 999,
    pointerEvents: 'box-none',
  },

  lockedSeat: {
    opacity: 0.6,
    borderColor: colors.accent,
  },
  lockIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    padding: 5,
  },
  lockButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    padding: 5,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: colors.LG,
    padding: 20,
    borderRadius: 12,
    width: '80%',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: colors.white,
  },
  seatOption: {
    padding: 10,
    backgroundColor: colors.iconsBg,
    marginVertical: 5,
    borderRadius: 50,
  },
  seatText: {
    fontSize: 14,
    color: colors.complimentary,
  },
  cancelButton: {
    marginTop: 15,
    textAlign: 'center',
    color: 'red',
    fontWeight: '600',
  },
  commentContainer: {
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 100,
    maxHeight: 120,
    paddingHorizontal: 10,
    zIndex: 999,
  },

  lottieFrame: {
    position: 'absolute',
    width: 75, // slightly larger than wrapper
    height: 75,
    top: -10,
    left: -10,
    zIndex: 9,
  },
  giftAnimationWrapper: {
    position: 'absolute',
    top: height * 0.05, // 5% from top
    left: 0,
    width: width,
    height: height * 0.8, // 80% height
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  giftAnimation: {
    width: '100%',
    height: '100%',
  },
});
