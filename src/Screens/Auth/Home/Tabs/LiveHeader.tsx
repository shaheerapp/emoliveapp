import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
  ImageBackground,
} from 'react-native';

import { colors } from '../../../../styles/colors';
import appStyles from '../../../../styles/styles';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector, useDispatch } from 'react-redux';
import {
  removeUserFromSingleStream,
  setSingle,
} from '../../../../store/slice/streamingSlice';
import axiosInstance from '../../../../Api/axiosConfig';
import { IMAGES } from '../../../../assets/images';
import LottieView from 'lottie-react-native';
import axios from 'axios';

interface HeaderProps {
  user: any;
  navigation: any;
  token: string;
  liveEvent: any;
  envVar: any;
  leavePodcast: any;
  connected: boolean;
  handleAddComment: any;
}
export default function LiveHeader({
  user,
  navigation,
  token,
  liveEvent,
  envVar,
  leavePodcast,
  connected,
  handleAddComment,
}: HeaderProps) {
  const dispatch = useDispatch();
  const [time, setTime] = useState(0); // Time in seconds

  // const {podcast} = useSelector((state: any) => state.podcast);
  // const {stream} = useSelector((state: any) => state.streaming);
  const { loading, isJoined } = useSelector((state: any) => state.users);
  const { single } = useSelector((state: any) => state.streaming);
  // let host = '';
  const [isFollowing, setIsFollowing] = useState(false);

  const [host, setHost] = useState(
    liveEvent.host === user.id ? user : liveEvent.user,
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prevTime => prevTime + 1); // Increment time by 1 second
    }, 1000);
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);
  useEffect(() => {
    const checkFollowingStatus = async () => {
      try {
        const res = await axios.get(
          `${envVar.API_URL}user/is-following/${host.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setIsFollowing(res.data.is_following);
      } catch (err) {
        console.log('Error checking follow status:', err);
      }
    };

    if (host?.id !== user?.id) {
      checkFollowingStatus();
    }
  }, [host?.id]);

  const followUser = async () => {
    try {
      const url = `${envVar.API_URL}user/follow-user/${host.id}`;
      const res = await axiosInstance.get(url);
      console.log('✅ Followed:', res.data);
      handleAddComment('follow the host', 'comment');
      setIsFollowing(true);
    } catch (error: any) {
      console.log('❌ Follow error:', error.message);
    }
  };

  const unFollowUser = async () => {
    try {
      const url = `${envVar.API_URL}user/un-follow-user/${host.id}`;
      const res = await axiosInstance.get(url);
      console.log('❌ Unfollowed:', res.data);
      setIsFollowing(false);
    } catch (error: any) {
      console.log('❌ Unfollow error:', error.message);
    }
  };

  return (
    <View style={[styles.header, single && styles.header2]}>
      <View style={{ flex: 1 }}>
        <ImageBackground
          borderRadius={50}
          source={IMAGES.Rectangle}
          style={[styles.userInfo, { flexWrap: 'wrap' }]} // wrap to allow name+btn to go to new line if needed
        >
          <View style={styles.avatarWrapper}>
            {host?.active_frame && (
              <LottieView
                source={{ uri: envVar.IMAGES_URL + host.active_frame.image }}
                autoPlay
                loop
                style={styles.avatarAnimation}
              />
            )}
            <Image
              source={
                host.avatar
                  ? {
                      uri: envVar.API_URL + 'display-avatar/' + host.id,
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  : require('../../../../assets/images/place.jpg')
              }
              style={styles.avatar}
            />
          </View>

          <View style={styles.nameAndButton}>
            <Text
              style={[
                appStyles.bodyRg,
                { color: colors.complimentary, flexShrink: 1 },
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {host.first_name + ' ' + host.last_name}
            </Text>

            {host.id !== user.id && (
              <TouchableOpacity
                style={styles.addBtn}
                onPress={isFollowing ? unFollowUser : followUser}
              >
                <Icon
                  name={isFollowing ? 'check' : 'plus'}
                  color="#fff"
                  size={16}
                />
              </TouchableOpacity>
            )}
          </View>
        </ImageBackground>
      </View>

      <View style={{ width: '45%' }}>
        <View style={styles.right}>
          <TouchableOpacity
            style={{
              overflow: 'hidden',
              width: 30,
              height: 30,
              borderRadius: 25,
              padding: 5,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={leavePodcast}
          >
            <ImageBackground
              style={{
                width: 30,
                height: 30,
                borderRadius: 25,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              source={IMAGES.Rectangle}
            >
              {/* <Icon
            name="close"
            size={25}
            color={connected ? colors.complimentary : colors.accent}
          /> */}
              <Icon name="close" size={25} color="#fff" />
            </ImageBackground>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 7,
    resizeMode: 'cover',
    gap: 8,
    flexWrap: 'wrap',
  },

  nameAndButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
    flex: 1,
    flexWrap: 'wrap',
    marginLeft: 4,
  },
  avatar: { width: 55, height: 55, borderRadius: 40 },
  addBtn: {
    padding: 2,
    backgroundColor: '#F00044',
    borderRadius: 20,
  },
  level: { backgroundColor: '#08FEF8', padding: 2, borderRadius: 1 },
  right: {
    flexDirection: 'row',
    // width: '35%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  header2: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    zIndex: 2,
    position: 'absolute',
    width: '100%',
  },
  avatarWrapper: {
    width: 55,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarAnimation: {
    position: 'absolute',
    width: 75,
    height: 75,
    top: -9, // adjust as needed
    left: -8, // adjust as needed
    zIndex: 5,
  },
});
