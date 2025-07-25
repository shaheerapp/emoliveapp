import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {colors} from '../../../../../styles/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import appStyles from '../../../../../styles/styles';
import axiosInstance from '../../../../../Api/axiosConfig';

export default function BlockedUsers({navigation}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getBlockUsers();
  }, []);

  const getUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/chat/active-users');
      // dispatch(updateUsers(res.data.users));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  const getBlockUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/user/blocked-users');
      setUsers(res.data.users);
      if (res.data.users.length < 1) {
        setError('No User In Blocked List');
        clearError();
      }
      setLoading(false);
    } catch (error: any) {
      setError(error.message);
      clearError();
    }
  };
  const unBlockUser = async (userItem: any) => {
    try {
      const url = '/user/un-block/' + userItem.id;
      // const url = userItem.is_followed
      //   ? '/user/un-block-user/' + userItem.id
      //   : '/user/bloc-user/' + userItem.id;
      setLoading(true);
      const res = await axiosInstance.get(url);
      setLoading(false);
      setUsers(res.data.users);
      if (res.data.users.length < 1) {
        setError('No User In Blocked List');
      }
    } catch (error: any) {
      clearError();
      setError(error.message);
    }
  };
  const clearError = () => {
    setLoading(false);
    setTimeout(() => {
      setError('');
    }, 3000);
  };
  return (
    <View style={styles.container}>
      <View style={[appStyles.backBtn2]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left-thin" size={25} color={colors.complimentary} />
        </TouchableOpacity>
        <Text
          style={[
            appStyles.headline,
            {color: colors.complimentary, marginLeft: 10},
          ]}>
          Blocked List
        </Text>
      </View>
      {error && (
        <Text style={[appStyles.errorText, {marginVertical: 10}]}>{error}</Text>
      )}
      {loading ? (
        <ActivityIndicator
          style={[appStyles.indicatorStyle]}
          size="large"
          color={colors.accent}
        />
      ) : (
        <View>
          <FlatList
            data={users}
            keyExtractor={(item: any) => item.id?.toString()}
            renderItem={({item}: any) => (
              <View style={styles.userSection}>
                <TouchableOpacity
                  onPress={() => {
                    // dispatch(updateVisitProfile(item));
                    // navigation.navigate('UserProfile');
                  }}
                  style={styles.profile}>
                  <Image
                    style={{width: 49, height: 49, borderRadius: 25}}
                    source={
                      item.avatar
                        ? {uri: item.avatar}
                        : require('../../../../../assets/images/place.jpg')
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
                  style={styles.btn}
                  onPress={() => unBlockUser(item)}>
                  <Text style={styles.btnText}>Unblock</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark_gradient,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '99%',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: colors.lines,
    paddingRight: 10,
    paddingBottom: 15,
    marginVertical: 10,
  },
  icon: {
    width: '50%',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 16,
  },
  profile: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  userText: {
    color: colors.complimentary,
    ...appStyles.regularTxtMd,
  },
  userSection: {
    marginTop: 20,
    borderBottomColor: 'grey',
    // paddingHorizontal:100,
    borderBottomWidth: 1,
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
  },
  userDesc: {
    color: colors.complimentary,
    ...appStyles.regularTxtRg,
    marginTop: 5,
  },
  btn: {
    marginRight: 10,
    backgroundColor: colors.lines,
    height: 40,
    width: 90,
    alignItems: 'center',
    justifyContent: 'center',
    // paddingVertical: 5,
    borderRadius: 8,
  },
  btnText: {
    textAlign: 'center',
    color: colors.complimentary,
    ...appStyles.bodyMd,
  },
});
