import {
  View,
  Text,
  Platform,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useState} from 'react';
import {colors} from '../../../../../styles/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import envVar from '../../../../../config/envVar';
import {formatNumber} from '../../../../../utils/generalScript';

interface PKHeader {
  navigation: any;
  token: string;
  liveEvent: any;
  user: any;
  leavePodcast: any;
}
export default function PKHeader({
  navigation,
  token,
  user,
  liveEvent,
  leavePodcast,
}: PKHeader) {
  const [host, setHost] = useState(
    liveEvent.user1_id == user.id ? user : liveEvent.user1,
  );
  return (
    <View style={styles.header}>
      <View style={styles.avatar}>
        <Image
          source={
            host.avatar
              ? {
                  uri: envVar.API_URL + 'display-avatar/' + host.id,
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              : require('../../../../../assets/images/place.jpg')
          }
          style={{height: 40, width: 40, borderRadius: 20}}
        />
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center', width: '99%'}}>
        <View style={{marginLeft: 10}}>
          <Text style={{color: '#E7DADF'}}>
            {host.first_name + ' ' + user.last_name}
          </Text>
          <View style={styles.stats}>
            <Icon name="heart" color="#B1A6AB" size={12} />
            <Text style={{color: '#B1A6AB', marginLeft: 3}}>37.3k</Text>
            {/* <Text style={{color: '#B1A6AB', marginLeft: 3}}>{formatNumber(host,)}</Text> */}
          </View>
        </View>

        <View style={styles.iconHeart}>
          <Icon name="heart-cog" color="#FFA84F" size={35} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginLeft: 10,
          }}>
          <Image
            style={styles.viewers}
            source={require('../../../../../assets/images/live/girl3.jpg')}
          />
          {/* <Image
            style={styles.viewers}
            source={require('../../../../../assets/images/live/girl7.jpg')}
          /> */}
        </View>
        <View style={styles.count}>
          <Icon name="human-male" color="#AB9EAC" size={20} />
          <Text style={{color: '#AB9EAC'}}>270</Text>
        </View>
        <TouchableOpacity style={{marginLeft: 20}} onPress={leavePodcast}>
          {/* onPress={() => navigation.goBack()}> */}
          <Icon name="close" color="#fff" size={30} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: Platform.OS == 'ios' ? 60 : 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 3,
    padding: 4,
    backgroundColor: '#1C041C',
  },
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7C3CB',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  iconHeart: {
    marginLeft: 10,
    width: 60,
    borderRadius: 20,
    height: 40,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  viewers: {
    height: 40,
    width: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#FBFBD0',
  },
  count: {flexDirection: 'row', alignItems: 'center'},
});
