import {
  View,
  Text,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axiosInstance from '../../../../Api/axiosConfig';
import { colors } from '../../../../styles/colors';
import {
  setPodcast,
  setPodcasts,
  updatePodcastListeners,
} from '../../../../store/slice/podCastSlice';
import envVar from '../../../../config/envVar';
import appStyles from '../../../../styles/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useAppContext } from '../../../../Context/AppContext';
import Banners from '../../../../Components/Banners';
import { useFocusEffect } from '@react-navigation/native';

interface Props {
  navigation: any;
}

const Popular: React.FC<Props> = ({ navigation }) => {
  const { podcasts } = useSelector((state: any) => state.podcast);
  const { tokenMemo, userAuthInfo } = useAppContext();
  const { token } = tokenMemo;
  const [error, setError] = useState('');
  const { user, setUser } = userAuthInfo;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [banners, setBanners] = useState([]);
  const [displayedPodcasts, setDisplayedPodcasts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useFocusEffect(
    useCallback(() => {
      getPodcasts();

      // REMOVE INTERVAL - it's causing re-fetch → reset
      return () => {}; // no interval
    }, []),
  );

  const getPodcasts = async () => {
    try {
      const res = await axiosInstance.get('podcast/active');
      const all = res.data.podcast || [];

      dispatch(setPodcasts(all)); // Store all
      setCurrentPage(1);

      // Only reset displayedPodcasts if it's a fresh fetch
      setDisplayedPodcasts(all.slice(0, pageSize));
    } catch (error: any) {
      setError(error._response ? 'Network error' : error.message);
    }
  };

  useEffect(() => {
    fetchBanners();
    console.log('Banners: ', banners);
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/banners-all');
      console.log('Banner Response ', response);
      if (response.data.success) {
        setBanners(response.data.banners);
      }
    } catch (error) {
      setError('Failed to fetch banners');
      console.error('Banner fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    const nextPage = currentPage + 1;
    const start = (nextPage - 1) * pageSize;
    const end = start + pageSize;

    if (start >= podcasts.length) return; // nothing left to load

    const nextItems = podcasts.slice(start, end);

    setDisplayedPodcasts(prev => {
      // Ensure no duplicates
      const ids = new Set(prev.map(item => item.id));
      const filteredNew = nextItems.filter(item => !ids.has(item.id));
      return [...prev, ...filteredNew];
    });

    setCurrentPage(nextPage);
  };

  const joinPodcast = async (item: any) => {
    try {
      setLoading(true);

      const podcastDetailsResponse = await axiosInstance.get(
        `podcast/details/${item.id}`,
      );
      const { listeners } = podcastDetailsResponse.data.podcast;

      dispatch(updatePodcastListeners(listeners));
      dispatch(setPodcast(item));

      // Navigate to waiting screen
      navigation.navigate('GoLive', {
        isWaiting: true,
        currentPodcast: item,
      });
    } catch (error: any) {
      console.error('Join error:', error);
      Alert.alert('Error', error.message || 'Failed to send join request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ marginTop: 20, flex: 1 }}>
        {banners.length > 0 && <Banners banners={banners} />}
        {error && (
          <Text style={[appStyles.errorText, { marginTop: 10 }]}>{error}</Text>
        )}
        <View style={{ flex: 1 }}>
          <FlatList
            data={displayedPodcasts}
            refreshing={loading}
            onRefresh={getPodcasts}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            initialNumToRender={10}
            windowSize={5}
            keyExtractor={(item: any) => item.id?.toString()}
            numColumns={2}
            contentContainerStyle={{
              paddingBottom: 120,
              flexGrow: 1,
            }}
            ListEmptyComponent={
              loading ? null : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    No Popular Podcasts Available
                  </Text>
                  <TouchableOpacity
                    onPress={getPodcasts}
                    style={styles.refreshButton}
                  >
                    <Text style={styles.refreshText}>Refresh</Text>
                  </TouchableOpacity>
                </View>
              )
            }
            renderItem={({ item }: any) => (
              <TouchableOpacity
                style={styles.PodcastUser}
                onPress={() => joinPodcast(item)}
              >
                <View
                  style={{
                    width: '100%',
                    height: 180,
                  }}
                >
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
                    <Text style={styles.userFollower}>{item.coin_earned}</Text>
                  </TouchableOpacity>
                  <Text style={styles.userTxt}>
                    {item.user.first_name + ' ' + item.user.last_name}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </View>
  );
};

export default Popular;

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

  emptyContainer: {
    flex: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    ...appStyles.regularTxtRg,
    color: colors.complimentary,
    marginBottom: 20,
  },
  refreshButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  refreshText: {
    ...appStyles.regularTxtRg,
    color: colors.complimentary,
  },
});
