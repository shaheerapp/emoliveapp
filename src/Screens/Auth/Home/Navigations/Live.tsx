import {
  View,
  Text,
  ScrollView,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axiosInstance from '../../../../Api/axiosConfig';
import {colors} from '../../../../styles/colors';
import {
  setSingle,
  setStream,
  setStreams,
  addStreamListenerS,
  updateStreamListeners,
} from '../../../../store/slice/streamingSlice';
import {getStreams} from '../../../../store/slice/streaming/streamingAsync';
import envVar from '../../../../config/envVar';
import appStyles from '../../../../styles/styles';
import {setLoading} from '../../../../store/slice/usersSlice';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAppContext} from '../../../../Context/AppContext';

interface LiveProps {
  navigation: any;
  flatListRef: any;
}

export default function Live({navigation, flatListRef}: LiveProps) {
  const {tokenMemo, userAuthInfo} = useAppContext();
  const {streams} = useSelector((state: any) => state.streaming);
  const {loading} = useSelector((state: any) => state.users);
  const {token} = tokenMemo;
  const {setUser} = userAuthInfo;
  const dispatch = useDispatch();

  useEffect(() => {
    // dispatch(getStreams()
  }, []);

  // useEffect(() => {
  //   // Fetch podcasts immediately
  //   getPodcasts();

  //   // Set interval to fetch podcasts every 3 seconds
  //   const intervalId = setInterval(() => {
  //     getPodcasts();
  //   }, 3000);

  //   // Cleanup function to clear interval when the component unmounts
  //   return () => clearInterval(intervalId);
  // }, []);

  const joinStream = async (item: any) => {
    try {
      dispatch(setLoading(true));
      const url = 'stream/join';
      const data = {
        channel: item.channel,
        id: item.id,
      };
      const res = await axiosInstance.post(url, data);
      setUser(res.data.user);
      dispatch(setStream(item));
      if (item.single) {
        dispatch(setSingle(true));
        dispatch(addStreamListenerS(item.user));
      } else {
        dispatch(updateStreamListeners(item.listeners));
      }
      navigation.navigate('LiveStreaming');
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <View>
      <View style={{marginTop: 20}}>
        <View style={{alignSelf: 'center'}}>
          {loading ? (
            <ActivityIndicator
              animating={loading}
              color={colors.accent}
              size={'small'}
            />
          ) : (
            <></>
          )}
        </View>
        <TouchableOpacity onPress={() => dispatch(getStreams())}>
          <Text style={{marginVertical: 10, color: colors.complimentary}}>
            Get Live Streaming
          </Text>
        </TouchableOpacity>
        <View
          style={{
            height: Dimensions.get('window').height * 0.63,
          }}>
          <FlatList
            ref={flatListRef}
            data={streams}
            keyExtractor={(item: any) => item.id?.toString()}
            numColumns={2}
            contentContainerStyle={{
              paddingBottom: 5,
            }}
            renderItem={({item}: any) => (
              <TouchableOpacity
                disabled={loading}
                style={styles.PodcastUser}
                onPress={() => joinStream(item)}>
                <View
                  style={{
                    width: '100%',
                    height: 180,
                  }}>
                  <Image
                    style={styles.userImage}
                    source={
                      item.user.avatar
                        ? {
                            uri:
                              envVar.API_URL + 'display-avatar/' + item.user.id,
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                          }
                        : require('../../../../assets/images/parts/placeBlack.png')
                    }
                  />
                  <TouchableOpacity style={styles.waveform}>
                    <Icon
                      name="waveform"
                      color={colors.complimentary}
                      size={30}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.userStats}>
                    <Icon
                      name="diamond"
                      color={colors.complimentary}
                      size={20}
                    />
                    <Text style={styles.userFollower}>10.51K</Text>
                  </TouchableOpacity>
                  <Text style={styles.userTxt}>
                    {item.user.first_name + ' ' + item.user.last_name} :{' '}
                    {item.id}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  waveform: {
    top: 10,
    left: 5,
    position: 'absolute',
    backgroundColor: colors.LG,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    borderRadius: 25,
  },
  PodcastUser: {
    position: 'relative',
    backgroundColor: 'red',
    marginHorizontal: '2.5%', // Add horizontal margin for spacing
    width: '45%',
    borderRadius: 5,
    marginVertical: 10,
  },
  userStats: {
    top: 10,
    position: 'absolute',
    flexDirection: 'row',
    right: 10,
    backgroundColor: colors.LG,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: 90,
    borderRadius: 15,
  },
  userTxt: {
    position: 'absolute',
    bottom: 10,
    marginLeft: 10,
    ...appStyles.regularTxtRg,
    color: colors.complimentary,
  },
  userFollower: {
    color: colors.complimentary,
    marginLeft: 5,
    ...appStyles.bodyRg,
  },
  userImage: {
    position: 'relative',
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
});
