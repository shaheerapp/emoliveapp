import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import appStyles from '../../../../../styles/styles';
import appStyles from '../../../../../styles/styles';
import {colors} from '../../../../../styles/colors';

export default function AgencyMembers({navigation}) {
  return (
    <View style={styles.container}>
      <View
        style={{
          marginTop: Platform.OS == 'ios' ? 40 : 5,
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '99%',
          alignItems: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '50%',
            padding: 16,
          }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              // padding: 10,
            }}>
            <Icon
              name="arrow-left-thin"
              color={colors.complimentary}
              size={25}
            />
            <Text style={styles.heading}>William Friends</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('HomeB')}>
          <Icon name="close" color={colors.complimentary} size={25} />
        </TouchableOpacity>
      </View>

      <View style={{marginTop: 40}}>
        <View style={styles.userSection}>
          <TouchableOpacity style={styles.profile}>
            <Image
              style={{width: 50, height: 50, borderRadius: 25}}
              source={require('../../../../../assets/images/live/girl1.jpg')}
            />
            <View style={{marginLeft: 20}}>
              <Text style={styles.userText}>Christa Martinez</Text>
              <Text style={styles.subTxt}>ID: 234</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.userSection}>
          <TouchableOpacity style={styles.profile}>
            <Image
              style={{width: 50, height: 50, borderRadius: 25}}
              source={require('../../../../../assets/images/live/girl2.jpg')}
            />
            <View style={{marginLeft: 20}}>
              <Text style={styles.userText}>Christabel Johnson</Text>
              <Text style={styles.subTxt}>ID: 235</Text>
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
    ...appStyles.headline,
    marginLeft: 20,
    color: colors.complimentary,
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
    // justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
  },
  profile: {
    flexDirection: 'row',
  },

  userText: {
    color: colors.complimentary,
    ...appStyles.regularTxtMd,
  },
  subTxt: {
    marginTop: 5,
    ...appStyles.regularTxtRg,
    color: colors.complimentary,
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
