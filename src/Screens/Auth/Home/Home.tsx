import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Image,
  FlatList,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Popular from './Navigations/Popular';
import envVar from '../../../config/envVar';
import {updatePodcastListeners} from '../../../store/slice/podcastSlice';
import {ChatTextMessageBody} from 'react-native-agora-chat';
import {fetchUserDetails} from '../../../store/slice/usersSlice';

import RNFS from 'react-native-fs';
import {
  checkReadStorage,
  checkWriteStorage,
  checkCamPermission,
} from '../../../scripts';

import {
  setUnreadCount,
  setUnreadNotification,
} from '../../../store/slice/notificationSlice';
import {
  addStreamListenerS,
  setSingle,
  setStream,
  updateStreamListeners,
} from '../../../store/slice/streamingSlice';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withTiming,
} from 'react-native-reanimated';
import Battle from './Navigations/Battle';
import Games from '../Games/Games';
import Live from './Navigations/Live';
import {useSelector, useDispatch} from 'react-redux';
import NewHost from './Navigations/NewHost';
import {useAppContext} from '../../../Context/AppContext';
import {GestureDetector, Gesture} from 'react-native-gesture-handler';
import Explore from './Tabs/Components/Explore';

// import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable'
import {colors} from '../../../styles/colors';
import appStyles from '../../../styles/styles';
import axiosInstance from '../../../Api/axiosConfig';

export default function Home({navigation}) {
  const {userDetails} = useSelector((state: any) => state.users);
  const {tokenMemo, userAuthInfo} = useAppContext();
  const [showExplore, setShowExplore] = useState(false);
  const {user} = userAuthInfo;
  const dispatch = useDispatch();
  // const {token} = tokenMemo;
  const {connected} = useSelector((state: any) => state.chat);
  const scrollViewRef = useRef<ScrollView>(null);
  const flatListRef = useRef(null);
  const [tab, setTab] = useState(1);
  const translateX = useSharedValue(0);

  const getNotifications = async () => {
    try {
      const url = 'notifications/unread';
      const res = await axiosInstance.get(url);
      const count = res.data.notifications.length;
      if (count > 0) {
        dispatch(setUnreadCount(count));
        dispatch(setUnreadNotification(res.data.notifications));
      }
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const updateTab = (direction: string) => {
    let newTab = tab;
    if (direction === 'right') {
      if (tab < 5) {
        newTab = tab + 1;
      } else {
        newTab = 1; // Wrap around to the first tab
      }
    } else {
      if (tab > 1) {
        newTab = tab - 1;
      } else {
        newTab = 5; // Wrap around to the last tab
      }
    }

    setTab(newTab);

    const scrollToOffset = (newTab - 1) * 140; // Assuming 140px width per tab
    scrollViewRef.current?.scrollTo({x: scrollToOffset, animated: true});
  };
  const swipeGesture = Gesture.Pan()
    .simultaneousWithExternalGesture(flatListRef) // Allow FlatList to handle vertical scroll
    .minDistance(18) // Minimum distance for any gesture to trigger
    .onStart(() => {
      // console.log('Gesture started');
    })
    .onUpdate(event => {
      if (Math.abs(event.translationX) > Math.abs(event.translationY)) {
        // Horizontal swipe detected
        translateX.value = event.translationX;
      }
    })
    .onEnd(() => {
      if (translateX.value < -100) {
        runOnJS(updateTab)('right');
      } else if (translateX.value > 100) {
        runOnJS(updateTab)('left');
      }
      translateX.value = withTiming(0);
    });

  // Animated style for swiping
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateX: translateX.value}],
  }));

  const test = () => {
    // console.log(NativeModules);
    setShowExplore(true);
    // dispatch(setStream(stream));
    // console.log(userDetails);

    // dispatch(fetchUserDetails([1, 14, 15]));

    // dispatch(updatePodcastListeners(6));
    return;
    // dispatch(updateStreamListeners(9));
    navigation.navigate('LiveStreaming');
    // navigation.navigate('GoLive');
  };

  return (
    <View style={styles.container}>
      <View style={styles.screenTop}>
        <View style={{width: '40%'}}>
          <View
            style={[
              styles.connectIcon,
              {
                backgroundColor: connected
                  ? colors.complimentary
                  : colors.accent,
              },
            ]}
          />
        </View>
        <View style={styles.headerLeft}>
          <Text style={styles.heading}>Emo Live</Text>
          <TouchableOpacity
            onPress={() => {
              test();
            }}>
            {/* onPress={() => navigation.navigate('Notifications')}> */}
            <Icon name="bell-outline" size={24} color={colors.complimentary} />
          </TouchableOpacity>
        </View>
      </View>
      {showExplore && (
        <Explore
          setTab={setTab}
          setShowExplore={setShowExplore}
          navigation={navigation}
        />
      )}

      {/* <View> */}
      <View>
        <ScrollView
          ref={scrollViewRef}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            marginTop: 20,
          }}
          horizontal={true}>
          <View
            style={{
              flexDirection: 'row',
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => setTab(1)}
              style={[styles.tab, tab == 1 && {backgroundColor: '#f00044'}]}>
              <Text style={[styles.tabText, tab == 1 && {color: '#fff'}]}>
                Popular
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setTab(2)}
              style={[styles.tab, tab == 2 && {backgroundColor: '#f00044'}]}>
              <Text style={[styles.tabText, tab == 2 && {color: '#fff'}]}>
                Live
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setTab(3)}
              style={[styles.tab, tab == 3 && {backgroundColor: '#f00044'}]}>
              <Text style={[styles.tabText, tab == 3 && {color: '#fff'}]}>
                New Host
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setTab(4)}
              style={[styles.tab, tab == 4 && {backgroundColor: '#f00044'}]}>
              <Text style={[styles.tabText, tab == 4 && {color: '#fff'}]}>
                Battle
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setTab(5)}
              style={[styles.tab, tab == 5 && {backgroundColor: '#f00044'}]}>
              <Text style={[styles.tabText, tab == 5 && {color: '#fff'}]}>
                Games
              </Text>
            </TouchableOpacity>
          </View>
          {/* </View> */}
        </ScrollView>
      </View>

      <GestureDetector gesture={swipeGesture}>
        <Animated.View style={[animatedStyle, {flex: 1}]}>
          {tab == 1 ? (
            <Popular navigation={navigation} />
          ) : tab == 2 ? (
            <Live navigation={navigation} flatListRef={flatListRef} />
          ) : tab == 3 ? (
            <NewHost />
          ) : tab == 4 ? (
            <Battle navigation={navigation} />
          ) : (
            <Games navigation={navigation} />
          )}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d1f31',
    padding: 10,
  },
  heading: {
    ...appStyles.headline,
    color: colors.complimentary,
    textAlign: 'center',
  },
  screenTop: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '99%',
    marginTop: Platform.OS == 'ios' ? 50 : 20,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
  },
  tabText: {
    color: '#868791',
    fontWeight: '500',
    fontSize: 16,
  },
  connectIcon: {
    width: 20,
    marginLeft: 20,
    height: 20,
    borderRadius: 15,
  },
  headerLeft: {
    width: '60%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
