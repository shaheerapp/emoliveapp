import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import React from 'react';
import envVar from '../../../../../config/envVar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../../../../styles/colors';
import {setSelectedGuest} from '../../../../../store/slice/usersSlice';
import liveStyles from '../styles/liveStyles';
import appStyles from '../../../../../styles/styles';

interface PodcastGuest {
  item: any;
  token: string;
  dispatch: any;
  handleOpenSheet2: any;
  muteUnmuteUser: any;
  user: any;
}

export default function PodcastGuest({
  item,
  token,
  dispatch,
  handleOpenSheet2,
  muteUnmuteUser,
  user,
}: PodcastGuest) {
  return (
    <TouchableOpacity
      style={{
        alignItems: 'center',
      }}
      onPress={() => {
        dispatch(setSelectedGuest(item));
        handleOpenSheet2();
      }}>
      <Image
        source={
          item.user.avatar
            ? {
                uri: envVar.API_URL + 'display-avatar/' + item.user.id,
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            : require('../../../../../assets/images/place.jpg')
        }
        style={styles.chatAvatar}
      />
      <Text
        style={[
          appStyles.bodyMd,
          {color: colors.complimentary, textAlign: 'center'},
        ]}>
        {item.user.first_name + ' ' + item.user.last_name}
      </Text>
      <View style={styles.points}>
        <Icon name="star-four-points" size={15} color={colors.dominant} />
        <Text style={[appStyles.small, {color: colors.dominant}]}>3754</Text>
      </View>
      {item.user.id == user.id}
      <TouchableOpacity
        onPress={() => muteUnmuteUser(item)}
        style={{
          position: 'absolute',
          right: 10,
        }}>
        <Icon
          name={item.muted ? 'microphone-off' : 'microphone'}
          size={25}
          color={colors.complimentary}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  ...liveStyles,
});
