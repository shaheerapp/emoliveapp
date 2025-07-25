import React, { useEffect, useState } from 'react';
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
  Platform,
  Alert,
} from 'react-native';
import axios from 'axios';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../../../styles/colors';
import { appStyles, envVar } from '../Tabs/Podcast/podcastImport';
import { useAppContext } from '../../../../Context/AppContext';
import { IMAGES } from '../../../../assets/images';
import { Linking } from 'react-native';

const deviceHeight = Dimensions.get('window').height;

export default function TopUpAgent({ navigation, route }: any) {
  const { userAuthInfo, tokenMemo } = useAppContext();
  const { user } = userAuthInfo;
  const [resellers, setResellers] = useState<any[]>([]);
  const [filteredResellers, setFilteredResellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { token } = tokenMemo;

  useEffect(() => {
    if (user?.id) {
      fetchCountryResellers();
    }
  }, [user?.id]);

  useEffect(() => {
    filterResellers(search);
  }, [search, resellers]);

  const fetchCountryResellers = async () => {
    try {
      const response = await axios.get(`${envVar.API_URL}country-resellers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Check if the response status is false
      if (!response.data.status) {
        // Show the error message from the API
        Alert.alert(
          'Error',
          response.data.message || 'Failed to fetch resellers',
        );
        setResellers([]);
        setFilteredResellers([]);
        return;
      }

      const result = response?.data?.data || [];
      setResellers(result);
      setFilteredResellers(result);
    } catch (error: any) {
      console.error('Error fetching resellers:', error?.message);
    } finally {
      setLoading(false);
    }
  };

  const filterResellers = (text: string) => {
    const query = text.toLowerCase();
    const filtered = resellers.filter(item => {
      const fullName = `${item.first_name || ''} ${
        item.last_name || ''
      }`.toLowerCase();
      return fullName.includes(query);
    });
    setFilteredResellers(filtered);
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.itemContainer}>
      <View style={styles.labelWrapper}>
        <View
          style={{
            borderRadius: 30,
            width: 35,
            height: 35,
            overflow: 'hidden',
          }}
        >
          <Image
            source={
              item.avatar
                ? {
                    uri: envVar.API_URL + 'display-avatar/' + item.id,
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                : require('../../../../assets/images/place.jpg')
            }
            style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
          />
        </View>
        <Text style={styles.labelText}>
          {(item.first_name || '') + ' ' + (item.last_name || '') || 'Unnamed'}
        </Text>
      </View>
      {item.phone && (
        <TouchableOpacity
          style={styles.imageWrapper}
          onPress={() => {
            Linking.openURL(`https://wa.me/${item.phone}`);
          }}
        >
          <Image source={IMAGES.phone} style={styles.iconImage} />
        </TouchableOpacity>
      )}
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
            Your Country Resellers
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
          color={colors.pimary}
          style={{ marginTop: 30 }}
        />
      ) : (
        <FlatList
          data={filteredResellers.length > 0 ? filteredResellers : []}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            item.id?.toString() || index.toString()
          }
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            !loading && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  No Resellers are found in your country.
                </Text>
              </View>
            )
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 10000,
  },
  headerRow: {
    marginTop: Platform.OS === 'android' ? 30 : 70,
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
    alignItems: 'center',
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
    height: 20,
    width: 20,
  },
  labelWrapper: {
    maxWidth: deviceHeight * 0.4,
    gap: 15,
    flexDirection: 'row',
  },
  labelText: {
    ...appStyles.regularTxtMd,
    color: 'black',
    textAlign: 'left',
    top: 8,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: deviceHeight * 0.3,
  },
  emptyText: {
    ...appStyles.regularTxtMd,
    color: 'black',
    textAlign: 'center',
  },
});
