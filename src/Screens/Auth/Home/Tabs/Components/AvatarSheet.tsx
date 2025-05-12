import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import axiosInstance from '../../../../../Api/axiosConfig';
import {setChatUser, updateUsers} from '../../../../../store/slice/usersSlice';
import IconM from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import liveStyles from '../styles/liveStyles';
import appStyles from '../../../../../styles/styles';
import {colors} from '../../../../../styles/colors';

interface AvatarSheetProps {
  navigation: any;
  token: string;
  envVar: any;
}

export default function AvatarSheet({
  navigation,
  token,
  envVar,
}: AvatarSheetProps) {
  const dispatch = useDispatch();
  const {selectedGuest} = useSelector((state: any) => state.users);

  const followUser = async () => {
    try {
      console.log(selectedGuest);
      return;
      const url = item.is_followed
        ? `/user/un-follow-user/${item.id}`
        : `/user/follow-user/${item.id}`;
      const res = await axiosInstance.get(url);
      dispatch(updateUsers(res.data.users));
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <View style={{position: 'relative', paddingTop: 30}}>
      <TouchableOpacity style={styles.reportBtn} onPress={followUser}>
        <IconM name="warning" size={25} color={colors.body_text} />
        <Text style={[appStyles.bodyMd, {color: colors.body_text}]}>
          Report
        </Text>
      </TouchableOpacity>
      <View style={{width: '99%', alignItems: 'center'}}>
        <Image
          style={liveStyles.sheetAvatar}
          source={
            selectedGuest.avatar
              ? {
                  uri: `${envVar.API_URL}display-avatar/${selectedGuest.id}`,
                  headers: {Authorization: `Bearer ${token}`},
                }
              : require('../../../../../assets/images/place.jpg')
          }
        />
        <Text
          style={[
            appStyles.paragraph1,
            {color: colors.complimentary, marginTop: 10},
          ]}>
          {selectedGuest.first_name + ' ' + selectedGuest.last_name}
        </Text>
        <View style={liveStyles.sheetUser}>
          <Text style={[appStyles.regularTxtMd, {color: colors.complimentary}]}>
            ID: {selectedGuest.id}
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon name="google-maps" size={23} color={colors.semantic} />
            <Text
              style={[appStyles.regularTxtMd, {color: colors.complimentary}]}>
              {selectedGuest.address
                ? selectedGuest.address
                : 'Please Provide '}
            </Text>
          </View>
        </View>

        <View style={liveStyles.sheetStatus}>
          <View>
            <Text style={[appStyles.headline2, {color: colors.complimentary}]}>
              1.54k
            </Text>
            <Text
              style={[
                appStyles.bodyMd,
                {color: colors.body_text, marginTop: 5},
              ]}>
              Fans
            </Text>
          </View>
          <View>
            <Text style={[appStyles.headline2, {color: colors.complimentary}]}>
              19.4k
            </Text>
            <Text
              style={[
                appStyles.bodyMd,
                {color: colors.body_text, marginTop: 5},
              ]}>
              Sending
            </Text>
          </View>
          <View>
            <Text style={[appStyles.headline2, {color: colors.complimentary}]}>
              205.7k
            </Text>
            <Text
              style={[
                appStyles.bodyMd,
                {color: colors.body_text, marginTop: 5},
              ]}>
              Beans
            </Text>
          </View>
        </View>
      </View>
      <View style={liveStyles.sheetAction}>
        <TouchableOpacity
          style={[liveStyles.followBtn, {backgroundColor: colors.accent}]}>
          <Text style={[appStyles.bodyMd, {color: colors.complimentary}]}>
            Follow
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[liveStyles.followBtn, {borderWidth: 1}]}
          onPress={() => {
            dispatch(setChatUser(selectedGuest));
            navigation.navigate('Chat');
          }}>
          <Text style={[appStyles.bodyMd, {color: colors.complimentary}]}>
            Chat
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// If you still need additional styles, define them here.
const styles = StyleSheet.create({
  reportBtn: {
    position: 'absolute',
    right: 15,
    top: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.semantic,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
});
