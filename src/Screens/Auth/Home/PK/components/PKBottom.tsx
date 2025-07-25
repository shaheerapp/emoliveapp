import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
  TextInput,
  Image,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../../../../styles/colors';
import appStyles from '../../../../../styles/styles';
import IconM from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';

import {setChatRoomMessages} from '../../../../../store/slice/chatSlice';
import {
  ChatClient,
  ChatMessage,
  ChatMessageChatType,
} from 'react-native-agora-chat';

interface PKBottom {
  handleOpenSheet: any;
  roomId: string;
}

export default function PKBottom({roomId, handleOpenSheet}: PKBottom) {
  const chatClient = ChatClient.getInstance();

  const [message, setMessage] = useState<string>('');
  const dispatch = useDispatch();
  const {chatRoomMessages} = useSelector((state: any) => state.chat);

  const sendChatRoomMessage = async () => {
    // if (!roomId) {
    //   Alert.alert('Slow network', 'Chat room is not created');
    //   return;
    // }
    try {
      let msg;
      msg = ChatMessage.createTextMessage(
        String(roomId),
        message,
        ChatMessageChatType.ChatRoom,
      );
      setMessage('');
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
    <View>
      <View style={{height: '25%'}}>
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
        style={{
          position: 'absolute',
          width: '99%',
          alignSelf: 'center',
          bottom: Platform.OS == 'ios' ? 60 : 40,
        }}>
        <View style={styles.main}>
          <TouchableOpacity style={{width: '15%', marginLeft: 5}}>
            <View style={styles.subIcon}>
              <Icon name="star" size={15} color="#fff" />
            </View>
            <Text style={styles.btnTxt}>Subsc...</Text>
          </TouchableOpacity>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholderTextColor="#B9B3C2"
            placeholder="Add com..."
            style={styles.input}
          />
          <TouchableOpacity
            onPress={sendChatRoomMessage}
            style={{width: '8%', marginLeft: 5}}>
            <Icon name="send" color={colors.complimentary} size={25} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{width: '12%'}}
            onPress={() => handleOpenSheet('tools')}>
            <Icon name="flower-outline" color="#F35058" size={25} />
            <Text style={styles.btnTxt}>Rose</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{width: '12%'}}
            onPress={() => handleOpenSheet('gifts')}>
            <Icon name="gift" color="#F97CA1" size={25} />
            <Text style={styles.btnTxt}>Gift</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{width: '12%'}}>
            <Icon name="share-outline" color={colors.complimentary} size={25} />
            <Text style={styles.btnTxt}>78</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  subIcon: {
    marginLeft: 8,
    backgroundColor: '#F9B04F',
    width: 20,
    height: 20,
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center',
  },
  list: {
    padding: 4,
    alignItems: 'center',
    flexDirection: 'row',
  },
  input: {
    backgroundColor: '#28203A',
    borderRadius: 20,
    color: colors.complimentary,
    width: '45%',
    padding: 10,
  },
  roomMessage: {
    marginLeft: 5,
    color: colors.complimentary,
    ...appStyles.bodyRg,
  },
  btnTxt: {
    marginTop: 5,
    color: colors.complimentary,
    ...appStyles.bodyMd,
  },
});
