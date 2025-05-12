import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import appStyles from '../../../../../styles/styles';
import {colors} from '../../../../../styles/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconM from 'react-native-vector-icons/MaterialIcons';

export default function Gifts() {
  const [tab, setTab] = useState(1);
  return (
    <View style={{width: '99%', flex: 1, position: 'relative'}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '99%',
        }}>
        <TouchableOpacity>
          <Image
            source={require('../../../../../assets/images/live/girl3.jpg')}
            style={{
              backgroundColor: colors.complimentary,
              height: 30,
              width: 30,
              borderRadius: 15,
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={[appStyles.bodyMd, {color: colors.complimentary}]}>
            All
          </Text>
          <Icon name="chevron-right" size={25} color={colors.complimentary} />
        </TouchableOpacity>
      </View>
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
            Gifts
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
            Lucky Gifts
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
        <TouchableOpacity>
          <Text style={styles.giftTxt}>Treasure</Text>
          <View>
            <Icon name="palm-tree" size={25} color={colors.accent} />
            <Text style={styles.giftNum}>500</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.giftTxt}>Treasure</Text>
          <View>
            <Icon name="palm-tree" size={25} color={colors.accent} />
            <Text style={styles.giftNum}>500</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.giftTxt}>Treasure</Text>
          <View>
            <Icon name="palm-tree" size={25} color={colors.accent} />
            <Text style={styles.giftNum}>500</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.giftTxt}>Treasure</Text>
          <View>
            <Icon name="palm-tree" size={25} color={colors.accent} />
            <Text style={styles.giftNum}>500</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.giftTxt}>Treasure</Text>
          <View>
            <Icon name="palm-tree" size={25} color={colors.accent} />
            <Text style={styles.giftNum}>500</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          marginVertical: 10,
        }}>
        <TouchableOpacity>
          <Text style={styles.giftTxt}>Treasure</Text>
          <View>
            <Icon name="palm-tree" size={25} color={colors.accent} />
            <Text style={styles.giftNum}>500</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.giftTxt}>Treasure</Text>
          <View>
            <Icon name="palm-tree" size={25} color={colors.accent} />
            <Text style={styles.giftNum}>500</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.giftTxt}>Treasure</Text>
          <View>
            <Icon name="palm-tree" size={25} color={colors.accent} />
            <Text style={styles.giftNum}>500</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.giftTxt}>Treasure</Text>
          <View>
            <Icon name="palm-tree" size={25} color={colors.accent} />
            <Text style={styles.giftNum}>500</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.giftTxt}>Treasure</Text>
          <View>
            <Icon name="palm-tree" size={25} color={colors.accent} />
            <Text style={styles.giftNum}>500</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
        <TouchableOpacity>
          <Text style={styles.giftTxt}>Treasure</Text>
          <View>
            <Icon name="palm-tree" size={25} color={colors.accent} />
            <Text style={styles.giftNum}>500</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.giftTxt}>Treasure</Text>
          <View>
            <Icon name="palm-tree" size={25} color={colors.accent} />
            <Text style={styles.giftNum}>500</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.giftTxt}>Treasure</Text>
          <View>
            <Icon name="palm-tree" size={25} color={colors.accent} />
            <Text style={styles.giftNum}>500</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.giftTxt}>Treasure</Text>
          <View>
            <Icon name="palm-tree" size={25} color={colors.accent} />
            <Text style={styles.giftNum}>500</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.giftTxt}>Treasure</Text>
          <View>
            <Icon name="palm-tree" size={25} color={colors.accent} />
            <Text style={styles.giftNum}>500</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 20,
          backgroundColor: '#1D1F31',
          borderTopColor: '#494759',
          paddingVertical: 30,
          borderTopWidth: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '99%',
        }}>
        <View
          style={{
            flexDirection: 'row',
            marginLeft: 20,
            width: '60%',
            alignItems: 'center',
          }}>
          <TextInput
            style={{
              width: '80%',
              backgroundColor: '#292b3c',
              color: colors.complimentary,
              padding: 10,
              borderRadius: 10,
            }}
            placeholder="122"
            value="1222"
          />
          <TouchableOpacity
            style={{
              height: 30,
              width: 30,
              borderRadius: 15,
              backgroundColor: colors.primary_gradient,
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: 10,
            }}>
            <Icon name="plus" size={25} color={colors.complimentary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={{
            paddingHorizontal: 10,

            paddingVertical: 5,
            backgroundColor: '#494759',
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={[appStyles.bodyMd, {color: colors.complimentary}]}>
            Send
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  giftTxt: {
    ...appStyles.smallTxt,
    color: colors.complimentary,
  },
  giftNum: {
    ...appStyles.bodyMd,
    color: colors.complimentary,
  },
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
});
