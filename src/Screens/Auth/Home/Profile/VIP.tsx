import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconF from 'react-native-vector-icons/FontAwesome6';
import {colors} from '../../../../styles/colors';
import appStyles from '../../../../styles/styles';
import Group from '../../../../assets/svg/Group.svg';
import Bubble from '../../../../assets/svg/bubble.svg';
import Card from '../../../../assets/svg/card.svg';
import Effect from '../../../../assets/svg/effect.svg';
import Medal from '../../../../assets/svg/medal.svg';
import Diamond from '../../../../assets/svg/diamond.svg';
import Speed from '../../../../assets/svg/speed.svg';
import Doctor from '../../../../assets/svg/doctor.svg';
import Ic from '../../../../assets/svg/Ic.svg';
import envVar from '../../../../config/envVar';
import {useAppContext} from '../../../../Context/AppContext';

// import Group from '../../../../assets/svg/Group.svg';
export default function VIP({navigation}) {
  const {userAuthInfo, tokenMemo} = useAppContext();
  const {user} = userAuthInfo;
  const {token} = tokenMemo;
  const [tab, setTab] = useState(1);
  const [card, setCard] = useState(2);

  const updateCard = (valTab: number) => {
    setCard(valTab);
  };
  const updateTab = (valTab: number) => {
    setTab(valTab);
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backBtn}>
        <Icon name="arrow-left-thin" color="#fff" size={25} />
      </TouchableOpacity>
      <View
        style={{
          alignSelf: 'center',
          alignItems: 'center',
          marginTop: Platform.OS == 'ios' ? 60 : 10,
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
        <Text style={styles.userText}>
          {user.first_name + ' ' + user.last_name}
        </Text>
        <Text style={styles.userDesc}>ID:{user.id}</Text>
      </View>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tabBtn, tab == 1 && {borderBottomWidth: 1}]}
          onPress={() => updateTab(1)}>
          <Text style={[styles.tab, tab == 1 && {color: '#fff'}]}>
            Brilliant
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, tab == 2 && {borderBottomWidth: 1}]}
          onPress={() => updateTab(2)}>
          <Text style={[styles.tab, tab == 2 && {color: '#fff'}]}>Crystal</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, tab == 3 && {borderBottomWidth: 1}]}
          onPress={() => updateTab(3)}>
          <Text style={[styles.tab, tab == 3 && {color: '#fff'}]}>Diamond</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, tab == 4 && {borderBottomWidth: 1}]}
          onPress={() => updateTab(4)}>
          <Text style={[styles.tab, tab == 4 && {color: '#fff'}]}>Luxury</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          marginTop: 20,
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}>
        <TouchableOpacity
          onPress={() => updateCard(1)}
          style={[styles.card, card == 1 && styles.activeCard]}>
          <Icon name="diamond" color="#fff" size={30} />
          <Text style={styles.cardCategory}>Basic</Text>
          <Text style={styles.cardPeriod}>1 Month</Text>
          <Text style={styles.cardPrice}>$2.99</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => updateCard(2)}
          style={[styles.card, card == 2 && styles.activeCard]}>
          <Icon name="diamond" color="#cede6a" size={30} />
          <Text style={styles.cardCategory}>Basic</Text>
          <Text style={styles.cardPeriod}>1 Month</Text>
          <Text style={styles.cardPrice}>$2.99</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => updateCard(3)}
          style={[styles.card, card == 3 && styles.activeCard]}>
          <Icon name="diamond" color="#a2d9ff" size={30} />
          <Text style={styles.cardCategory}>Basic</Text>
          <Text style={styles.cardPeriod}>1 Month</Text>
          <Text style={styles.cardPrice}>$2.99</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.vipText}>VIP license agreement </Text>

      <View style={{height: '50%'}}>
        <ScrollView contentContainerStyle={{marginTop: 10}}>
          <View style={{marginBottom: 40, paddingBottom: 80}}>
            <View style={styles.row}>
              <TouchableOpacity style={{alignItems: 'center'}}>
                <View style={styles.icon}>
                  <Effect width={33} height={33} />
                </View>
                <Text style={styles.actionTxr}>Entrance Effect</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{alignItems: 'center'}}>
                <View style={styles.icon}>
                  <Group width={33} height={33} />
                </View>
                <Text style={styles.actionTxr}>PrivFunc</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{alignItems: 'center'}}>
                <View style={styles.icon}>
                  <Bubble width={33} height={33} />
                </View>
                <Text style={styles.actionTxr}>Chat Bubbles</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.row, {marginVertical: 10}]}>
              <TouchableOpacity style={{alignItems: 'center'}}>
                <View style={styles.icon}>
                  <Doctor width={33} height={33} />
                </View>
                <Text style={styles.actionTxr}>Profile Decor</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{alignItems: 'center'}}>
                <View style={styles.icon}>
                  <Medal width={33} height={33} />
                </View>
                <Text style={styles.actionTxr}>VIP Medal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{alignItems: 'center'}}>
                <View style={styles.icon}>
                  <Ic width={33} height={33} />
                </View>
                <Text style={styles.actionTxr}>VIP SLing</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.row, {marginBottom: 30}]}>
              <TouchableOpacity style={{alignItems: 'center'}}>
                <View style={styles.icon}>
                  <Diamond width={33} height={33} />
                </View>
                <Text style={styles.actionTxr}>VIP Diamond</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{alignItems: 'center'}}>
                <View style={styles.icon}>
                  <Card width={33} height={33} />
                </View>
                <Text style={styles.actionTxr}>Profile Card</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  width: '22%',
                }}>
                {/* <TouchableOpacity style={{alignItems: 'center'}}> */}
                <View style={styles.icon}>
                  <Speed width={33} height={33} />
                </View>
                {/* <Text style={styles.actionTxr}>Speed up</Text> */}
                <Text style={[styles.actionTxr, {width: '80%'}]}>
                  Speed up Upgrading
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('Coin')}>
        <Text style={{color: '#fff', fontWeight: '600', fontSize: 17}}>
          Get VIP Pass
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d1f31',
    padding: 10,
  },
  tabs: {
    marginTop: 10,
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-around',
  },
  row: {
    flexDirection: 'row',
    width: '95%',
    justifyContent: 'space-between',
  },
  tab: {
    ...appStyles.regularTxtMd,
    color: colors.body_text,
  },
  image: {
    flex: 1,
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
  cardCategory: {
    color: colors.light_blue,
    ...appStyles.bodyMd,
  },
  cardPeriod: {
    color: colors.light_blue,
    ...appStyles.bodyRg,
    marginVertical: 10,
  },
  backBtn: {
    flexDirection: 'row',
    width: '30%',
    position: 'absolute',
    top: Platform.OS == 'ios' ? 60 : 20,
    left: 10,
    alignItems: 'center',
    padding: 10,
    borderRadius: 16,
  },
  cardPrice: {
    ...appStyles.headline2,
    color: colors.complimentary,
  },
  card: {
    paddingTop: 10,
    width: 100,
    height: 150,
    borderWidth: 1,
    borderColor: '#403f51',
    alignItems: 'center',
    borderRadius: 8,
  },
  btn: {
    backgroundColor: '#ef0143',
    width: '90%',
    padding: 15,
    position: 'absolute',
    // position: 'relative',
    bottom: Platform.OS == 'ios' ? 30 : 20,
    alignSelf: 'center',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeCard: {
    borderColor: '#a30733',
    backgroundColor: '#291118',
  },
  profile: {
    flexDirection: 'row',
  },
  vipText: {
    ...appStyles.regularTxtMd,
    color: colors.body_text,
    marginVertical: 10,
    textAlign: 'center',
    alignSelf: 'center',
  },
  tabBtn: {
    borderBottomColor: colors.complimentary,
    paddingBottom: 10,
  },
  info: {
    width: '25%',
    // alignSelf: 'center',
  },
  gender: {
    backgroundColor: 'grey',
    borderRadius: 15,
    flexDirection: 'row',
    padding: 5,
  },
  icon: {
    borderWidth: 1,
    width: 80,
    height: 80,
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
    textAlign: 'center',
    ...appStyles.regularTxtMd,
    color: colors.complimentary,
    marginTop: 5,
  },
  actionTxr: {
    ...appStyles.bodyRg,
    marginTop: 5,
    color: colors.complimentary,
    textAlign: 'center',
  },
});
