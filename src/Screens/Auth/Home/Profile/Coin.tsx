import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
  Platform,
  Alert,
} from 'react-native';
import React, {useCallback, useState, useRef, useEffect} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconF from 'react-native-vector-icons/FontAwesome6';
import envVar from '../../../../config/envVar';
import appStyles from '../../../../styles/styles';
import PlayStore from '../../../../assets/svg/play.svg';
import {formatNumber} from '../../../../utils/generalScript';
import Toast from 'react-native-toast-message';

import Cat from '../../../../assets/svg/cat.svg';
import EasyPaisa from '../../../../assets/svg/easy.svg';
import {colors} from '../../../../styles/colors';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import axiosInstance from '../../../../Api/axiosConfig';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
import {useDispatch, useSelector} from 'react-redux';
import {setPurchase} from '../../../../store/slice/accountSlice';
import {useAppContext} from '../../../../Context/AppContext';
// import audioService from '../../../../services/audioService';

interface CoinProp {
  navigation: any;
}
export default function Coin({navigation}: CoinProp) {
  const dispatch = useDispatch();
  const {purchase} = useSelector((state: any) => state.account);
  const {userAuthInfo, tokenMemo} = useAppContext();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const {user, setUser} = userAuthInfo;
  const {token} = tokenMemo;
  const [data, setData] = useState({
    type: '',
    combine: [],
    displaying: [],
    disabled: false,
  });

  const handleOpenSheet = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);
  useEffect(() => {
    getPackages();
  }, []);

  // renders
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );

  const getPackages = async () => {
    try {
      setLoading(true);
      const url = 'packages';
      const res = await axiosInstance.get(url);
      // console.log(res.data);
      setData((prev: any) => ({
        ...prev,
        type: 'diamonds',
        combine: res.data.packages,
        displaying: res.data.packages.diamonds,
      }));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const offlinePurchase = async () => {
    bottomSheetRef.current?.close();
    Alert.alert('Offline Transfer', 'Please Transfer offline Amount to Admin');
    try {
      setData(prev => ({...prev, disabled: true}));

      const url = 'package/purchase';
      let data = {
        packageId: purchase.id,
        type: 'offline',
      };
      const res = await axiosInstance.post(url, data);
      // Toast.show({
      //   type: 'success',
      //   text1: 'Success',
      //   text2: 'Request Sent 👋'
      // });
      console.log(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setData(prev => ({...prev, disabled: false}));
    }
  };

  const displayType = (type: any) => {
    setData(prev => ({...prev, displaying: data.combine[type], type}));
  };
  const refreshUser = async () => {
    try {
      setLoading(true);
      const url = 'user';
      const res = await axiosInstance.get(url);
      // console.log(res.data);
      setUser(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <View style={{marginTop: Platform.OS == 'ios' ? 50 : 10}}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}>
          <Icon name="arrow-left-thin" color={colors.complimentary} size={25} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={refreshUser} style={styles.editBtn}>
        <Icon name="refresh" color={colors.complimentary} size={23} />
      </TouchableOpacity>

      <View style={{alignSelf: 'center', alignItems: 'center'}}>
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
        <Text style={styles.userText}>
          {/* Current Details */}
          {user.first_name + ' ' + user.last_name}
        </Text>
        <View style={styles.accountStats}>
          <View style={styles.info}>
            <Text style={styles.infoHeading}>
              {formatNumber(user.wallet?.diamonds)}
            </Text>
            <Text style={styles.infoText}>Diamond 💎</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.infoHeading}>
              {formatNumber(user.wallet?.beans)}
            </Text>
            <Text style={styles.infoText}>Beans 🫘</Text>
          </View>
        </View>
      </View>
      <View style={styles.accountInfo}>
        <TouchableOpacity>
          <Text style={styles.balanceTxt}>Account Balance</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <View>
          <ActivityIndicator
            animating={true}
            size={'large'}
            style={[appStyles.indicatorStyle, {marginTop: deviceHeight * 0.2}]}
          />
        </View>
      ) : (
        <>
          <View style={styles.coinType}>
            <TouchableOpacity
              onPress={() => displayType('diamonds')}
              style={[
                styles.tab,
                data.type == 'diamonds' && {borderBottomWidth: 2},
              ]}>
              <Text
                style={[
                  styles.tabText,
                  data.type == 'diamonds' && {color: '#fff'},
                ]}>
                Diamonds 💎
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => displayType('beans')}
              style={[
                styles.tab,
                data.type == 'beans' && {borderBottomWidth: 2},
              ]}>
              <Text
                style={[
                  styles.tabText,
                  data.type == 'beans' && {color: '#fff'},
                ]}>
                Beans
              </Text>
              <Icon name="chevron-right" color="#fff" size={25} />
            </TouchableOpacity>
          </View>

          {data.type == 'diamonds' ? (
            <Diamond
              navigation={navigation}
              data={data}
              dispatch={dispatch}
              handleOpenSheet={handleOpenSheet}></Diamond>
          ) : (
            <Beans
              data={data}
              navigation={navigation}
              dispatch={dispatch}
              handleOpenSheet={handleOpenSheet}></Beans>
          )}
        </>
      )}

      <BottomSheet
        index={-1}
        enablePanDownToClose={true}
        snapPoints={['45%']}
        ref={bottomSheetRef}
        backgroundStyle={{
          borderTopEndRadius: 40,
          borderTopLeftRadius: 40,
        }}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{
          backgroundColor: colors.body_text,
        }}
        handleStyle={{
          borderTopEndRadius: 40,
          borderTopLeftRadius: 40,
          backgroundColor: colors.LG,
        }}>
        <BottomSheetView style={styles.contentContainer}>
          <View style={{marginTop: 20, borderRadius: 30}}>
            <Text style={[appStyles.regularTxtRg, {color: colors.body_text}]}>
              Chose Method :
            </Text>
            <View style={{marginTop: 30}}>
              <TouchableOpacity style={styles.sheetBtn}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <PlayStore height={33} width={33} />
                  <Text
                    style={[
                      appStyles.paragraph1,
                      {color: colors.complimentary, marginLeft: 15},
                    ]}>
                    Google Play Store
                  </Text>
                </View>
                <Icon name="chevron-right" size={25} color={colors.lines} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sheetBtn}
                onPress={offlinePurchase}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Cat height={33} width={33} />
                  <Text
                    style={[
                      appStyles.paragraph1,
                      {color: colors.complimentary, marginLeft: 15},
                    ]}>
                    Emo Live Offline
                  </Text>
                </View>
                <Icon name="chevron-right" size={25} color={colors.lines} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  bottomSheetRef.current?.close();
                  navigation.navigate('PurchaseVIP');
                }}
                style={styles.sheetBtn}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <EasyPaisa height={33} width={33} />
                  <Text
                    style={[
                      appStyles.paragraph1,
                      {color: colors.complimentary, marginLeft: 15},
                    ]}>
                    Easypaisa
                  </Text>
                </View>
                <Icon name="chevron-right" size={25} color={colors.lines} />
              </TouchableOpacity>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d1f31',
    padding: 10,
  },
  tab: {
    flexDirection: 'row',
    width: '50%',
    paddingBottom: 10,
    borderBottomColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceTxt: {
    ...appStyles.regularTxtRg,
    color: colors.complimentary,
  },
  tabText: {
    ...appStyles.paragraph1,
    color: colors.complimentary,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: colors.LG,
    padding: 16,
  },
  coinType: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  image: {
    flex: 1,
  },
  backBtn: {
    flexDirection: 'row',
    width: '30%',
    position: 'absolute',
    left: 10,
    alignItems: 'center',
    padding: 10,
    borderRadius: 16,
  },
  sheetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    justifyContent: 'space-between',
  },
  accountInfo: {
    marginTop: 20,
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '95%',
  },
  editBtn: {
    flexDirection: 'row',
    // width: '20%',
    position: 'absolute',
    width: 35,
    height: 35,
    top: Platform.OS == 'ios' ? 70 : 20,
    right: 20,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  cardPeriod: {
    color: colors.complimentary,
    ...appStyles.bodyMd,
    marginLeft: 5,
    marginVertical: 10,
  },
  cardPrice: {
    ...appStyles.bodyMd,
    color: colors.complimentary,
  },
  card: {
    paddingTop: 10,
    marginBottom: 20,
    width: deviceWidth * 0.291,
    height: deviceWidth * 0.39,
    // backgroundColor: '#494759',
    justifyContent: 'center',
    borderWidth: 1,
    margin: 5,
    borderColor: '#403f51',
    alignItems: 'center',
    borderRadius: 8,
  },
  btn: {
    backgroundColor: '#ef0143',
    width: '90%',
    padding: 15,
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeCard: {
    borderColor: '#a30733',
    backgroundColor: '#291118',
  },

  tabBtn: {
    borderBottomColor: 'white',
    paddingBottom: 10,
  },
  info: {
    width: '25%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoHeading: {
    textAlign: 'center',
    marginRight: 14,
    ...appStyles.headline2,
    color: colors.complimentary,
  },
  infoText: {
    ...appStyles.bodyRg,
    marginTop: 5,
    textAlign: 'center',
    color: colors.body_text,
  },
  cardAmount: {
    backgroundColor: '#ed005c',
    borderRadius: 9,
    padding: 5,
    marginTop: 10,
  },
  userText: {
    ...appStyles.headline,
    marginTop: 10,
    textAlign: 'center',
    color: colors.complimentary,
  },
  accountStats: {
    flexDirection: 'row',
    marginTop: 30,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
});

interface DiamondProps {
  navigation: any;
  handleOpenSheet: any;
  data: any;
  dispatch: any;
}
const Diamond = ({
  navigation,
  handleOpenSheet,
  data,
  dispatch,
}: DiamondProps) => {
  return (
    <View
      style={{
        marginTop: 40,
        alignItems: 'center',
      }}>
      <FlatList
        data={data.displaying}
        numColumns={3}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            disabled={data.disabled}
            style={styles.card}
            onPress={() => {
              dispatch(setPurchase(item));
              handleOpenSheet();
            }}>
            <Image
              style={{
                marginTop: 10,
                height: deviceWidth * 0.224,
                width: deviceWidth * 0.224,
              }}
              source={require('../../../../assets/images/diamonds.png')}
            />
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.cardPeriod}>💎 {item.count}</Text>
            </View>
            <View style={styles.cardAmount}>
              <Text style={styles.cardPrice}>${item.price}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

interface Beans {
  navigation: any;
  handleOpenSheet: any;
  data: any;
  dispatch: any;
}
const Beans = ({navigation, handleOpenSheet, data, dispatch}: Beans) => {
  return (
    <View
      style={{
        marginTop: 40,
        alignItems: 'center',
      }}>
      <FlatList
        data={data.displaying}
        numColumns={3}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            disabled={data.disabled}
            style={styles.card}
            onPress={() => {
              dispatch(setPurchase(item));
              handleOpenSheet();
            }}>
            <Image
              style={{
                height: deviceWidth * 0.224,
                width: deviceWidth * 0.224,
              }}
              source={require('../../../../assets/images/beans.png')}
            />
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.cardPeriod}>🫘 {item.count}</Text>
            </View>
            <View style={styles.cardAmount}>
              <Text style={styles.cardPrice}>${item.price}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};
