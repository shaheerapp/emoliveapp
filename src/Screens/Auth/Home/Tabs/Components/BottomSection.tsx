import {
  Text,
  View,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
  StyleSheet,
} from 'react-native';
import {colors} from '../../../../../styles/colors';
import IconM from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import appStyles from '../../../../../styles/styles';
import {setGuestUser} from '../../../../../store/slice/usersSlice';
import liveStyles from '../styles/liveStyles';
import {
  setChatRoomMessages,
  addRoomMessage,
} from '../../../../../store/slice/chatSlice';
import bottomStyles from './styles/bottomStyles';
import {
  ChatClient,
  ChatMessage,
  ChatMessageChatType,
} from 'react-native-agora-chat';

import {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
interface BottomSectionProps {
  handleOpenSheet: any;
  roomId: string;
  single: boolean;
}

const BottomSection = ({
  handleOpenSheet,
  roomId,
  single,
}: BottomSectionProps) => {
  const chatClient = ChatClient.getInstance();
  const dispatch = useDispatch();
  const {chatRoomMessages} = useSelector((state: any) => state.chat);
  const {guestUser} = useSelector((state: any) => state.users);
  const [message, setMessage] = useState<string>('');

  // create an animated value for opacity
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (guestUser.joined) {
      fadeInAndOut();
    }
  }, [guestUser]);
  // Function to start the fade-in and fade-out animation
  const fadeInAndOut = () => {
    // First, set the initial opacity to 1 (fully visible)
    Animated.timing(fadeAnim, {
      toValue: 1, // Fully visible
      duration: 500, // Fade in duration (0.5 seconds)
      useNativeDriver: true, // Use native driver for better performance
    }).start(() => {
      // After fading in, start fading out after 3 seconds
      setTimeout(() => {
        dispatch(setGuestUser({state: null, user: null}));
        Animated.timing(fadeAnim, {
          toValue: 0, // Fully transparent
          duration: 2500, // Fade out duration (2.5 seconds)
          useNativeDriver: true,
        }).start();
        // update state
      }, 3000); // Wait 3 seconds before starting the fade-out
    });
  };

  const sendChatRoomMessage = async () => {
    if (!roomId) {
      Alert.alert('Slow network', 'Chat room is not created');
      return;
    }
    try {
      let msg;
      msg = ChatMessage.createTextMessage(
        String(roomId),
        message,
        ChatMessageChatType.ChatRoom,
      );
      setMessage('');

      // let roomMessage = [...chatRoomMessages];
      // roomMessage.push(msg);
      dispatch(addRoomMessage(msg));
      // return;
      const callback = new (class {
        onProgress(localMsgId: any, progress: any) {
          console.log(`send message process: ${localMsgId}, ${progress}`);
        }
        onError(localMsgId: any, error: any) {
          let updated = chatRoomMessages.map((roomMessage: ChatMessage) => {
            if (roomMessage.localMsgId === localMsgId) {
              return {...roomMessage, status: 3}; // Return updated message
            }
            return roomMessage; // Keep other messages unchanged
          });
          dispatch(setChatRoomMessages(updated));
          console.log(
            `send message fail: ${localMsgId}, ${JSON.stringify(error)}`,
          );
        }
        onSuccess(message: any) {
          console.log(message);
          let updated = chatRoomMessages.map((roomMessage: ChatMessage) => {
            if (roomMessage.localMsgId === message.localMsgId) {
              return {...roomMessage, status: 2}; // Return updated message
            }
            return roomMessage; // Keep other messages unchanged
          });
          dispatch(setChatRoomMessages(updated));
          // console.log('send message success: ' + message.localMsgId);
        }
      })();
      await chatClient.chatManager.sendMessage(msg, callback);
      // Push the new message to the messages array and update the state
    } catch (error) {
      console.error('Unexpected error occurred:', error);
    }
  };

  return (
    <View
      style={[
        single
          ? bottomStyles.singleLive
          : {
              flex: 1,
              padding: 10,
            },
      ]}>
      <View
        style={[
          styles.sheetMessage,
          // single && {position: 'relative', bottom: 40},
        ]}>
        <Text
          onPress={fadeInAndOut}
          style={[appStyles.bodyMd, {color: colors.yellow, lineHeight: 20}]}>
          Emo Live :{' '}
          <Text style={[appStyles.bodyRg, {color: colors.complimentary}]}>
            {' '}
            Great to see you here. Please don’t use abusive language, enjoy the
            stream, Have fun 😊
          </Text>
        </Text>
      </View>
      <View style={{position: 'relative'}}>
        <Animated.View
          style={[
            {
              position: 'absolute',
              width: '100%',
              zIndex: 2,
              opacity: fadeAnim, // Bind the opacity to animated value
            },
            single && {},
          ]}>
          <JoinUser guestUser={guestUser} />
        </Animated.View>
      </View>

      {/* )} */}
      <View style={[single ? {height: '30%'} : {height: '46%'}]}>
        <FlatList
          data={chatRoomMessages}
          contentContainerStyle={{paddingBottom: 10}}
          keyExtractor={item => item.localTime.toString()}
          renderItem={({item}: any) => (
            <View style={styles.list}>
              <View>
                <Image
                  style={{height: 30, width: 30, borderRadius: 20}}
                  source={require('../../../../../assets/images/live/girl1.jpg')}
                />
              </View>
              <Text style={styles.roomMessage}>{item.body.content}</Text>
              {item.status == 3 && (
                <View style={{marginLeft: 5}}>
                  <IconM
                    name="error-outline"
                    size={20}
                    color={colors.complimentary}
                  />
                </View>
              )}
            </View>
          )}
        />
      </View>
      <View
        style={[
          styles.btn1,
          single
            ? {
                marginTop: 10,
                // bottom: Platform.OS == 'ios' ? 10 : 40,
              }
            : {
                position: 'absolute',
                bottom: Platform.OS == 'ios' ? 30 : 10,
              },
        ]}>
        {/* <View style={[styles.btn1, single && {bottom: 30}]}> */}
        <TextInput
          style={[
            styles.inputBox,
            single && {
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderColor: colors.complimentary,
            },
          ]}
          autoCapitalize="none"
          spellCheck={false}
          autoCorrect={false}
          onChangeText={setMessage}
          value={message}
          placeholder="Say hello ...."
          placeholderTextColor={single ? colors.complimentary : 'grey'}
        />

        <View style={styles.action}>
          {/* <TouchableOpacity> */}
          <TouchableOpacity onPress={sendChatRoomMessage}>
            <Icon name="send" color={colors.complimentary} size={24} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleOpenSheet('tools')}>
            <Icon
              name="dots-horizontal"
              color={colors.complimentary}
              size={24}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              console.log(chatRoomMessages);
            }}>
            <Icon name="emoticon" color={colors.yellow} size={24} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleOpenSheet('gifts')}>
            <Image
              source={require('../../../../../assets/images/bag.png')}
              style={{height: 30, width: 30}}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
export default BottomSection;

const styles = StyleSheet.create({
  ...liveStyles,
  ...bottomStyles,
  roomMessage: {
    marginLeft: 5,
    color: colors.complimentary,
    ...appStyles.bodyRg,
  },
  main: {
    // flex: 1,
    padding: 10,
    // height: 100,
    // backgroundColor: 'red',
  },
});

const JoinUser = ({guestUser}: any) => {
  return (
    <View style={styles.guest}>
      <View style={styles.userJoin}>
        <Text style={[appStyles.small, {color: colors.dominant}]}>
          Official
        </Text>
      </View>
      <View style={{marginLeft: 10, flexDirection: 'row'}}>
        <Text style={[appStyles.bodyMd, {color: colors.yellow}]}>
          Mr {guestUser.user?.first_name}:
        </Text>
        <Text
          style={[
            appStyles.bodyRg,
            {color: colors.complimentary, marginLeft: 5},
          ]}>
          Join Room
        </Text>
      </View>
    </View>
  );
};
