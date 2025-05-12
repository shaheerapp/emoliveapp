import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import React, {useState} from 'react';
import appStyles from '../../../../../styles/styles';
import {colors} from '../../../../../styles/colors';

export default function Users() {
  const [tab, setTab] = useState(1);
  return (
    <View style={{width: '99%', flex: 1, position: 'relative'}}>
      <View style={styles.sheetTab}>
        <TouchableOpacity
          onPress={() => setTab(1)}
          style={[
            styles.sheetBtn,
            tab == 1 && {borderBottomColor: colors.complimentary},
          ]}>
          <Text
            style={[
              styles.sheetBtnTxt,
              tab == 1 && {color: colors.complimentary},
            ]}>
            Online Users
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setTab(2)}
          style={[
            styles.sheetBtn,
            tab == 2 && {borderBottomColor: colors.complimentary},
            {marginLeft: 10},
          ]}>
          <Text
            style={[
              styles.sheetBtnTxt,
              tab == 2 && {color: colors.complimentary},
            ]}>
            VIPs
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: 10,
        }}>
        <TouchableOpacity style={{alignItems: 'center'}}>
          <Image
            source={require('../../../../../assets/images/live/girl3.jpg')}
            style={styles.chatAvatar}
          />
          <Text style={styles.userName}>Khan Gamer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{alignItems: 'center'}}>
          <Image
            // source={require('../../../../../assets/images/live/girl3.jpg')}
            style={styles.chatAvatar}
          />
          <Text style={styles.userName}>Mr/Dewana</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{alignItems: 'center'}}>
          <Image
            source={require('../../../../../assets/images/live/girl4.jpg')}
            style={styles.chatAvatar}
          />
          <Text style={styles.userName}>Sana Khan</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: 10,
        }}>
        <TouchableOpacity style={{alignItems: 'center'}}>
          <Image
            // source={require('../../../../../assets/images/live/girl3.jpg')}
            style={styles.chatAvatar}
          />
          <Text style={styles.userName}>Botan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{alignItems: 'center'}}>
          <Image
            // source={require('../../../../../assets/images/live/girl7.jpg')}
            style={styles.chatAvatar}
          />
          <Text style={styles.userName}>Akira</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{alignItems: 'center'}}>
          <Image
            source={require('../../../../../assets/images/live/girl3.jpg')}
            style={styles.chatAvatar}
          />
          <Text style={styles.userName}>Akio</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: 10,
        }}>
        <TouchableOpacity style={{alignItems: 'center'}}>
          <Image
            source={require('../../../../../assets/images/live/girl1.jpg')}
            style={styles.chatAvatar}
          />
          <Text style={styles.userName}>Akari</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{alignItems: 'center'}}>
          <Image
            source={require('../../../../../assets/images/live/girl2.jpg')}
            style={styles.chatAvatar}
          />
          <Text style={styles.userName}>Gaming 123</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{alignItems: 'center'}}>
          <Image
            // source={require('../../../../../assets/images/live/girl5.jpg')}
            style={styles.chatAvatar}
          />
          <Text style={styles.userName}>Shah g</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  sheetTab: {
    marginVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sheetBtn: {
    paddingBottom: 10,
    // borderBottomColor: colors.complimentary,
    borderBottomWidth: 2,
    justifyContent: 'center',
    width: '40%',
  },
  sheetBtnTxt: {
    ...appStyles.regularTxtMd,
    color: colors.body_text,
    textAlign: 'center',
  },
  chatAvatar: {
    width: 60,
    height: 60,
    borderRadius: 35,
    backgroundColor: colors.complimentary,
    // borderWidth: 1,
  },
  userName: {
    ...appStyles.paragraph1,
    marginTop: 5,
    color: colors.complimentary,
  },
});
