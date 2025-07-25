import {View, Text, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {liveStyles} from './streamingImport';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../../../../styles/colors';
import appStyles from '../../../../../styles/styles';

export default function StreamStatus() {
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
      <View
        style={{
          flexDirection: 'row',
          width: '30%',
          justifyContent: 'flex-end',
        }}>
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
            +25
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
