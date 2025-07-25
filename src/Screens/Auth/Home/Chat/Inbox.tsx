import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import appStyles from '../../../../styles/styles';
import {ChatClient, ChatConversationType} from 'react-native-agora-chat';
import {colors} from '../../../../styles/colors';
import envVar from '../../../../config/envVar';
import {resetMessage} from '../../../../store/slice/chatSlice';
import Stranger from '../../../../assets/svg/stranger.svg';
import {UseSelector, useDispatch, useSelector} from 'react-redux';
import {setConnected, setInitialized} from '../../../../store/slice/chatSlice';
import {selectInbox} from '../../../../store/selectors/selectors';
import axiosInstance from '../../../../Api/axiosConfig';
import {setMessages} from '../../../../store/slice/chatSlice';
import {
  setChatUser,
  test,
  resetD,
  fetchUserDetails,
} from '../../../../store/slice/usersSlice';
import {useAppContext} from '../../../../Context/AppContext';
// import {Colors} from 'react-native/Libraries/NewAppScreen';
interface InboxProps {
  navigation: any;
}
export default function Inbox({navigation}: InboxProps) {
  const dispatch = useDispatch();
  const {tokenMemo} = useAppContext();
  const inbox = useSelector(selectInbox);
  const {token} = tokenMemo;
  const {connected} = useSelector((state: any) => state.chat);
  const {userDetails} = useSelector((state: any) => state.users);
  const [error, setError] = useState('');

  const chatClient = ChatClient.getInstance();
  const chatManager = chatClient.chatManager;

  const getLocalConv = async () => {
    try {
      // if (localConvGet) return;
      const local = await chatManager.getAllConversations();
      if (local.length > 0) {
        const ids = local.map((item: any) => item.convId);
        // dispatch(fetchUserDetails(ids));

        // getLastMessages(local);
      }
    } catch (error) {
      console.log('error while getting message from local device');
    }
  };
  const clearConv = async () => {
    try {
      const clear =
        await chatClient.chatManager.deleteAllMessageAndConversation(true);
      console.log(clear);
      dispatch(resetMessage({}));
      dispatch(resetD({}));
    } catch (error) {
      console.log(error);
    }
  };

  const formatTime = timestamp => {
    const date = new Date(timestamp);

    // Get the time components

    // Extract components
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth()).padStart(2, '0');
    const year = String(date.getFullYear()).padStart(2, '0');

    // Create the formatted string
    const formattedTime = `${hours}:${minutes} | ${day}-${month}-${year}`;
    return formattedTime;
  };

  const test = () => {
    let ids = ['1', '2', '3'];
    console.log(ids);
    // console.log(user, keys);
  };
  return (
    <View style={styles.container}>
      <View style={[styles.header]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Icon name="arrow-left-thin" color={colors.complimentary} size={25} />
          <Text style={styles.heading}>Inbox</Text>
        </TouchableOpacity>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() => {
              console.log(userDetails);
            }}>
            {/* onPress={() => navigation.navigate('StrangerMessages')}> */}
            <Stranger width={25} height={25} />
          </TouchableOpacity>
          <TouchableOpacity style={{marginLeft: 10}} onPress={getLocalConv}>
            <Icon name="check-all" color={colors.complimentary} size={25} />
          </TouchableOpacity>
        </View>
      </View>
      {/* <View
        style={{
          marginVertical: 10,
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}> */}
      {/* <Text style={{color: '#fff'}} onPress={clearConv}>
          {' '}
          clear conv
        </Text> */}
      {/* <Text
          style={{color: '#fff'}}
          onPress={() => dispatch(resetMessage({}))}>
          {' '}
          resetMessage
        </Text>
        <Text style={{color: '#fff'}} onPress={() => dispatch(resetD({}))}>
          {' '}
          reset user d
        </Text>
        <Text style={{color: '#fff'}} onPress={() => dispatch(setMessages(mm))}>
          {' '}
          set mmx */}
      {/* </Text> */}
      {/* </View> */}
      {/* <View
        style={{
          marginTop: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text
          style={{color: '#fff'}}
          onPress={() => {
            test();
            // console.log(userDetails);
          }}>
          test user details
        </Text>
        <Text
          style={{color: '#fff'}}
          onPress={() => {
            console.log(userDetails);
            dispatch(fetchUserDetails([1, 2, 3]));
          }}>
          fetch
        </Text>
      </View> */}

      {error && <Text style={[appStyles.errorText]}>{error}</Text>}
      {/* <Text style={{color: '#fff', fontSize: 20}}>
        {JSON.stringify(conversation)}
      </Text> */}
      {/* <Text style={{color: '#fff'}} onPress={mergeData}>
        mergeData
      </Text> */}
      {/* onPress={getAllConversationFromDevice}> */}

      <View style={{marginTop: 40}}>
        <View style={styles.userSection}>
          <TouchableOpacity style={styles.profile} onPress={getLocalConv}>
            <View style={styles.support}>
              <Icon name="headset" color={colors.complimentary} size={25} />
            </View>
            <View style={{marginLeft: 20}}>
              <Text style={styles.userText}>Support Chat</Text>
              <Text style={styles.msgText}>Chat with customer support</Text>
            </View>
          </TouchableOpacity>
        </View>
        <FlatList
          data={inbox}
          contentContainerStyle={{paddingBottom: 50}}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}: any) => (
            <View style={styles.userSection}>
              <TouchableOpacity
                style={styles.profile}
                onPress={() => {
                  dispatch(setChatUser(item.user));
                  navigation.navigate('Chat');
                }}>
                <Image
                  style={{width: 50, height: 50, borderRadius: 25}}
                  loadingIndicatorSource={require('../../../../assets/images/place.jpg')}
                  source={
                    item.user.avatar
                      ? {
                          uri:
                            envVar.API_URL + 'display-avatar/' + item.user.id,
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        }
                      : require('../../../../assets/images/place.jpg')
                  }
                  // source={require('../../../../assets/images/live/girl4.jpg')}
                />
                <View style={{marginLeft: 20}}>
                  <Text style={styles.userText}>
                    {item.user.first_name + ' ' + item.user.last_name}
                  </Text>
                  {item.latestMessage?.body.type == 'voice' ? (
                    <View style={{marginVertical: 5, flexDirection: 'row'}}>
                      <Icon
                        name={'microphone'}
                        size={20}
                        color={colors.accent}
                      />
                      <Text style={{color: colors.complimentary}}>0:25</Text>
                    </View>
                  ) : (
                    <Text style={styles.msgText}>
                      {item.latestMessage?.body.content}
                    </Text>
                  )}
                  <Text style={styles.msgTime}>
                    {formatTime(item.latestMessage.localTime)}
                  </Text>
                  {/* <Text style={styles.msgTime}>12:59 | 11 -04-2022 07:59</Text> */}
                </View>
              </TouchableOpacity>
            </View>
          )}
        />
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
  heading: {
    ...appStyles.headline,
    marginLeft: 20,
    color: colors.complimentary,
  },
  image: {
    flex: 1,
    // display: 'flex',
    // justifyContent: 'space-around',
  },
  header: {
    flexDirection: 'row',
    marginTop: Platform.OS == 'ios' ? 50 : 0,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  support: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userSection: {
    marginTop: 20,
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
  },
  profile: {
    flexDirection: 'row',
  },
  msgTime: {
    ...appStyles.smallTxt,
    color: colors.body_text,
  },
  userText: {
    color: colors.complimentary,
    ...appStyles.regularTxtMd,
  },
  msgText: {
    color: colors.body_text,
    marginVertical: 5,
    ...appStyles.regularTxtRg,
  },
  userDesc: {
    color: '#82838d',
    marginTop: 5,
    fontWeight: '500',
    fontSize: 16,
  },
  followBtn: {
    backgroundColor: '#ef0143',
    // paddingHorizontal: 10,
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
