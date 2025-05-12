// React Native imports
export {default as React} from 'react';
export {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  BackHandler,
  ImageBackground,
  ActivityIndicator,
  Platform,
  Image,
  Alert,
  TextInput,
} from 'react-native';

// React hooks
export {useRef, useEffect, useState, useCallback, useContext} from 'react';

// Styles and Icons
export {default as appStyles} from '../../../../../styles/styles';
export {default as IconM} from 'react-native-vector-icons/MaterialIcons';
export {default as liveStyles} from '../styles/liveStyles';
export {default as colors} from '../../../../../styles/colors';

// Components
export {default as Streams} from './Streams';
export {default as BottomSection} from '../Components/BottomSection';
export {default as AvatarSheet} from '../Components/AvatarSheet';
export {default as LiveLoading} from '../Components/LiveLoading';
export {default as Header} from '../Podcast/Header';
export {default as EndLive} from '../Podcast/EndLive';
export {default as Gifts} from '../Podcast/Gifts';
export {default as Users} from '../Podcast/Users';
export {default as Tools} from '../Podcast/Tools';
export {default as Icon} from 'react-native-vector-icons/MaterialCommunityIcons';

// Agora imports
export {
  createAgoraRtcEngine,
  ChannelProfileType,
  ClientRoleType,
  IRtcEngine,
  AudienceLatencyLevelType,
  RtcSurfaceView,
  RtcConnection,
  IRtcEngineEventHandler,
  ConnectionStateType,
  ConnectionChangedReasonType,
  VideoSourceType,
} from 'react-native-agora';

// Context and Redux
export {default as Context} from '../../../../../Context/Context';
export {useSelector, useDispatch} from 'react-redux';

// Redux actions
export {setLiveStatus} from '../../../../../store/slice/usersSlice';
export {
  setHostLeftPodcast,
  setLeaveModal,
} from '../../../../../store/slice/podCastSlice';
export {
  updateStreamListeners,
  setUserInState,
  removeUserFromStream,
  getUserInfoFromAPI,
  updateStreamRoomId,
  setPrevUsersInStream,
  updateUserCamera,
  updatedMuteUnmuteUser,
} from '../../../../../store/slice/streamingSlice';
export {setConnected} from '../../../../../store/slice/chatSlice';
export {
  setRTCTokenRenewed,
  setLoading,
  setIsJoined,
} from '../../../../../store/slice/usersSlice';

// API and scripts
export {default as envVar} from '../../../../../config/envVar';
export {default as axios} from 'axios';
export {default as axiosInstance} from '../../../../../Api/axiosConfig';
export {resetLiveStreaming, getLiveUsers} from '../scripts/liveScripts';
export {
  renewRTCToken,
  renewRTMToken,
  checkCamPermission,
  checkMicrophonePermission,
} from '../../../../../scripts';

// Bottom Sheet
export {BottomSheet, BottomSheetView} from '@gorhom/bottom-sheet';
