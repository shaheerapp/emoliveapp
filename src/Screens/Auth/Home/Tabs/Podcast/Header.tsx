import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Platform,
  Image,
  Alert,
} from 'react-native';

import {colors} from '../../../../../styles/colors';
import appStyles from '../../../../../styles/styles';
import React, {useState, useEffect} from 'react';
import IconM from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {setLoading} from '../../../../../store/slice/usersSlice';
import {useSelector, useDispatch} from 'react-redux';
import {
  getUserInfoFromAPIS,
  removeUserFromSingleStream,
  setSingle,
} from '../../../../../store/slice/streamingSlice';
import axiosInstance from '../../../../../Api/axiosConfig';
import {envVar} from '../Streaming/streamingImport';

interface HeaderProps {
  user: any;
  navigation: any;
  token: string;
  liveEvent: any;
  envVar: any;
  leavePodcast: any;
  connected: boolean;
}
export default function Header({
  user,
  navigation,
  token,
  liveEvent,
  envVar,
  leavePodcast,
  connected,
}: HeaderProps) {
  const dispatch = useDispatch();
  const [time, setTime] = useState(0); // Time in seconds

  // const {podcast} = useSelector((state: any) => state.podcast);
  // const {stream} = useSelector((state: any) => state.streaming);
  const {loading, isJoined} = useSelector((state: any) => state.users);
  const {single} = useSelector((state: any) => state.streaming);
  // let host = '';

  const [host, setHost] = useState(
    liveEvent.host == user.id ? user : liveEvent.user,
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prevTime => prevTime + 1); // Increment time by 1 second
    }, 1000);
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);
  // Convert time to mm:ss format
  const formatTime = timeInSeconds => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0',
    )}`;
  };
  const followUser = async () => {
    try {
      const url = envVar.API_URL + 'follow-user';
      const res = await axiosInstance.get(url);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={[styles.header, single && styles.header2]}>
      <View style={styles.userInfo}>
        <Image
          source={
            host.avatar
              ? {
                  uri: envVar.API_URL + 'display-avatar/' + host.id,
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              : require('../../../../../assets/images/place.jpg')
          }
          style={styles.avatar}
        />
        <Text style={[appStyles.regularTxtMd, {color: colors.complimentary}]}>
          {host.first_name + ' ' + host.last_name}
        </Text>
        <View style={styles.level}>
          <Text
            onPress={() => dispatch(setSingle(!single))}
            style={{color: 'black', fontSize: 6, fontWeight: '500'}}>
            LV:1
          </Text>
        </View>
        {host.id !== user.id && (
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => {
              // console.log(user);
              // console.log(liveEvent);
              // console.log(host, 'ssss');
              // dispatch(updatedMuteUnmuteUser({type: 'single', id: 1}));
              // Alert.alert('Coming Soon', '!!');
            }}>
            <Icon name="plus" color="#fff" size={20} />
          </TouchableOpacity>
        )}
      </View>
      <ActivityIndicator
        animating={loading}
        size={'small'}
        color={colors.accent}
      />
      <View style={styles.right}>
        <View>
          <Text
            onPress={() => dispatch(removeUserFromSingleStream(1))}
            style={[appStyles.bodyMd, {color: colors.complimentary}]}>
            Duration:{' '}
            <Text style={[{color: colors.golden}]}>{formatTime(time)}</Text>
            {/* Duration: <Text style={[{color: colors.golden}]}>10:34</Text> */}
          </Text>
        </View>
        <TouchableOpacity onPress={leavePodcast}>
          <Icon
            name="close"
            size={25}
            color={connected ? colors.complimentary : colors.accent}
          />
          {/* <Icon name="close" size={25} color="#fff" /> */}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '40%',
    alignItems: 'center',
  },
  avatar: {width: 28, height: 28, borderRadius: 15},
  addBtn: {
    padding: 2,
    backgroundColor: '#F00044',
    borderRadius: 20,
  },
  level: {backgroundColor: '#08FEF8', padding: 2, borderRadius: 1},
  right: {
    flexDirection: 'row',
    width: '35%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header2: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    zIndex: 2,
    position: 'absolute',
    width: '100%',
  },
});
