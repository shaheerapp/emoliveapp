import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../../../../../Api/axiosConfig';
import {
  setChatUser,
  updateUsers,
} from '../../../../../store/slice/usersSlice';
import IconM from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import liveStyles from '../styles/liveStyles';
import appStyles from '../../../../../styles/styles';
import { colors } from '../../../../../styles/colors';
import { formatNumber } from '../../../../../utils/generalScript';

interface AvatarSheetProps {
  navigation: any;
  token: string;
  envVar: any;
  kickUserFromPodcast: any;
  userId: any;
  isHost: any;
}

export default function AvatarSheet({
  navigation,
  token,
  envVar,
  kickUserFromPodcast,
  userId,
  isHost,
}: AvatarSheetProps) {
  const dispatch = useDispatch();
  const { selectedGuest } = useSelector((state: any) => state.users);

  useEffect(() => {
    console.log('Selected Guest: ', selectedGuest);
  }, []);

  const followUser = async () => {
    try {
      console.log(selectedGuest);
      dispatch(updateUsers(res.data.users));
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <View style={{ position: 'relative', paddingTop: 30 }}>
      <TouchableOpacity style={styles.reportBtn} onPress={followUser}>
        <IconM name="warning" size={25} color={colors.body_text} />
        <Text style={[appStyles.bodyMd, { color: colors.body_text }]}>
          Report
        </Text>
      </TouchableOpacity>
      <View style={{ width: '99%', alignItems: 'center' }}>
        <Image
          style={liveStyles.sheetAvatar}
          source={
            selectedGuest.user.avatar
              ? {
                  uri: `${envVar.API_URL}display-avatar/${selectedGuest.id}`,
                  headers: { Authorization: `Bearer ${token}` },
                }
              : require('../../../../../assets/images/place.jpg')
          }
        />
        <Text
          style={[
            appStyles.paragraph1,
            { color: colors.complimentary, marginTop: 10 },
          ]}
        >
          {selectedGuest.user.first_name + ' ' + selectedGuest.user.last_name}
        </Text>
        <View style={liveStyles.sheetUser}>
          <Text
            style={[appStyles.regularTxtMd, { color: colors.complimentary }]}
          >
            ID: {selectedGuest.user.id}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="google-maps" size={23} color={colors.semantic} />
            <Text
              style={[appStyles.regularTxtMd, { color: colors.complimentary }]}
            >
              {selectedGuest.user.address
                ? selectedGuest.user.address
                : 'Please Provide '}
            </Text>
          </View>
        </View>

        <View style={liveStyles.sheetStatus}>
          <View>
            <Text
              style={[appStyles.headline2, { color: colors.complimentary }]}
            >
              {selectedGuest.user.followers || 0}
            </Text>
            <Text
              style={[
                appStyles.bodyMd,
                { color: colors.body_text, marginTop: 5 },
              ]}
            >
              Fans
            </Text>
          </View>
          <View>
            <Text
              style={[appStyles.headline2, { color: colors.complimentary }]}
            >
              {formatNumber(selectedGuest.user.total_gifts_sending)}
            </Text>
            <Text
              style={[
                appStyles.bodyMd,
                { color: colors.body_text, marginTop: 5 },
              ]}
            >
              Sending
            </Text>
          </View>
          <View>
            <Text
              style={[appStyles.headline2, { color: colors.complimentary }]}
            >
              {formatNumber(selectedGuest.user.total_gifts_received)}
            </Text>
            <Text
              style={[
                appStyles.bodyMd,
                { color: colors.body_text, marginTop: 5 },
              ]}
            >
              Received
            </Text>
          </View>
        </View>
      </View>
      <View style={liveStyles.sheetAction}>
        <TouchableOpacity
          style={[liveStyles.followBtn, { borderWidth: 1 }]}
          onPress={() => {
            dispatch(setChatUser(selectedGuest));
            navigation.navigate('Chat');
          }}
        >
          <Text style={[appStyles.bodyMd, { color: colors.complimentary }]}>
            Chat
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[liveStyles.followBtn, { backgroundColor: colors.accent }]}
        >
          <Text style={[appStyles.bodyMd, { color: colors.complimentary }]}>
            Follow
          </Text>
        </TouchableOpacity>
      </View>
      <View style={liveStyles.sheetAction}>
        {(isHost || selectedGuest.user?.id === userId) && (
          <TouchableOpacity
            style={[
              liveStyles.followBtn,
              { backgroundColor: colors.dark_gradient },
            ]}
            onPress={() => kickUserFromPodcast(selectedGuest.user)}
          >
            <Text style={[appStyles.bodyMd, { color: colors.complimentary }]}>
              {isHost ? 'Kick User' : 'Leave Podcast'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// If you still need additional styles, define them here.
const styles = StyleSheet.create({
  reportBtn: {
    position: 'absolute',
    left: 15,
    top: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.semantic,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
});
