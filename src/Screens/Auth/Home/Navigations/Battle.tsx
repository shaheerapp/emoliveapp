import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  TextInput,
  Platform,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import appStyles from '../../../../styles/styles';
import {colors} from '../../../../styles/colors';
import {useSelector, useDispatch} from 'react-redux';

import axiosInstance from '../../../../Api/axiosConfig';
import {getBattles} from '../../../../store/slice/PK/battleAsync';
import {
  setLoading,
  getUsers,
  setError,
} from '../../../../store/slice/usersSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  setBattle,
  updateBattleHosts,
} from '../../../../store/slice/PK/battleSlice';
import {useAppContext} from '../../../../Context/AppContext';
// import axiosIn

interface Battle {
  navigation: any;
}
export default function Battle({navigation}: Battle) {
  const {userAuthInfo} = useAppContext();
  const {setUser} = userAuthInfo;
  const {users, loading, error} = useSelector((state: any) => state.users);
  const {battles} = useSelector((state: any) => state.battle);
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    user2_id: '',
    duration: '',
    user2: '',
  });

  useEffect(() => {
    // dispatch(getBattles());
  }, []);

  const test = () => {
    console.log('Ss');
    dispatch(updateBattleHosts(2));
    dispatch(setBattle(''));
    navigation.navigate('LiveBattle');
  };

  const startPKBattle = async () => {
    try {
      if (!form.duration.length || !form.user2_id) {
        Alert.alert('Error', 'Please fill form data');
        return;
      }
      dispatch(setLoading(true));
      setModal(false);
      const data = {
        user2_id: form.user2_id,
      };
      const res = await axiosInstance.post('battle/start', data);
      dispatch(setBattle(res.data.battle));
      setUser(res.data.user);
      dispatch(updateBattleHosts(2));
      navigation.navigate('LiveBattle');
    } catch (error) {
      dispatch(setError('Some Error occurred'));
      console.log(error);
    } finally {
      dispatch(setLoading(false));
    }
  };
  const joinPKBattle = async (item: any) => {
    try {
      dispatch(setLoading(true));
      const data = {
        channel: item.channel,
        id: item.id,
      };
      // dispatch

      const res = await axiosInstance.post('battle/join', data);
      setUser(res.data.user);
      dispatch(updateBattleHosts(2));
      dispatch(setBattle(item));
      // await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
      navigation.navigate('LiveBattle');
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoading(false));
    }
  };
  const showModal = () => {
    if (!users.length) {
      dispatch(getUsers());
    }
    setModal(true);
  };
  return (
    <View style={styles.container}>
      {loading && !modal && (
        <ActivityIndicator
          animating={loading}
          size={'small'}
          color={colors.complimentary}
        />
      )}
      <TouchableOpacity
        disabled={loading}
        onPress={showModal}
        style={styles.newPK}>
        <Text style={[appStyles.headline2, {color: colors.complimentary}]}>
          Start New Battle
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.refreshBtn}
        onPress={() => {
          // test();
          dispatch(getBattles());
        }}>
        <Icon name="refresh" color={colors.complimentary} size={20} />
      </TouchableOpacity>
      <FlatList
        data={battles}
        keyExtractor={item => item.id?.toString}
        numColumns={2}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.PodcastUser}
            onPress={() => joinPKBattle(item)}>
            <View
              style={{
                width: '100%',
                height: 140,
              }}>
              <View style={{flexDirection: 'row'}}>
                <Image
                  style={styles.userImage}
                  source={require('../../../../assets/images/male/male.jpeg')}
                />
                <Image
                  style={styles.userImage}
                  source={require('../../../../assets/images/live/girl3.jpg')}
                />
              </View>
              <TouchableOpacity style={styles.waveform}>
                <Icon name="waveform" color={colors.complimentary} size={30} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.userStats}>
                <Icon name="diamond" color={colors.complimentary} size={20} />
                <Text style={styles.userFollower}>10.51K</Text>
              </TouchableOpacity>
              <Text style={styles.userTxt}>
                {item.id}
                {/* {item.user.first_name + ' ' + item.user.last_name} */}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <StartPK
        modal={modal}
        setForm={setForm}
        setModal={setModal}
        form={form}
        users={users}
        startPKBattle={startPKBattle}
        loading={loading}
        error={error}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Custom RGBA backdrop color
    justifyContent: 'center',
    alignItems: 'center',
    // alignSelf: 'center',
  },
  deleteButton: {
    backgroundColor: colors.accent,
    padding: 16,
    borderRadius: 12,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  deleteText: {
    color: colors.offwhite,
    ...appStyles.paragraph1,
  },
  newPK: {
    width: '50%',
    marginVertical: 20,
    backgroundColor: colors.accent,
    borderRadius: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  cancelButton: {
    padding: 16,
    marginTop: 5,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.accent,
  },
  modalView: {
    // width: 300,
    padding: 20,
    backgroundColor: colors.LG,
    alignSelf: 'center',
    width: '90%',
    // minWidth
    // alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderRadius: 26,
  },
  refreshBtn: {
    // top: Platform.OS == 'ios' ? 80 : 20,
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: colors.accent,
    width: 35,
    height: 35,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  PodcastUser: {
    position: 'relative',
    backgroundColor: 'red',
    marginHorizontal: '2.5%', // Add horizontal margin for spacing
    width: '45%',
    borderRadius: 5,
    marginVertical: 10,
  },
  userStats: {
    top: 10,
    position: 'absolute',
    flexDirection: 'row',
    right: 10,
    backgroundColor: colors.LG,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: 90,
    borderRadius: 15,
  },
  userImage: {
    // position: 'relative',
    width: '50%',
    height: 140,
    borderWidth: 2,
    borderColor: '#fff',
    // height: '100%',
    borderRadius: 6,
  },
  userFollower: {
    color: colors.complimentary,
    marginLeft: 5,
    ...appStyles.bodyRg,
  },
  userTxt: {
    position: 'absolute',
    bottom: 10,
    marginLeft: 10,
    ...appStyles.regularTxtRg,
    color: colors.complimentary,
  },
  waveform: {
    top: 10,
    left: 5,
    position: 'absolute',
    backgroundColor: colors.LG,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    borderRadius: 25,
  },
  label: {
    ...appStyles.paragraph1,
    color: colors.complimentary,
    marginTop: 10,
  },
  inputBox: {
    marginTop: 5,
    borderColor: colors.complimentary,
    borderWidth: 1,
    // width: '100%',
    color: colors.complimentary,
    padding: 12,
    borderRadius: 4,
  },
});

interface StartPk {
  modal: boolean;
  setModal: any;
  form: any;
  setForm: any;
  users: any;
  startPKBattle: any;
  loading: boolean;
  error: string | null;
}
const StartPK = ({
  modal,
  setModal,
  form,
  setForm,
  users,
  startPKBattle,
  error,
  loading,
}: StartPk) => {
  return (
    <View>
      <Modal
        visible={modal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModal(false)}>
        {/* Backdrop */}
        <View style={styles.backdrop}>
          {/* Modal Content */}

          <View style={styles.modalView}>
            <Text
              style={[
                appStyles.title1,
                {color: colors.complimentary, textAlign: 'center'},
              ]}>
              Start Battle With : {form.user2?.first_name}
            </Text>
            <View style={{marginVertical: 10}}>
              {error && (
                <View>
                  <Text style={[appStyles.errorText]}>Some Error occured</Text>
                </View>
              )}

              <View>
                <Text style={styles.label}>Other:</Text>
                {loading || !users.length ? (
                  <ActivityIndicator
                    animating={loading}
                    size={'small'}
                    color={colors.complimentary}
                  />
                ) : (
                  <View
                    style={{
                      marginTop: 10,
                      height: Dimensions.get('window').height * 0.2,
                    }}>
                    <FlatList
                      data={users}
                      contentContainerStyle={{paddingBottom: 20}}
                      keyExtractor={(item: any) => item.id?.toString()}
                      renderItem={({item}) => (
                        <TouchableOpacity
                          onPress={() =>
                            setForm((prev: any) => ({
                              ...prev,
                              user2: item,
                              user2_id: item.id,
                            }))
                          }
                          style={{
                            backgroundColor: colors.complimentary,
                            padding: 10,
                            marginVertical: 5,
                            borderRadius: 10,
                          }}>
                          <Text>{item.first_name + ' ' + item.last_name}</Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                )}

                <View style={{marginVertical: 10}}>
                  <Text style={styles.label}>Duration:</Text>
                  <TextInput
                    style={styles.inputBox}
                    value={form.duration}
                    autoCapitalize="none"
                    // maxLength={2}
                    maxLength={3}
                    keyboardType="number-pad"
                    onChangeText={(e: any) =>
                      setForm((prevState: any) => ({...prevState, duration: e}))
                    }
                    placeholder="duration in minutes ...."
                    placeholderTextColor={colors.body_text}
                  />
                </View>
              </View>

              <View style={{alignItems: 'center', marginTop: 20}}>
                <TouchableOpacity
                  onPress={startPKBattle}
                  style={[styles.deleteButton]}>
                  <Text style={styles.deleteText}>Start Battle</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setModal(false)}
                  style={styles.cancelButton}>
                  <Text
                    style={[appStyles.paragraph1, {color: colors.unknown2}]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
