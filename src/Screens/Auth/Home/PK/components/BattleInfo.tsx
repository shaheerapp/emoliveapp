import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import appStyles from '../../../../../styles/styles';
import {colors} from '../../../../../styles/colors';

export default function BattleInfo() {
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}>
        <View style={{flexDirection: 'row'}}>
          <Icon name="axe-battle" size={12} color={'#FDC506'} />
          <Text style={styles.info}>LIVE Match</Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Icon name="fire" size={12} color={'#FDC506'} />
          <Text style={styles.info}>Weekly Ranking</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon
            name="microsoft-internet-explorer"
            color={'#FF64DF'}
            size={12}
          />
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.info}>Explore</Text>
            <Icon name="chevron-right" size={12} color={colors.complimentary} />
          </View>
        </View>
      </View>
      <View style={{flexDirection: 'row', borderRadius: 6}}>
        <View style={{backgroundColor: '#2c0619', width: '50%'}}>
          {/* < */}
          <View
            style={{
              borderBottomWidth: 1,
              flexDirection: 'row',
              paddingBottom: 10,
              justifyContent: 'space-between',
            }}>
            <Image
              style={{height: 40, width: 40}}
              source={require('../../../../../assets/images/live/gift-box.png')}
            />
            <View>
              <Text style={{color: '#BA9783', fontSize: 20}}>
                0<Text style={{color: '#fff'}}>/1</Text>
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            width: '50%',
            backgroundColor: '#7F1D17',
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 5,
            borderRadius: 8,
          }}>
          <Text style={styles.heading}>Live Trending is Here!</Text>
          <Image
            style={{height: 40, width: 40}}
            source={require('../../../../../assets/images/live/angel.png')}
          />
          {/* emoji */}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    ...appStyles.regularTxtMd,
    width: '60%',
    color: colors.complimentary,
  },
  info: {
    marginLeft: 5,
    color: colors.complimentary,
    ...appStyles.bodyMd,
  },
});
