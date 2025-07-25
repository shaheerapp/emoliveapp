import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import appStyles from '../../../../../styles/styles';
import {liveStyles} from './podcastImport';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../../../../styles/colors';
export default function PodcastStatus() {
  return (
    <View style={[liveStyles.liveStates]}>
      <View style={{flexDirection: 'row', width: 50, alignItems: 'center'}}>
        <Icon name="star-four-points" size={20} color="#F0DF00" />
        <Text
          style={[
            appStyles.regularTxtMd,
            {
              marginLeft: 5,
              color: colors.complimentary,
            },
          ]}>
          0
        </Text>
      </View>
      <View style={styles.usersCount}>
        <Image
          style={{height: 20, width: 20, borderRadius: 10}}
          source={require('../../../../../assets/images/male/male.jpeg')}
        />
        <TouchableOpacity>
          <Text
            style={[
              appStyles.regularTxtMd,
              {
                color: colors.complimentary,
                marginLeft: 5,
              },
            ]}>
            +2
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  usersCount: {
    flexDirection: 'row',
    width: '30%',
    justifyContent: 'flex-end',
  },
});
