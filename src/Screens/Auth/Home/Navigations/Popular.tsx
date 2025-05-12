import {
  View,
  Text,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axiosInstance from '../../../../Api/axiosConfig';
import {colors} from '../../../../styles/colors';
import {
  setPodcast,
  setPodcasts,
  updatePodcastListeners,
} from '../../../../store/slice/podCastSlice';
import envVar from '../../../../config/envVar';
import appStyles from '../../../../styles/styles';
import {useDispatch, useSelector} from 'react-redux';
import {useAppContext} from '../../../../Context/AppContext';

export default function Popular({navigation}) {
  const {podcasts} = useSelector((state: any) => state.podcast);
  const {tokenMemo, userAuthInfo} = useAppContext();
  const {token} = tokenMemo;
  const [error, setError] = useState('');
  const {setUser} = userAuthInfo;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Fetch podcasts immediately
    getPodcasts();

    // Set interval to fetch podcasts every 3 seconds
    const intervalId = setInterval(() => {
      getPodcasts();
    }, 3000);

    // Cleanup function to clear interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const getPodcasts = async () => {
    try {
      // dispatch(setPodcasts([]));
      // setLoading(true);
      const res = await axiosInstance.get('podcast/active');
      // setLoading(false);
      // console.log(res.data);

      if (res.data.podcast.length) {
        dispatch(setPodcasts(res.data.podcast));
      }
    } catch (error: any) {
      setLoading(false);
      if (error._response) {
        setError('Network error');
      }
    }
  };

  const joinPodcast = async (item: any) => {
    try {
      setLoading(true);
      const url = 'podcast/join';
      const data = {
        channel: item.channel,
        id: item.id,
      };
      const res = await axiosInstance.post(url, data);
      // console.log(res.data);
      dispatch(updatePodcastListeners(item.listeners));
      setUser(res.data.user);
      dispatch(setPodcast(item));
      navigation.navigate('GoLive');
    } catch (error) {
      console.log(error);
      // console.log(item);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{flex: 1}}>
      <View style={{marginTop: 20}}>
        {error && <Text style={[appStyles.errorText]}>{error}</Text>}
        {/* <Text style={{color: '#fff'}} onPress={() => getPodcasts()}>
          get Podcasts
        </Text> */}
        <View>
          <FlatList
            data={podcasts}
            refreshing={loading}
            onRefresh={getPodcasts}
            keyExtractor={(item: any) => item.id?.toString()}
            numColumns={2}
            contentContainerStyle={{
              paddingBottom: 120,
            }}
            renderItem={({item}: any) => (
              <TouchableOpacity
                style={styles.PodcastUser}
                onPress={() => joinPodcast(item)}>
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
