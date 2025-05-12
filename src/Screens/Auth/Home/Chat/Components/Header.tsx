import {View, Text, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {chatStyles} from '../styles/chat';
import {colors} from '../../../../../styles/colors';
import {useSelector} from 'react-redux';
import {envVar} from '../../Tabs/Podcast/podcastImport';

interface HeaderProps {
  navigation: any;
  token: string;
  connected: boolean;
  logout: any;
}

export default function Header({
  navigation,
  token,
  connected,
  logout,
}: HeaderProps) {
  const {chatUser} = useSelector((state: any) => state.users);

  return (
    <View style={chatStyles.chatHeader}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left-thin" size={25} color={colors.complimentary} />
        </TouchableOpacity>
        <View style={{flexDirection: 'row', marginLeft: 10}}>
          <Image
            style={{width: 43, height: 43, borderRadius: 25}}
            source={
              chatUser.avatar
                ? {
                    uri: envVar.API_URL + 'display-avatar/' + chatUser.id,
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                : require('../../../../../assets/images/place.jpg')
            }
          />
          <View style={{marginLeft: 10}}>
            <Text style={chatStyles.user}>
              {chatUser.first_name + ' ' + chatUser.last_name}
            </Text>
            <Text
              style={chatStyles.userStatus}
              onPress={() => navigation.navigate('Chat2')}>
              offline
            </Text>
          </View>
        </View>
      </View>

      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={() => {
            logout();
            // console.log(list);
          }}>
          <Icon
            name="trash-can-outline"
            size={25}
            color={colors.complimentary}
          />
        </TouchableOpacity>
        <TouchableOpacity style={{marginLeft: 10}}>
          <Icon
            name="information-outline"
            size={25}
            color={connected ? colors.complimentary : colors.accent}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
