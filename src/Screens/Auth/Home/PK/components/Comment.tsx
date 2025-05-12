import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import {colors} from '../../../../../styles/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import appStyles from '../../../../../styles/styles';

export default function Comment() {
  return (
    <View>
      {/* <Text>Comment</Text>
       */}
      <View style={{marginTop: 10, padding: 4}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={styles.avatar}>
            <Icon name="heart-outline" size={15} color={colors.complimentary} />
          </View>
          <View style={styles.accountFirst}>
            <Icon name="diamond" size={12} color={colors.complimentary} />
            <Text style={{color: colors.complimentary}}>24</Text>
          </View>
          <View style={styles.accountSecond}>
            <Icon name="heart" size={12} color={'#FFAA5B'} />
            <Text style={{color: colors.complimentary}}>||</Text>
          </View>
          <Text style={styles.comments}>
            <Text style={styles.commentsName}>Erickson Villiola</Text> No roses
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 10,
          }}>
          <View style={styles.avatar}>
            <Image
              style={{height: '100%', width: '100%', borderRadius: 20}}
              source={require('../../../../../assets/images/live/girl3.jpg')}
            />
            {/* <Icon
                  name="heart-outline"
                  size={15}
                  color={colors.complimentary}
                /> */}
          </View>
          <View style={styles.accountFirst}>
            <Icon name="diamond" size={12} color={colors.complimentary} />
            <Text style={{color: colors.complimentary}}>24</Text>
          </View>
          <View style={styles.accountSecond}>
            <Icon name="heart" size={12} color={'#FFAA5B'} />
            <Text style={{color: colors.complimentary}}>||</Text>
          </View>
          <Text style={styles.comments}>
            <Text style={styles.commentsName}>shinzpu wp sasageuo</Text> reached
          </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={styles.avatar}>
            <Icon name="heart-outline" size={12} color={colors.complimentary} />
          </View>
          <View style={styles.accountFirst}>
            <Icon name="diamond" size={12} color={colors.complimentary} />
            <Text style={{color: colors.complimentary}}>24</Text>
          </View>
          <View style={styles.accountSecond}>
            <Icon name="heart" size={12} color={'#FFAA5B'} />
            <Text style={{color: colors.complimentary}}>||</Text>
          </View>
          <Text style={{color: '#fff', marginLeft: 5}}>
            <Text style={styles.commentsName}>Mama Bear & CO.</Text> Like the
            LIVE
          </Text>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  accountFirst: {
    marginLeft: 10,
    backgroundColor: '#4454CF',
    flexDirection: 'row',
    paddingHorizontal: 8,
    alignItems: 'center',
    borderRadius: 4,
    justifyContent: 'center',
  },
  comments: {
    ...appStyles.bodyMd,
    color: colors.complimentary,
    marginLeft: 10,
  },
  accountSecond: {
    backgroundColor: '#A64B36',
    marginLeft: 5,
    paddingHorizontal: 10,
    // textAlign: 'center',
    flexDirection: 'row',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    backgroundColor: '#564558',
    width: 30,
    height: 30,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentsName: {
    color: '#8d819f',
  },
});
