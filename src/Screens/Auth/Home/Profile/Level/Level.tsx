import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../../../../styles/colors';
const deviceHeight = Dimensions.get('window').height;
import appStyles from '../../../../../styles/styles';
import {ScrollView} from 'react-native-gesture-handler';
export default function Level({navigation}) {
  return (
    <View style={styles.container}>
      <View style={{marginTop: 70, flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <IconM name="chevron-left" size={25} color={colors.complimentary} />
        </TouchableOpacity>
        <View style={{width: '85%'}}>
          <Text
            style={[
              appStyles.headline,
              {color: colors.complimentary, textAlign: 'center'},
            ]}>
            Level
          </Text>
        </View>
      </View>
      <View
        style={{
          marginTop: 30,
          paddingBottom: 40,
          height: deviceHeight * 0.82,
        }}>
        <ScrollView>
          <TopLevel first={true} />
          <TopLevel />
          <TopLevel />
          <SecondLevel />
          <SecondLevel />
          <SecondLevel />
          <SecondLevel />
          <SecondLevel />
          <SecondLevel />
          <SecondLevel />
          <SecondLevel />
          <ThirdLevel />
          <ThirdLevel />
          <ThirdLevel />
          <ThirdLevel />
          <ThirdLevel />
          <ThirdLevel />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.LG,
    padding: 10,
  },
  level: {
    // marginTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: colors.complimentary,
    // borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  levelDesc: {
    width: 50,
    flexDirection: 'row',
    backgroundColor: '#f47e09',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    paddingVertical: 5,
    paddingLeft: 2,
  },
  itemsCount: {
    width: '30%',
    alignItems: 'flex-end',
  },
  icon: {
    backgroundColor: '#d83c04',
    width: 18,
    height: 18,
    justifyContent: 'center',
    borderRadius: 10,
    alignItems: 'center',
  },
  count: {
    color: '#fff8e6',
    ...appStyles.bodyMd,
    marginLeft: 2,
  },
  text: {
    ...appStyles.bodyRg,
    color: colors.complimentary,
  },
});

const TopLevel = ({first = false}) => {
  return (
    <View style={[styles.level, first && {borderTopWidth: 1}]}>
      <View
        style={{
          width: '28%',
        }}>
        <View style={styles.levelDesc}>
          <View style={styles.icon}>
            <IconM name="flower-poppy" color="#fff8e6" size={12} />
          </View>
          <Text style={styles.count}>28</Text>
        </View>
      </View>
      <View style={{width: '40%', alignItems: 'center'}}>
        <Text style={styles.text}>Level 28</Text>
      </View>
      <View style={styles.itemsCount}>
        <Text style={styles.text}>50500000000</Text>
      </View>
    </View>
  );
};
const SecondLevel = () => {
  return (
    <View style={styles.level}>
      <View
        style={{
          width: '28%',
        }}>
        <View style={[styles.levelDesc, {backgroundColor: '#f765af'}]}>
          <View style={[styles.icon, {backgroundColor: '#f765af'}]}>
            <IconM name="flower-poppy" color={colors.complimentary} size={12} />
          </View>
          <Text style={styles.count}>28</Text>
        </View>
      </View>
      <View style={{width: '40%', alignItems: 'center'}}>
        <Text style={styles.text}>Level 33</Text>
      </View>
      <View style={styles.itemsCount}>
        <Text style={styles.text}>22500000000</Text>
      </View>
    </View>
  );
};
const ThirdLevel = () => {
  return (
    <View style={styles.level}>
      <View
        style={{
          width: '28%',
        }}>
        <View style={[styles.levelDesc, {backgroundColor: '#b716d0'}]}>
          <View style={[styles.icon, {backgroundColor: '#b716d0'}]}>
            <IconM name="flower-poppy" color="#fff8e6" size={12} />
          </View>
          <Text style={styles.count}>28</Text>
        </View>
      </View>
      <View style={{width: '40%', alignItems: 'center'}}>
        <Text style={styles.text}>Level 44</Text>
      </View>
      <View style={styles.itemsCount}>
        <Text style={styles.text}>50500000000</Text>
      </View>
    </View>
  );
};
