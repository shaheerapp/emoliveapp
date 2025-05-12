import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  Image,
  NativeModule,
  LayoutAnimation,
  Platform,
  Modal,
  NativeModules,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import hotUpdate from 'react-native-ota-hot-update';

import IconF from 'react-native-vector-icons/FontAwesome6';
import {colors} from '../../../../styles/colors';
import {ChatClient} from 'react-native-agora-chat';
import appStyles from '../../../../styles/styles';
import {formatNumber} from '../../../../utils/generalScript';
import scripts from '../../../../scripts';
import AsyncStorage from '@react-native-async-storage/async-storage';

import axiosInstance from '../../../../Api/axiosConfig';
import envVar from '../../../../config/envVar';
import {useAppContext} from '../../../../Context/AppContext';
// import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Search({navigation}) {
  const [progress, setProgress] = useState(100);
  const [updateModal, setUpdateModal] = useState(false);
  const {userAuthInfo, tokenMemo} = useAppContext();
  const {user, setUser} = userAuthInfo;
  const chatClient = ChatClient.getInstance();
  const {token} = tokenMemo;
  const [error, setError] = useState(null);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUnreadMessages();

    // Fetch podcasts immediately
    refreshUser();

    // Set interval to fetch podcasts every 3 seconds
    const intervalId = setInterval(() => {
      refreshUser();
      // getUnreadMessages();
    }, 3000);

    // Cleanup function to clear interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const onCheckGitVersion = () => {
    setProgress(0);
    setUpdateModal(true);
    hotUpdate.git.checkForGitUpdate({
      restartAfterInstall: true,
      branch: Platform.OS === 'ios' ? 'iOS' : 'android',
      bundlePath:
        Platform.OS === 'ios'
          ? 'output/main.jsbundle'
          : 'output/index.android.bundle',
      url: 'https://github.com/aiengrimran/OTA-bundlep.git',
      // url: 'https://github.com/aiengrimran/OTA-bundle.git',
      onCloneFailed(msg: string) {
        Alert.alert('Clone project failed!', msg, [
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
          },
        ]);
      },
      // onCloneSuccess() {
      //   Alert.alert('Clone project success!', 'Restart to apply the changing', [
      //     {
      //       text: 'ok',
      //       onPress: () => hotUpdate.resetApp(),
      //     },
      //     {
      //       text: 'Cancel',
      //       onPress: () => {},
      //       style: 'cancel',
      //     },
      //   ]);
      // },
      onPullFailed(msg: string) {
        Alert.alert('Pull project failed!', msg, [
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
          },
        ]);
      },
      onPullSuccess() {
        Alert.alert('Pull project success!', 'Restart to apply the changing', [
          {
            text: 'ok',
            onPress: () => hotUpdate.resetApp(),
          },
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
          },
        ]);
      },
      onProgress(received: number, total: number) {
        const percent = (+received / +total) * 100;
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setProgress(percent);
      },
      onFinishProgress() {
        setUpdateModal(false);
      },
    });
  };

  const getUnreadMessages = async () => {
    try {
      const count = await chatClient.chatManager.getUnreadCount();
      setUnreadMessageCount(count);
      // console.log(count);
    } catch (error) {
      console.log(error);
    }
  };
  const refreshUser = async () => {
    try {
      // setLoading(true);
      const url = 'user/info';
      const res = await axiosInstance.get(url);
      setUser(res.data.user);
      await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const temp = async () => {
    console.log('i am clicked');
  };
  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator
          style={appStyles.indicatorStyle}
          size="large"
          color={colors.complimentary}
        />
      ) : (
        <>
          <TouchableOpacity
            onPress={() => navigation.navigate('VIP')}
            style={styles.vipBtn}>
            <Icon name="crown" color={colors.yellow} size={25} />
            <Text style={[appStyles.bodyMd, {color: colors.yellow}]}>
              Check VIP
            </Text>
          </TouchableOpacity>
          <View style={styles.refreshBtn}>
            {/* <TouchableOpacity onPress={refreshUser} style={styles.refresh}>
              <Icon name="refresh" color={colors.complimentary} size={20} />
            </TouchableOpacity> */}
            <TouchableOpacity
              onPress={() => navigation.navigate('EditProfile')}
              style={styles.editBtn}>
              <Icon
                name="account-edit"
                color={colors.complimentary}
                size={20}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              alignSelf: 'center',
              alignItems: 'center',
              marginTop: Platform.OS == 'ios' ? 50 : 10,
            }}>
            <Image
              style={appStyles.userAvatar}
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
            <Text style={styles.userText} onPress={getUnreadMessages}>
              {user.first_name + ' ' + user.last_name}{' '}
            </Text>
            <View style={styles.userInfo}>
              <Text style={styles.userDesc}>ID:{user.id}</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon
                  style={{marginTop: 5}}
                  name="google-maps"
                  color={colors.complimentary}
                  size={25}
                />

                <Text style={[styles.userDesc, {marginLeft: 2}]}>
                  {user.address ? user.address : 'Please Provide'}
                </Text>
              </View>
            </View>

            <View style={styles.accountInfo}>
              <View style={styles.gender}>
                <Icon
                  name={
                    ['male,female'].includes(user.gender)
                      ? 'gender-' + user.gender
                      : 'gender-male-female'
                  }
                  color={colors.complimentary}
                  size={20}
                />
                <Text style={styles.genderTxt}>{user.gender}</Text>
              </View>
              <View style={styles.level}>
                <Text style={styles.levelTxt}>Lv:17</Text>
              </View>
              <View
                style={[
                  styles.gender,
                  {
                    backgroundColor: colors.LG,
                    borderColor: colors.lines,
                    borderWidth: 1,
                    borderRadius: 25,
                  },
                ]}>
                {/* <Icon name="security" color="#fff" size={20} /> */}
                <Text style={styles.infoHeading}>Top-up Agent..</Text>
              </View>
            </View>
          </View>
          <ScrollView>
            {/* account */}
            <View>
              <View style={styles.account}>
                <View style={styles.info}>
                  <Text style={styles.accountStatus}>
                    {formatNumber(user.followers)}
                  </Text>
                  <Text style={styles.infoText}>Fans</Text>
                </View>
                <View style={styles.info}>
                  <Text style={styles.accountStatus}>
                    {formatNumber(user.following)}
                  </Text>
                  <Text style={styles.infoText}>Following</Text>
                </View>
                <View style={styles.info}>
                  <Text style={styles.accountStatus}>
                    {formatNumber(user.friends)}
                  </Text>
                  <Text style={styles.infoText}>Friends</Text>
                </View>
              </View>
              <View style={styles.secondRow}>
                <View style={styles.info}>
                  <Text style={styles.accountStatus}>
                    {formatNumber(user.wallet?.diamonds)}
                  </Text>
                  <Text style={styles.infoText}>Diamond</Text>
                </View>
                <View style={styles.info}>
                  <Text style={styles.accountStatus}>
                    {formatNumber(user.wallet?.beans)}
                  </Text>
                  {/* <Text style={styles.accountStatus}>247.4k</Text> */}
                  <Text style={styles.infoText}>Beans</Text>
                </View>
              </View>
            </View>
            {/* info end */}

            <View style={{marginTop: 20}}>
              <View style={styles.actionBtn}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Inbox')}
                  style={styles.iconBtn}>
                  <View style={styles.icon}>
                    <Icon
                      name="message-processing-outline"
                      size={33}
                      color={colors.complimentary}
                    />
                  </View>
                  <Text style={styles.actionTxr}>Messages</Text>
                  {unreadMessageCount > 0 && (
                    <View style={styles.unreadMessages}>
                      <Text
                        style={[
                          appStyles.regularTxtMd,
                          {color: colors.complimentary},
                        ]}>
                        {unreadMessageCount}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Agency')}
                  style={styles.iconBtn}>
                  <View style={styles.icon}>
                    <Icon
                      name="account-group"
                      size={33}
                      color={colors.complimentary}
                    />
                  </View>
                  <Text style={styles.actionTxr}>Agencies</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={() => navigation.navigate('JoinAgency')}>
                  <View style={styles.icon}>
                    <Icon
                      name="weight-lifter"
                      size={33}
                      color={colors.complimentary}
                    />
                  </View>
                  <Text style={styles.actionTxr}>Family</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.iconsRow}>
                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={() => navigation.navigate('Coin')}>
                  <View style={styles.icon}>
                    <Icon
                      name="wallet"
                      size={33}
                      color={colors.complimentary}
                    />
                  </View>
                  <Text style={styles.actionTxr}>Wallet</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={() => navigation.navigate('JoinAgency')}>
                  <View style={styles.icon}>
                    <IconF
                      name="handshake-simple"
                      size={33}
                      color={colors.complimentary}
                    />
                  </View>
                  <Text style={styles.actionTxr}>Join Agency</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Level')}
                  style={styles.iconBtn}>
                  <View style={styles.icon}>
                    <Icon name="star" size={33} color={colors.complimentary} />
                  </View>
                  <Text style={styles.actionTxr}>Level</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.iconsRow}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Ranking')}
                  style={styles.iconBtn}>
                  <View style={styles.icon}>
                    <Icon
                      name="message-processing-outline"
                      size={33}
                      color={colors.complimentary}
                    />
                  </View>
                  <Text style={styles.actionTxr}>Ranking</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconBtn} onPress={temp}>
                  <View style={styles.icon}>
                    <Icon
                      name="book-open-page-variant-outline"
                      size={33}
                      color={colors.complimentary}
                    />
                  </View>
                  <Text style={styles.actionTxr}>Terms</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconBtn}>
                  <View style={styles.icon}>
                    <Icon
                      name="bag-checked"
                      size={33}
                      color={colors.complimentary}
                    />
                  </View>
                  <Text style={styles.actionTxr}>Baggage</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.iconsRow}>
                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={() => navigation.navigate('Settings')}>
                  <View style={styles.icon}>
                    <Icon
                      name="message-processing-outline"
                      size={33}
                      color={colors.complimentary}
                    />
                  </View>
                  <Text style={styles.actionTxr}>Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconBtn}>
                  <View style={styles.icon}>
                    <Icon
                      name="book-open-page-variant-outline"
                      size={33}
                      color={colors.complimentary}
                    />
                  </View>
                  <Text style={styles.actionTxr}>Terms</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={onCheckGitVersion}>
                  <View style={styles.icon}>
                    <Icon
                      name="cloud-download-outline"
                      size={33}
                      color={colors.complimentary}
                    />
                  </View>
                  <Text style={styles.actionTxr}>Check For Updates</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </>
      )}
      <Modal visible={updateModal} transparent={true} animationType="slide">
        {/* Backdrop */}
        <View style={styles.backdrop}>
          {/* Modal Content */}

          <View style={styles.modalView}>
            <Text style={[appStyles.title1, {color: colors.complimentary}]}>
              Update Available
            </Text>
            <View style={{marginVertical: 20}}>
              <Text
                style={[
                  appStyles.regularTxtMd,
                  {color: colors.body_text, textAlign: 'center'},
                ]}>
                Please Wait new update is being downloading...
              </Text>
              {!!progress && (
                <View style={styles.progress}>
                  <View
                    style={[
                      styles.process,
                      {
                        width: `${progress}%`,
                      },
                    ]}
                  />
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.LG,
    padding: 10,
  },

  image: {
    flex: 1,
  },
  userSection: {
    marginTop: 20,
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
  },
  profile: {
    flexDirection: 'row',
  },
  secondRow: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    alignSelf: 'center',
    width: '70%',
  },

  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Custom RGBA backdrop color
    justifyContent: 'center',
    alignItems: 'center',
    // alignSelf: 'center',
  },
  modalView: {
    // width: 300,
    padding: 20,
    backgroundColor: colors.LG,
    alignSelf: 'center',
    width: '90%',
    // minWidth
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderRadius: 26,
  },
  info: {
    width: '25%',
    alignItems: 'center',
  },
  progress: {
    height: 10,
    width: '80%',
    marginTop: 20,
    borderRadius: 8,
    borderColor: 'grey',
    borderWidth: 1,
    overflow: 'hidden',
  },
  process: {
    height: 10,
    backgroundColor: 'blue',
  },
  refreshBtn: {
    top: Platform.OS == 'ios' ? 80 : 20,
    flexDirection: 'row',
    position: 'absolute',
    right: 20,
    // justifyContent: 'space-between',
    // width: '25%',
  },
  levelTxt: {
    color: colors.dominant,
    ...appStyles.bodyRg,
  },
  accountInfo: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  unreadMessages: {
    position: 'absolute',
    right: 0,
    top: -10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: colors.accent,
  },
  gender: {
    backgroundColor: 'grey',
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 5,
  },
  accountStatus: {
    ...appStyles.headline2,
    // marginLeft:5,
    color: colors.complimentary,
  },
  genderTxt: {
    marginLeft: 3,
    marginTop: 2,
    ...appStyles.bodyRg,
    color: colors.complimentary,
    textTransform: 'capitalize',
  },
  account: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
  },
  userInfo: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    width: '60%',
    justifyContent: 'space-between',
  },
  iconBtn: {alignItems: 'center', width: '30%'},
  level: {
    backgroundColor: colors.semantic,
    borderRadius: 25,
    width: 72,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  infoHeading: {
    color: colors.body_text,
    ...appStyles.bodyRg,
    marginLeft: 5,
  },
  actionBtn: {
    flexDirection: 'row',
    width: '95%',
    justifyContent: 'space-between',
  },
  iconsRow: {
    flexDirection: 'row',
    marginVertical: 10,
    width: '95%',
    justifyContent: 'space-between',
  },
  infoText: {
    ...appStyles.regularTxtRg,
    color: colors.body_text,
  },
  vipBtn: {
    flexDirection: 'row',
    width: 108,
    height: 32,
    // width: '30%',
    position: 'absolute',
    top: Platform.OS == 'ios' ? 80 : 20,
    left: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lines,
    borderRadius: 25,
  },
  editBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: colors.accent,
  },
  refresh: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: colors.lines,
  },
  icon: {
    borderWidth: 1,
    width: 90,
    height: 90,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    // alignSelf: 'center',
    borderColor: '#494759',
    // backgroundColor:
  },

  userText: {
    ...appStyles.headline,
    marginTop: 10,
    textAlign: 'center',
    color: colors.complimentary,
  },
  userDesc: {
    ...appStyles.regularTxtRg,
    textAlign: 'center',
    color: colors.complimentary,
    marginTop: 5,
  },
  followBtn: {
    backgroundColor: '#ef0143',
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
  },
  actionTxr: {
    ...appStyles.regularTxtRg,
    marginTop: 5,
    color: colors.complimentary,
  },
  chatBtn: {
    backgroundColor: '#211f34',
    height: 60,
    borderColor: '#494759',
    borderWidth: 1,
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
  },
  collabBtn: {
    marginTop: 20,
    borderRadius: 8,
    flexDirection: 'row',
    width: '99%',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#494759',
    // justifyContent: 'flex-start',
  },
  btnText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
