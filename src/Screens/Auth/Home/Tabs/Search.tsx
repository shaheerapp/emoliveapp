import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  FlatList,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import appStyles from '../../../../styles/styles';
import {colors} from '../../../../styles/colors';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axiosInstance from '../../../../Api/axiosConfig';
import {
  updateUsers,
  getUsers,
  setLoading,
  updateVisitProfile,
} from '../../../../store/slice/usersSlice';
import envVar from '../../../../config/envVar';
import {useAppContext} from '../../../../Context/AppContext';
const deviceHeight = Dimensions.get('window').height;
interface SearchScreenProps {
  navigation: any;
}
export default function Search({navigation}: SearchScreenProps) {
  const {userAuthInfo, tokenMemo} = useAppContext();
  const {token} = tokenMemo;
  const dispatch = useDispatch();
  const {users, loading} = useSelector((state: any) => state.users);

  const [error, setError] = useState('');
  const [searchLoader, setSearchLoader] = useState(false);
  const [query, setQuery] = useState('');
  const [subLoader, setSubLoader] = useState<any>({
    loading: false,
    id: null,
  });
  const [searchUsers, setSearchUsers] = useState([]);

  useEffect(() => {
    // getUsers();
    dispatch(getUsers());
  }, []);

  const followUser = async (item: any) => {
    try {
      setSubLoader({loading: true, id: item.id});
      dispatch(setLoading(true));

      const url = item.is_followed
        ? '/user/un-follow-user/' + item.id
        : '/user/follow-user/' + item.id;
      const res = await axiosInstance.get(url);
      dispatch(updateUsers(res.data.users));
    } catch (error: any) {
      clearError();
      setError(error.message);
    } finally {
      dispatch(setLoading(false));
      setSubLoader({loading: false, id: null});
    }
  };

  const searchAccount = async () => {
    try {
      if (query.length < 4) return;
      setSearchLoader(true);
      const url = `/user/search-account/${query}`;
      const res = await axiosInstance.get(url);
      setSearchLoader(false);
      if (res.data.users.length < 1) {
        setError('No User Found');
        clearError();
        return;
      }
      setSearchUsers(res.data.users);
      // setupListeners
    } catch (error: any) {
      clearError();
      console.log(error);
    }
  };
  const clearError = () => {
    setLoading(false);
    setSearchLoader(false);
    setTimeout(() => {
      setError('');
    }, 3000);
  };
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: Platform.OS == 'ios' ? 50 : 0,
        }}>
        <TextInput
          style={styles.input}
          placeholder="Enter User name...."
          autoCapitalize="none"
          onChangeText={setQuery}
          // onChangeText={text => searchAccount(text)}
          placeholderTextColor={colors.dark_gradient}
        />
        {searchLoader ? (
          <ActivityIndicator
            animating={searchLoader}
            size={'small'}
            color={'blue'}
          />
        ) : (
          <TouchableOpacity onPress={getUsers} style={{marginLeft: 20}}>
            {/* <TouchableOpacity onPress={searchAccount} style={{marginLeft: 20}}> */}
            <Icon name="magnify" size={25} color={colors.complimentary} />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text style={[appStyles.errorText, {marginVertical: 10}]}>{error}</Text>
      )}
      {loading && !subLoader.loading ? (
        <ActivityIndicator
          animating={loading}
          style={[appStyles.indicatorStyle]}
          size="large"
          color={colors.accent}
        />
      ) : (
        <View style={{marginTop: 20}}>
          <View style={{height: deviceHeight * 0.8}}>
            <FlatList
              refreshing={loading}
              data={searchUsers.length ? searchUsers : users}
              onRefresh={getUsers}
              contentContainerStyle={{paddingBottom: 20}}
              keyExtractor={item => item.id?.toString()}
              renderItem={({item}: any) => (
                <View style={styles.userSection}>
                  <TouchableOpacity
                    disabled={loading}
                    onPress={() => {
                      dispatch(updateVisitProfile(item));
                      navigation.navigate('UserProfile');
                    }}
                    style={styles.profile}>
                    <Image
                      style={{width: 50, height: 50, borderRadius: 25}}
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
                    />
                    <View style={{marginLeft: 20}}>
                      <Text style={styles.userText}>
                        {item.first_name + ' ' + item.last_name}
                      </Text>
                      <Text style={styles.userDesc}>ID: {item.id}</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled={subLoader.loading}
                    onPress={() => followUser(item)}
                    style={[
                      styles.followBtn,
                      item.is_followed && {backgroundColor: '#494759'},
                    ]}>
                    {subLoader.loading && subLoader.id == item.id ? (
                      <ActivityIndicator
                        animating={true}
                        color={colors.complimentary}
                        size={'small'}
                      />
                    ) : (
                      <Text style={styles.btnText}>
                        {item.is_followed ? 'Following' : 'Follow'}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d1f31',
    padding: 10,
  },

  image: {
    flex: 1,
    // display: 'flex',
    // justifyContent: 'space-around',
  },
  userSection: {
    marginTop: 20,
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
  },
  profile: {
    flexDirection: 'row',
  },
  input: {
    width: '85%',
    backgroundColor: '#585865',
    borderRadius: 40,
    color: '#fff',
    padding: 10,
  },

  userText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 20,
  },
  userDesc: {
    color: '#fff',
    marginTop: 5,
    fontWeight: '500',
    fontSize: 16,
  },
  followBtn: {
    backgroundColor: colors.accent,
    // paddingHorizontal: 10,
    height: 40,
    width: 90,
    alignItems: 'center',
    justifyContent: 'center',
    // paddingVertical: 5,
    borderRadius: 6,
  },
  btnText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
