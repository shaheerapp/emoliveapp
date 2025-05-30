import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  Image,
  LayoutAnimation,
  Platform,
  Modal,
  ImageBackground,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import hotUpdate from 'react-native-ota-hot-update';

import {colors} from '../../../../styles/colors';
import {ChatClient} from 'react-native-agora-chat';
import appStyles from '../../../../styles/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

import axiosInstance from '../../../../Api/axiosConfig';
import envVar from '../../../../config/envVar';
import {useAppContext} from '../../../../Context/AppContext';
import {IMAGES} from '../../../../assets/images';
import {actionItems, characterItems, otherItems} from '../../../../utils/data';

export default function Search({navigation}) {
  const [progress, setProgress] = useState(100);
  const [updateModal, setUpdateModal] = useState(false);
  const {userAuthInfo, tokenMemo} = useAppContext();
  const {user, setUser} = userAuthInfo;
  const chatClient = ChatClient.getInstance();
  const {token} = tokenMemo;
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

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.iconBtn}
      onPress={() => {
        if (item.onPress) {
          item.onPress();
        } else if (item.navigation && !(item.tittle == 'Terms')) {
          navigation.navigate(item.navigation);
        }
      }}>
      <Image source={item.icon} style={styles.icon} resizeMode="contain" />
      <Text style={[appStyles.bodyMd, {color: colors.complimentary}]}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('./../../../../assets/images/settingBg.png')}
      style={styles.container}>
      {loading ? (
        <ActivityIndicator
          style={appStyles.indicatorStyle}
          size="large"
          color={colors.complimentary}
        />
      ) : (
        <FlatList
          data={[1]}
          renderItem={({index}) => (
            <>
              <View
                style={{
                  marginTop: Platform.OS == 'ios' ? 45 : 10,
                  width: '100%',
                }}>
                <View style={styles.imageContainer}>
                  <View style={[appStyles.userAvatar, styles.logoContainer]}>
                    <Image
                      style={{width: '100%', height: '100%'}}
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
                  </View>
                  <Image style={{width: 90, height: 50}} source={IMAGES.logo} />
                </View>
                <Text
                  style={[appStyles.title1, {color: 'white'}]}
                  onPress={getUnreadMessages}>
                  {user.first_name + ' ' + user.last_name}{' '}
                </Text>
                <View style={styles.userInfo}>
                  <Text numberOfLines={1} style={styles.userDesc}>
                    {/* {user?.email} */}Agency Owner
                  </Text>
                  <View
                    style={{
                      width: 1.2,
                      height: 30,
                      backgroundColor: 'white',
                      alignSelf: 'center',
                      marginHorizontal: 10,
                    }}
                  />

                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      style={{width: 15, height: 15}}
                      source={IMAGES.send}
                      resizeMode="contain"
                    />

                    <Text
                      numberOfLines={1}
                      style={[styles.userDesc, {marginLeft: 2}]}>
                      {user.address ? user.address : 'Please Provide'}
                    </Text>
                    <Image
                      style={{width: 15, height: 15}}
                      source={IMAGES.arrowDown}
                      resizeMode="contain"
                    />
                  </View>
                </View>

                <View style={[styles.accountInfo, {width: '90%'}]}>
                  <View style={[styles.gender, {backgroundColor: 'white'}]}>
                    <Text style={[styles.levelTxt, {color: colors.dominant}]}>
                      {user.gender}
                    </Text>
                  </View>
                  <View
                    style={[styles.gender, {backgroundColor: colors.green}]}>
                    <Text style={[styles.levelTxt, {color: colors.white}]}>
                      ID:17
                    </Text>
                  </View>
                  <View
                    style={[styles.gender, {backgroundColor: colors.yellow}]}>
                    {/* <Icon name="security" color="#fff" size={20} /> */}
                    <Text style={[styles.levelTxt, {color: colors.white}]}>
                      Top-up Agent..
                    </Text>
                    <Image
                      style={{width: 15, height: 15}}
                      source={IMAGES.arrow}
                      resizeMode="contain"
                      tintColor={colors.white}
                    />
                  </View>
                  <View style={[styles.checkVip]}>
                    <Text
                      style={[
                        styles.levelTxt,
                        {color: 'white', fontWeight: '900'},
                      ]}>
                      Check VIP
                    </Text>
                    <View style={{position: 'absolute', right: -1.5, top: -2}}>
                      <Image
                        style={{width: 23, height: 23}}
                        source={IMAGES.crown}
                        resizeMode="contain"
                        // tintColor={colors.white}
                      />
                    </View>
                  </View>
                  <Image
                    style={{width: 25, height: 25}}
                    source={IMAGES.mic}
                    resizeMode="contain"
                  />
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  width: '80%',
                }}>
                {characterItems.map((item, index) => (
                  <View key={index} style={styles.item}>
                    <Image
                      source={item.icon}
                      style={item.title ? styles.ceoimage : styles.image}
                      resizeMode="contain"
                    />
                    {item.title ? (
                      <Text style={styles.title}>{item.title}</Text>
                    ) : null}
                  </View>
                ))}
              </View>
              <ImageBackground
                source={IMAGES.topGradient}
                resizeMode="contain"
                style={styles.gradient}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('FanAndFollower', {
                      name: 'Fans', // or any other ID
                    });
                  }}
                  style={styles.gradientView}>
                  <Text style={[appStyles.paragraph1, styles.topgradientItem]}>
                    14
                  </Text>
                  <Text style={[appStyles.headline2, styles.topgradientItem]}>
                    Fans
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('FanAndFollower', {
                      name: 'Following', // or any other ID
                    });
                  }}
                  style={styles.gradientView}>
                  <Text style={[appStyles.paragraph1, styles.topgradientItem]}>
                    40
                  </Text>
                  <Text style={[appStyles.headline2, styles.topgradientItem]}>
                    Following
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('FanAndFollower', {
                      name: 'Friends', // or any other ID
                    });
                  }}
                  style={styles.gradientView}>
                  <Text style={[appStyles.paragraph1, styles.topgradientItem]}>
                    44
                  </Text>
                  <Text style={[appStyles.headline2, styles.topgradientItem]}>
                    Friends
                  </Text>
                </TouchableOpacity>
              </ImageBackground>
              <ImageBackground
                source={IMAGES.bottomGradient}
                resizeMode="contain"
                style={[styles.gradient, styles.bottomgradient]}>
                <View style={styles.gradientView}>
                  <Text style={[appStyles.paragraph1, styles.topgradientItem]}>
                    40
                  </Text>
                  <Text style={[appStyles.headline2, styles.topgradientItem]}>
                    Diamonds
                  </Text>
                </View>
                <View style={styles.gradientView}>
                  <Text style={[appStyles.paragraph1, styles.topgradientItem]}>
                    44
                  </Text>
                  <Text style={[appStyles.headline2, styles.topgradientItem]}>
                    Beans
                  </Text>
                </View>
              </ImageBackground>
              <View>
                <View style={styles.agentBtn}>
                  <Image
                    source={IMAGES.arrowUp}
                    style={{
                      width: 18,
                      height: 8,
                      alignSelf: 'center',
                      tintColor: colors.white,
                    }}
                  />
                  <Text style={[appStyles.headline2, styles.topgradientItem]}>
                    Top Up Agent
                  </Text>
                </View>
              </View>
              {/* account */}

              <View style={{marginTop: -20}}>
                <FlatList
                  data={actionItems}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => index.toString()}
                  numColumns={4}
                  contentContainerStyle={styles.grid}
                />
                <Text style={[appStyles.title1, {color: colors.complimentary}]}>
                  Others
                </Text>
                <FlatList
                  data={otherItems}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => index.toString()}
                  numColumns={4}
                  contentContainerStyle={styles.grid}
                />
              </View>
            </>
          )}
        />
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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.LG,
    padding: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  agentBtn: {
    borderRadius: 10,
    paddingVertical: 7,
    backgroundColor: colors.green,
    borderWidth: 3,
    borderColor: colors.white,
    width: '38%',
    alignSelf: 'center',
    top: -20,
  },
  logoContainer: {
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: colors.semantic,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gradient: {
    width: '100%',
    // height: 50,÷
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignSelf: 'center',
    marginVertical: 20,
    paddingVertical: 8,
  },
  bottomgradient: {
    top: -20,
    width: '100%',
    justifyContent: 'center',
    // height: 50,
    marginVertical: 10,
    gap: 35,
    paddingVertical: 7,
  },
  item: {
    marginHorizontal: 4,
    alignItems: 'center',
  },
  gradientView: {top: 0},
  topgradientItem: {textAlign: 'center', color: colors.white},
  image: {
    width: 35,
    height: 35,
    bottom: -5,
  },
  ceoimage: {
    width: 35,
    height: 35,
  },
  title: {
    marginTop: 1,
    fontSize: 8,
    textAlign: 'center',
    color: colors.white,
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

  checkVip: {
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#949494',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  profile: {
    flexDirection: 'row',
  },
  grid: {
    paddingVertical: 15,
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
  },
  modalView: {
    padding: 20,
    backgroundColor: colors.LG,
    alignSelf: 'center',
    width: '90%',
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
  },
  levelTxt: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Kanit',
  },
  accountInfo: {
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 20,
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
    color: colors.purple,
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
    // marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    width: '60%',
    justifyContent: 'space-between',
  },
  iconBtn: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 100,
    paddingVertical: 7,
    paddingHorizontal: 5,
    gap: 5,
    borderColor: 'white',
    marginVertical: 7,
    marginRight: 5,
  },
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
    // borderWidth: 1,
    width: 25,
    height: 25,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    // alignSelf: 'center',
    // borderColor: '#494759',
    // backgroundColor:
  },

  userText: {
    ...appStyles.headline,
    marginTop: 10,
    // textAlign: 'center',
    color: colors.complimentary,
  },
  userDesc: {
    ...appStyles.regularTxtRg,
    textAlign: 'center',
    color: colors.complimentary,
    marginTop: 5,
    maxWidth: '90%',
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
