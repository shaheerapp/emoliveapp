import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../../../styles/colors';
import {appStyles} from '../Tabs/Podcast/podcastImport';
import {useAppContext} from '../../../../Context/AppContext';
import {IMAGES} from '../../../../assets/images';

const deviceHeight = Dimensions.get('window').height;

export default function FanAndFollowerScreen({navigation, route}: any) {
  const {userAuthInfo} = useAppContext();
  const {user} = userAuthInfo;
  const screenName = route?.params?.name;

  const [followers, setFollowers] = useState<any[]>([]);
  const [filteredFollowers, setFilteredFollowers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fallbackData = [
    {
      id: 21,
      first_name: 'Abc',
      last_name: 'Xyz',
      email: '',
      pivot: {
        follower_id: 21,
        user_id: 3,
      },
    },
  ];

  useEffect(() => {
    if (user?.id) {
      fetchFollowers(user.id);
    }
  }, [user?.id]);

  useEffect(() => {
    filterFollowers(search);
  }, [search, followers]);

  const fetchFollowers = async (userId: number) => {
    try {
      const response = await axios.get(
        `https://www.emolivestreaming.online/api/user-followers/${userId}`,
      );
      const result = response.data?.data?.following || [];
      setFollowers(result);
      setFilteredFollowers(result);
    } catch (error) {
      console.error('Error fetching followers:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const filterFollowers = (text: string) => {
    const query = text.toLowerCase();
    const filtered = followers.filter(item => {
      const fullName = `${item.first_name || ''} ${
        item.last_name || ''
      }`.toLowerCase();
      return fullName.includes(query);
    });
    setFilteredFollowers(filtered);
  };

  const renderItem = ({item}: any) => (
    <View style={styles.itemContainer}>
      <View style={styles.labelWrapper}>
        <Text numberOfLines={1} style={styles.labelText}>
          {(item.first_name || '') + ' ' + (item.last_name || '') || 'Unnamed'}
        </Text>
      </View>
      <View style={styles.imageWrapper}>
        <Image source={IMAGES.swap} style={styles.iconImage} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <IconM name="chevron-left" size={30} color={'black'} />
        </TouchableOpacity>
        <View style={styles.headerTitleWrapper}>
          <Text style={[appStyles.headline, styles.headerTitle]}>
            {screenName}
          </Text>
        </View>
      </View>

      <View style={styles.searchInputView}>
        <Image source={IMAGES.search} style={styles.iconImage} />

        <TextInput
          placeholder="Search by name..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
          placeholderTextColor="#999"
        />
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={{marginTop: 30}}
        />
      ) : (
        <FlatList
          data={filteredFollowers.length > 0 ? filteredFollowers : fallbackData}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            item.id?.toString() || index.toString()
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    zIndex: 10000,
  },
  headerRow: {
    marginTop: 70,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitleWrapper: {
    width: '85%',
  },
  headerTitle: {
    color: 'black',
    textAlign: 'center',
  },
  searchInput: {
    color: '#000',
    fontSize: 16,
  },
  searchInputView: {
    marginHorizontal: 15,
    marginTop: 15,
    padding: 10,
    borderRadius: 30,
    backgroundColor: 'lightgray',
    color: '#000',
    fontSize: 16,
    flexDirection: 'row',
    gap: 10,
  },
  listContent: {
    paddingHorizontal: 10,
    marginTop: 30,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 20,
    padding: 5,
  },
  imageWrapper: {
    height: 25,
    width: 25,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    height: 25,
    width: 25,
  },
  labelWrapper: {
    maxWidth: deviceHeight * 0.13,
    gap: 5,
  },
  labelText: {
    ...appStyles.headline2,
    color: 'black',
    textAlign: 'left',
  },
});
