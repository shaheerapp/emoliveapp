import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  StyleSheet,
  Image,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import appStyles from '../../../../../styles/styles';
import {colors} from '../../../../../styles/colors';
import axiosInstance from '../../../../../Api/axiosConfig';
import {useDispatch, useSelector} from 'react-redux';
import {setLoading} from '../../../../../store/slice/usersSlice';

export default function Ranking({navigation}) {
  const dispatch = useDispatch();
  const {users, loading} = useSelector((state: any) => state.users);
  const [data, setData] = useState({
    data: [],
    type: 'diamonds',
    displayData: [],
  });

  const getStats = async () => {
    try {
      dispatch(setLoading(false));
      const res = await axiosInstance.get('users/ranking');
      setData(prev => ({...prev, data: res.data.data}));
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoading(false));
    }
  };
  const updatedDisplay = (type: string) => {
    setData(prev => ({...prev, type, displayData: data[type]}));
  };
  return (
    <View style={styles.container}>
      <View style={[styles.backBtn]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.title}>
          <Icon name="arrow-left-thin" color="#fff" size={25} />
          <Text style={styles.heading}>Global Ranking</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          onPress={() => updatedDisplay('diamonds')}
          style={[
            styles.tab,
            data.type == 'diamonds' && {borderBottomWidth: 2},
          ]}>
          <Text
            style={[
              styles.tabText,
              data.type == 'diamonds' && {color: '#fff'},
            ]}>
            Diamonds 💎
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => updatedDisplay('beans')}
          style={[styles.tab, data.type == 'beans' && {borderBottomWidth: 2}]}>
          <Text
            style={[styles.tabText, data.type == 'beans' && {color: '#fff'}]}>
            Beans 🫘
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{marginTop: 20}}>
        <View style={styles.userSection}>
          <TouchableOpacity
            onPress={() => navigation.navigate('UserProfile')}
            style={styles.profile}>
            <Image
              style={{width: 50, height: 50, borderRadius: 25}}
              source={require('../../../../../assets/images/live/girl1.jpg')}
            />
            <View style={{marginLeft: 20}}>
              <Text style={styles.userText}>Ava Marie</Text>
              <Text style={styles.userDesc}>ID: 234</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.followBtn}>
            <Icon
              style={{marginLeft: 5}}
              name="medal"
              color="#b97d54"
              size={25}
            />
          </View>
        </View>
        <View style={styles.userSection}>
          <TouchableOpacity
            onPress={() => navigation.navigate('UserProfile')}
            style={styles.profile}>
            <Image
              style={{width: 50, height: 50, borderRadius: 25}}
              source={require('../../../../../assets/images/live/girl2.jpg')}
            />
            <View style={{marginLeft: 20}}>
              <Text style={styles.userText}>Ava Marie</Text>
              <Text style={styles.userDesc}>ID: 235</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.followBtn}>
            <Icon
              style={{marginLeft: 5}}
              name="medal"
              color="#eac65d"
              size={25}
            />
          </View>
        </View>
        <View style={styles.userSection}>
          <TouchableOpacity
            onPress={() => navigation.navigate('UserProfile')}
            style={styles.profile}>
            <Image
              style={{width: 50, height: 50, borderRadius: 25}}
              source={require('../../../../../assets/images/live/girl3.jpg')}
            />
            <View style={{marginLeft: 20}}>
              <Text style={styles.userText}>Ava Marie</Text>
              <Text style={styles.userDesc}>ID: 236</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.followBtn}>
            <Icon
              style={{marginLeft: 5}}
              name="medal"
              color="#eac65d"
              size={25}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.userSection}>
          <TouchableOpacity
            onPress={() => navigation.navigate('UserProfile')}
            style={styles.profile}>
            <Image
              style={{width: 50, height: 50, borderRadius: 25}}
              source={require('../../../../../assets/images/live/girl6.jpg')}
            />
            <View style={{marginLeft: 20}}>
              <Text style={styles.userText}>Ava Marie</Text>
              <Text style={styles.userDesc}>ID: 237</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.followBtn}>
            {/* <Text style={styles.btnText}>Following</Text> */}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d1f31',
    padding: 10,
  },
  backBtn: {
    marginTop: Platform.OS == 'ios' ? 20 : 5,
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    padding: 16,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  tabs: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  image: {
    flex: 1,
    // display: 'flex',
    // justifyContent: 'space-around',
  },
  heading: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '600',
    color: '#fff',
  },
  userSection: {
    marginTop: 20,
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
  },
  profile: {
    flexDirection: 'row',
  },
  tab: {
    flexDirection: 'row',
    width: '50%',
    paddingBottom: 10,
    borderBottomColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    color: '#868791',
    fontSize: 18,
    fontWeight: '600',
  },

  userText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 20,
  },
  userDesc: {
    color: '#fff',
    marginTop: 5,
    fontWeight: '500',
    fontSize: 16,
  },
  followBtn: {
    height: 40,
    width: 90,
    alignItems: 'center',
    justifyContent: 'center',
    // paddingVertical: 5,
    borderRadius: 6,
  },
  btnText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
