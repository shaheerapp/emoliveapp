import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import envVar from '../../../../../config/envVar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../../../../styles/colors';
import { setSelectedGuest } from '../../../../../store/slice/usersSlice';
import liveStyles from '../styles/liveStyles';
import appStyles from '../../../../../styles/styles';
import LottieView from 'lottie-react-native';
import { formatNumber } from '../../../../../utils/generalScript';

interface PodcastGuest {
  item: any;
  token: string;
  dispatch: any;
  handleOpenSheet2: any;
  muteUnmuteUser: any;
  user: any;
  activeEmojis: any;
  podcast: any;
}

export default function PodcastGuest({
  item,
  token,
  dispatch,
  handleOpenSheet2,
  muteUnmuteUser,
  user,
  activeEmojis,
  podcast,
}: PodcastGuest) {
  const userId = item.user?.id;
  const emoji = activeEmojis[userId]?.emoji;

  return (
    <TouchableOpacity
      style={{
        alignItems: 'center',
      }}
      onPress={() => {
        dispatch(setSelectedGuest(item));
        handleOpenSheet2();
      }}
    >
      <View
        style={{
          width: 60,
          height: 60,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {item?.user.active_frame && (
          <LottieView
            source={{
              uri: envVar.IMAGES_URL + item?.user.active_frame.image,
            }} // update path if needed
            autoPlay
            loop
            style={styles.lottieFrame}
          />
        )}
        <Image
          source={
            emoji
              ? { uri: emoji }
              : item?.user.avatar
              ? {
                  uri: envVar.API_URL + 'display-avatar/' + item?.user.id,
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              : require('../../../../../assets/images/place.jpg')
          }
          style={styles.avatar}
        />
      </View>

      <Text
        style={[
          appStyles.bodyMd,
          { color: colors.complimentary, textAlign: 'center' },
        ]}
      >
        {item?.user.first_name + ' ' + item?.user.last_name}
      </Text>
      <View style={styles.points}>
        <Icon name="star-four-points" size={15} color={colors.dominant} />
        <Text style={[appStyles.small, { color: colors.dominant }]}>
          {formatNumber(item.coins)}
        </Text>
      </View>
      {item?.user.id === user.id || user.id === podcast}
      <TouchableOpacity
        onPress={() => muteUnmuteUser(item, false)}
        style={{
          position: 'absolute',
          right: -10,
        }}
      >
        <Icon
          name={item?.muted ? 'microphone-off' : 'microphone'}
          size={25}
          color={colors.complimentary}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  ...liveStyles,
  lottieFrame: {
    position: 'absolute',
    width: 70,
    height: 70,
    top: -5,
    left: -5,
    zIndex: 9,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    zIndex: 1,
  },
});
