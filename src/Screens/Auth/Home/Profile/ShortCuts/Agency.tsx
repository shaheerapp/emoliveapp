import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import appStyles from '../../../../../styles/styles';
import {colors} from '../../../../../styles/colors';

export default function Inbox({navigation}) {
  return (
    <View style={styles.container}>
      <View style={[appStyles.backBtn]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            // padding: 10,
          }}>
          <Icon name="arrow-left-thin" color={colors.complimentary} size={25} />
          <Text style={styles.heading}>Agencies</Text>
        </TouchableOpacity>
      </View>

      <View style={{marginTop: 40}}>
        <View style={styles.userSection}>
          <TouchableOpacity
            style={styles.profile}
            onPress={() => navigation.navigate('AgencyMembers')}>
            <View style={styles.imgOverly}>
              <Text style={{color: '#fff'}}>text</Text>
            </View>
            <Image
              style={{width: 50, height: 50, borderRadius: 25}}
              source={require('../../../../../assets/images/live/girl1.jpg')}
            />
            <View style={{marginLeft: 20}}>
              <Text style={styles.userText}>Tas Family</Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '90%',
                }}>
                <Text style={styles.userDesc}>Members: 234</Text>
                <Text style={styles.userDesc}>Points: 234K</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.userSection}>
          <TouchableOpacity
            style={styles.profile}
            onPress={() => navigation.navigate('AgencyMembers')}>
            <View style={styles.imgOverly}>
              <Text style={{color: '#fff'}}>text</Text>
            </View>
            <Image
              style={{width: 50, height: 50, borderRadius: 25}}
              source={require('../../../../../assets/images/live/girl2.jpg')}
            />
            <View style={{marginLeft: 20}}>
              <Text style={styles.userText}>Isabella Rose Circle</Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '90%',
                }}>
                <Text style={styles.userDesc}>Members: 1235</Text>
                <Text style={styles.userDesc}>Points: 234K</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.userSection}>
          <TouchableOpacity
            style={styles.profile}
            onPress={() => navigation.navigate('AgencyMembers')}>
            <View style={styles.imgOverly}>
              <Text style={{color: '#fff'}}>text</Text>
            </View>
            <Image
              style={{width: 50, height: 50, borderRadius: 25}}
              source={require('../../../../../assets/images/live/girl3.jpg')}
            />
            <View style={{marginLeft: 20}}>
              <Text style={styles.userText}>Stars</Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '90%',
                }}>
                <Text style={styles.userDesc}>Members: 3336</Text>
                <Text style={styles.userDesc}>Points: 234K</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.userSection}>
          <TouchableOpacity
            style={styles.profile}
            onPress={() => navigation.navigate('AgencyMembers')}>
            <View style={styles.imgOverly}>
              <Text style={{color: '#fff'}}>text</Text>
            </View>
            <Image
              style={{width: 50, height: 50, borderRadius: 25}}
              source={require('../../../../../assets/images/live/girl6.jpg')}
            />
            <View style={{marginLeft: 20}}>
              <Text style={styles.userText}>Ava Marie</Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',

                  width: '90%',
                }}>
                <Text style={styles.userDesc}>ID: 237</Text>
                <Text style={styles.userDesc}>Points: 234K</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d1f31',
    padding: 10,
  },
  heading: {
    fontSize: 22,
    marginLeft: 20,
    fontWeight: '600',
    color: '#fff',
  },
  image: {
    flex: 1,
    // display: 'flex',
    // justifyContent: 'space-around',
  },
  imgOverly: {
    backgroundColor: '#07fef8',
    position: 'absolute',
    zIndex: 2,
    width: 30,
    borderRadius: 10,
    left: 5,
    top: -6,
    height: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userSection: {
    marginTop: 20,
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
  },
  profile: {
    flexDirection: 'row',
  },

  userText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 20,
  },
  userDesc: {
    color: '#82838d',
    marginTop: 5,
    fontWeight: '500',
    fontSize: 16,
  },
  followBtn: {
    backgroundColor: '#ef0143',
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
