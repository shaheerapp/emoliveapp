import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';

import React, {useState} from 'react';
import {colors} from '../../../../styles/colors';
import appStyles from '../../../../styles/styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Room6On from '../../../../assets/svg/room6.svg';
import Room6 from '../../../../assets/svg/room6Off.svg';
import Room9 from '../../../../assets/svg/room9Off.svg';
import Room9On from '../../../../assets/svg/room9.svg';
import axiosInstance from '../../../../Api/axiosConfig';
import envVar from '../../../../config/envVar';
import {useDispatch, useSelector} from 'react-redux';
import {
  setGuests,
  setStream,
  updateStreamListeners,
} from '../../../../store/slice/streamingSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAppContext} from '../../../../Context/AppContext';
interface GoLiveProps {
  navigation: any;
}

export default function GoLive2({navigation}: GoLiveProps) {
  const {guests} = useSelector((state: any) => state.streaming);
  const {liveForm} = useSelector((state: any) => state.users);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const {userAuthInfo, tokenMemo} = useAppContext();
  const {user, setUser} = userAuthInfo;

  const {token} = tokenMemo;

  const startLive = async () => {
    try {
      if (!guests) {
        Alert.alert('error', 'please select seat number');
        return;
      }
      setLoading(true);
      console.log(liveForm);
      if (liveForm.liveType == 'podcast') {
        // startPodCast();
        return;
      }
      // setLoading(true);
      const url = 'stream/start';
      const data = {
        title: 'Some title',
        duration: 10,
        // listeners: guests,
        listeners: guests + 1,
        listeners_can_add: [],
        type: 'PUBLIC',
      };

      const res = await axiosInstance.post(url, data);
      console.log(res.data);

      if (res.status == 201) {
        setUser((user: any) => ({
          ...user,
          agora_rtc_token: res.data.user.agora_rtc_token,
        }));
        await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
        // dispatch(setGuests(guests));
        dispatch(updateStreamListeners(guests));
        dispatch(setStream(res.data.stream));
        setLoading(false);
        navigation.navigate('LiveStreaming');
      }
      // console.log(res.data);
    } catch (error: any) {
      console.log(error);
      setLoading(false);
      if (error.response) {
        setError(error.response.data.message);
        return;
      }
      setError('Please check internet connection');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View
          style={{flexDirection: 'row', alignItems: 'center', width: '40%'}}>
          <Image
            style={[appStyles.userAvatar, {height: 40, width: 40}]}
            source={
              user.avatar
                ? {
                    uri: envVar.API_URL + 'display-avatar/' + user.id,
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                : require('../../../../assets/images/place.jpg')
            }
          />
          <Text
            style={[
              appStyles.headline2,
              {color: colors.complimentary, marginLeft: 10},
            ]}>
            {user.first_name + ' ' + user.last_name}
          </Text>
        </View>
        <TouchableOpacity
          // onPress={() => setLoading(false)}
          onPress={() => navigation.navigate('HomeB')}
          style={styles.closeBtn}>
          <Icon name="close" color={colors.complimentary} size={25} />
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator
          style={{marginTop: 140}}
          animating={loading}
          size={'large'}
          color={colors.accent}
        />
      ) : (
        <>
          <View style={{marginTop: 40, width: '100%', overflow: 'scroll'}}>
            <Text style={[appStyles.paragraph1, {color: colors.complimentary}]}>
              Add Tags
            </Text>
            <View style={styles.row}>
              <View style={styles.tag}>
                <Text style={[appStyles.bodyMd, {color: colors.complimentary}]}>
                  #InstaTravel
                </Text>
              </View>
              <View style={styles.tag}>
                <Text style={[appStyles.bodyMd, {color: colors.complimentary}]}>
                  #Wanderlust
                </Text>
              </View>
              <View style={styles.tag}>
                <Text style={[appStyles.bodyMd, {color: colors.complimentary}]}>
                  #Roam
                </Text>
              </View>
              <View style={styles.tag}>
                <Text style={[appStyles.bodyMd, {color: colors.complimentary}]}>
                  #Roam
                </Text>
              </View>
            </View>
          </View>

          <Text
            style={[
              appStyles.regularTxtMd,
              {color: colors.complimentary, textAlign: 'center', marginTop: 40},
            ]}>
            Please Select Seat for{' '}
            {liveForm.liveType == 'video' ? 'Video' : 'Podcast'} Streaming
          </Text>
          <View style={styles.room}>
            <TouchableOpacity onPress={() => dispatch(setGuests(1))}>
              <View
                style={[
                  styles.singleRoom,
                  {
                    backgroundColor:
                      guests == 1 ? colors.accent : colors.body_text,
                  },
                ]}></View>
              <Text style={styles.seatTxt}>1 Seat</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => dispatch(setGuests(4))}>
              <View
                style={{
                  width: 33,
                  height: 33,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={[
                      styles.room4,
                      {
                        backgroundColor:
                          guests == 4 ? colors.accent : colors.body_text,
                      },
                    ]}></View>
                  <View
                    style={[
                      styles.room4,
                      {
                        backgroundColor:
                          guests == 4 ? colors.accent : colors.body_text,
                      },
                    ]}></View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 2,
                  }}>
                  <View
                    style={[
                      styles.room4,
                      {
                        backgroundColor:
                          guests == 4 ? colors.accent : colors.body_text,
                      },
                    ]}></View>
                  <View
                    style={[
                      styles.room4,
                      {
                        backgroundColor:
                          guests == 4 ? colors.accent : colors.body_text,
                      },
                    ]}></View>
                </View>
              </View>
              <Text style={styles.seatTxt}>4 Seat</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => dispatch(setGuests(6))}>
              {guests == 6 ? (
                <Room6On width={32} height={32} />
              ) : (
                <Room6 width={32} height={32} />
              )}

              <Text style={styles.seatTxt}>6 Seat</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => dispatch(setGuests(9))}>
              {guests == 9 ? (
                <Room9On width={32} height={32} />
              ) : (
                <Room9 width={32} height={32} />
              )}
              <Text style={styles.seatTxt}>9 Seat</Text>
            </TouchableOpacity>
          </View>

          {error && (
            <Text style={[appStyles.errorText, {marginTop: 90}]}>{error}</Text>
          )}

          <TouchableOpacity style={styles.btn} onPress={startLive}>
            <Text style={[appStyles.paragraph1, {color: colors.complimentary}]}>
              Go Live
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.LG,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Platform.OS == 'ios' ? 40 : 5,
    justifyContent: 'space-between',
  },
  row: {
    marginTop: 30,
    // flex: 1 / 2,

    flexDirection: 'row',
    // width: '20%',
    justifyContent: 'space-around',
  },
  room: {
    width: '90%',
    justifyContent: 'space-around',
    flexDirection: 'row',
    marginTop: 50,
  },
  tag: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: colors.lines,
  },
  closeBtn: {
    width: '10%',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  btn: {
    marginTop: 40,
    backgroundColor: '#ef0143',
    width: '90%',
    position: 'absolute',
    bottom: 30,
    padding: 15,
    alignSelf: 'center',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seatTxt: {marginTop: 10, ...appStyles.bodyMd, color: colors.unknown},
  singleRoom: {
    height: 32,
    width: 32,
  },
  room4: {
    height: 15,
    width: 15,
  },
});
