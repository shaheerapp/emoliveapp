import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  LayoutAnimation,
  FlatList,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import appStyles from '../../../styles/styles';
import {colors} from '../../../styles/colors';
import envVar from '../../../config/envVar';
import axiosInstance from '../../../Api/axiosConfig';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import {setUnreadNotification} from '../../../store/slice/notificationSlice';
import {useAppContext} from '../../../Context/AppContext';
export default function Notifications({navigation}) {
  const dispatch = useDispatch();
  const {tokenMemo} = useAppContext();
  const {token} = tokenMemo;
  const {unreadNotification} = useSelector((state: any) => state.notification);
  console.log(unreadNotification, 'Sss');
  useEffect(() => {}, []);

  const fetchNotifications = async () => {
    try {
      const url = 'notifications';
      const response = await axiosInstance.get(url);
      dispatch(setUnreadNotification(response.data.notifications));
      console.log(response.data.notifications);
    } catch (error) {
      console.error(error);
    }
  };
  const markAsRead = async (id: string | number) => {
    try {
      const url = `notifications/${id}/read`;
      const response = await axiosInstance.get(url);
      console.log(response.data.message);
    } catch (error) {
      console.error(error);
    }
  };
  const markAllAsRead = async (id: string | number) => {
    try {
      const url = `notifications/read-all`;
      const response = await axiosInstance.get(url);
      console.log(response.data.message);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteNotification = async (id: string | number) => {
    try {
      const url = `notifications/${id}`;
      const response = await axiosInstance.delete(url);
      console.log(response.data.message);
    } catch (error) {
      console.error(error);
    }
  };
  const deleteAllNotifications = async (id: string | number) => {
    try {
      const url = `notifications`;
      const response = await axiosInstance.delete(url);
      console.log(response.data.message);
    } catch (error) {
      console.error(error);
    }
  };
  const getUnreadNotifications = async (id: string | number) => {
    try {
      const url = `notifications/unread`;
      const response = await axiosInstance.get(url);
      console.log(response.data.message);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{width: '30%'}}></View>
        <View style={styles.headerRight}>
          <Text style={styles.heading}>Notifications</Text>
          <TouchableOpacity>
            {/* <TouchableOpacity onPress={() => navigation.goBack()}> */}
            <Text style={[appStyles.bodyRg, {color: colors.complimentary}]}>
              Clear
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* body */}
      <Text style={{color: '#fff', marginTop: 30}} onPress={fetchNotifications}>
        get Notifications
      </Text>
      <View style={{marginTop: 20}}>
        <FlatList
          keyExtractor={(item: any) => item.id?.toString()}
          data={unreadNotification}
          renderItem={({item}) => (
            <View style={styles.userSection}>
              <Image
                style={{width: 50, height: 50, borderRadius: 25}}
                source={
                  item.avatar
                    ? {
                        uri: envVar.API_URL + 'display-avatar/' + item.id,
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    : require('../../../assets/images/place.jpg')
                }
                // source={require('../../../assets/images/live/girl1.jpg')}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '83%',
                }}>
                <View style={{marginLeft: 20}}>
                  <Text style={styles.userText}>
                    {item.user.first_name + ' ' + item.user.last_name}
                  </Text>
                  <Text style={styles.userDesc}>{item.message}</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity>
                    <Icon
                      name="email-open-outline"
                      size={25}
                      color={colors.complimentary}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={{marginLeft: 10}}>
                    <Icon
                      name="trash-can"
                      size={25}
                      color={colors.complimentary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      </View>
      {/* <Text>Notifications</Text> */}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d1f31',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Platform.OS == 'ios' ? 60 : 20,
    paddingRight: 20,
  },
  headerRight: {
    width: '70%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heading: {
    ...appStyles.headline,
    color: colors.complimentary,
    textAlign: 'center',
  },
  userSection: {
    marginTop: 20,
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
  },
  userText: {
    ...appStyles.regularTxtMd,
    color: colors.complimentary,
    fontSize: 20,
  },
  userDesc: {
    color: colors.complimentary,
    marginTop: 5,
    ...appStyles.regularTxtRg,
  },
});
