import {
  View,
  Text,
  TextInput,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
} from 'react-native';
import React, {useState, useLayoutEffect} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import appStyles from '../../../../styles/styles';
import {colors} from '../../../../styles/colors';
import axiosInstance from '../../../../Api/axiosConfig';
import {useSelector, useDispatch} from 'react-redux';
import {
  setChatUser,
  updateUsers,
  updateVisitProfile,
} from '../../../../store/slice/usersSlice';
import envVar from '../../../../config/envVar';
import {formatNumber} from '../../../../utils/generalScript';
import {useAppContext} from '../../../../Context/AppContext';

export default function UserProfile({navigation}) {
  const dispatch = useDispatch();
  const {userAuthInfo, tokenMemo} = useAppContext();
  const {user} = userAuthInfo;
  const {token} = tokenMemo;
  const [error, setError] = useState('');
  const {visitProfile} = useSelector((state: any) => state.users);

  const [loading, setLoading] = useState(false);
  const followUser = async () => {
    try {
      const url = visitProfile.is_followed
        ? '/user/un-follow-user/' + visitProfile.id
        : '/user/follow-user/' + visitProfile.id;
      setLoading(true);
      const res = await axiosInstance.get(url);
      dispatch(updateUsers(res.data.users));
      const user = res.data.users.find(
        (item: any) => item.id === visitProfile.id,
      );
      dispatch(updateVisitProfile(user));
      setLoading(false);
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
      <TouchableOpacity
        style={{
          marginLeft: 30,
          top: Platform.OS == 'ios' ? 60 : 40,
          position: 'absolute',
        }}
        onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" color="#fff" size={25} />
      </TouchableOpacity>
      <View
        style={{
          alignSelf: 'center',
          alignItems: 'center',
          marginTop: Platform.OS === 'ios' ? 50 : 10,
        }}>
        <Image
          style={appStyles.userAvatar}
          source={
            visitProfile.avatar
              ? {
                  uri: envVar.API_URL + 'display-avatar/' + visitProfile.id,
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              : require('../../../../assets/images/place.jpg')
          }
        />

        <Text style={styles.userText}>
          {visitProfile.first_name + ' ' + visitProfile.last_name}
        </Text>
        <Text style={styles.userDesc}>{visitProfile.bio}</Text>
        <View style={styles.accountStats}>
          <View style={styles.info}>
            <Text style={styles.infoHeading}>
              {formatNumber(visitProfile.fans)}
            </Text>
            <Text style={styles.infoText}>Fans</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.infoHeading}>
              {formatNumber(visitProfile.following)}
            </Text>
            <Text style={styles.infoText}>Following</Text>
          </View>
        </View>
      </View>
      {error && (
        <Text style={[appStyles.errorText, {marginVertical: 10}]}>{error}</Text>
      )}
      {loading ? (
        <ActivityIndicator
          style={[appStyles.indicatorStyle, {marginTop: 100}]}
          size={'large'}
          color={colors.accent}
        />
      ) : (
        <>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: 30,
            }}>
            <TouchableOpacity
              onPress={followUser}
              style={[
                styles.followBtn,
                visitProfile.is_followed && {backgroundColor: colors.lines},
              ]}>
              <Text style={styles.btnTxt}>
                {visitProfile.is_followed ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                dispatch(setChatUser(visitProfile));
                navigation.navigate('Chat');
              }}
              style={styles.chatBtn}>
              <Text style={styles.btnTxt}>Chat</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.collabBtn}>
            <View
              style={{
                flexDirection: 'row',
                width: '50%',
                alignItems: 'center',
              }}>
              <Icon name="account-group" color="#fff" size={30} />
              <Text
                style={[
                  appStyles.paragraph1,
                  {
                    color: colors.complimentary,
                    marginLeft: 10,
                  },
                ]}>
                Collaborates
              </Text>
            </View>
            <Icon name="chevron-right" color="#fff" size={30} />
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
    padding: 10,
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
  info: {
    width: '33%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  infoHeading: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '500',
  },
  infoText: {
    color: '#868791',
    fontSize: 17,
    fontWeight: '500',
  },
  accountStats: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
  },
  btnTxt: {
    ...appStyles.paragraph1,
    color: colors.complimentary,
  },
  userText: {
    marginTop: 10,
    ...appStyles.headline,
    textAlign: 'center',
    color: colors.complimentary,
  },
  userDesc: {
    ...appStyles.regularTxtRg,
    textAlign: 'center',
    marginTop: 8,
    color: colors.complimentary,
  },
  followBtn: {
    backgroundColor: colors.accent,
    width: '45%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
  },
  chatBtn: {
    backgroundColor: colors.LG,
    // height: 40,
    borderColor: colors.lines,
    borderWidth: 1,
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
  },
  collabBtn: {
    marginTop: 40,
    borderRadius: 12,
    flexDirection: 'row',
    width: '99%',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.lines,
  },
});
