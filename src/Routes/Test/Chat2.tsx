// Imports dependencies.
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  Button,
  TextInput,
  View,
} from 'react-native';
import {
  ChatClient,
  ChatOptions,
  ChatMessageChatType,
  ChatMessage,
} from 'react-native-agora-chat';
// Defines the App object.
let tokens = [
  '007eJxTYFjioyL6de2k5/kcJxjcnRRvXL7zdrWQv/uXi6vXPfixIMVNgSE5ydDcwsLUMi3NwNDEwCDFwiAl2cQgJdXQ3DwtNSUp2fd3Xvpfifx0Bc04FkYGVgZGIATxVRgszUxMLYDadJNNjEx1DQ1T03QtLVOSdNOMTSyM00yMjYyNkgBqVSp/',
  '007eJxTYHgUdmvbmQDTXes+rNnvJraP/+W3usU1YakS6n+0ZWJ+iNxRYEhOMjS3sDC1TEszMDQxMEixMEhJNjFISTU0N09LTUlKTv2Tl94QyMhQWhbLwsjAysAIhCC+CoNFqkVSmoWFgW5SSkqSrqFhapqupZGJha65pUGqqZG5pXFqkiEASn0pPA==',
];
import env from '../../config/envVar';
import {useAppContext} from '../../Context/AppContext';
const AGORA_KEY = env.AGORA_KEY;
const Chat2 = ({navigation}) => {
  const {userAuthInfo} = useAppContext();
  const {user} = userAuthInfo;
  // Defines the variable.
  const title = 'AgoraChatQuickstart';
  // const appKey = '007eJxTYCjn4BblO/rO9DTjNQvH+YIrY3tcHSQzmloFNRmsn6fJ/FRgSE4yNLewMLVMSzMwNDEwSLEwSEk2MUhJNTQ3T0tNSUq+cTI1vSGQkaGIwYCVkYGVgZGBiQHEZ2AAAHAFGfc=';
  const appKey = '611258830#1451592';
  // Replaces <your userId> with your user ID.
  const [username, setUsername] = useState('1');
  // const [username, setUsername] = useState('<your userId>');
  // Replaces <your agoraToken> with your Agora token.
  const [chatToken, setChatToken] = useState('');
  const [targetId, setTargetId] = useState(0);
  const [content, setContent] = useState('');
  const [token, setTokenCount] = useState(0);
  const [initialized, setInitialized] = useState(false);
  const [logText, setWarnText] = useState('Show log area');
  const chatClient = ChatClient.getInstance();

  const chatManager = chatClient.chatManager;

  // Outputs console logs.
  useEffect(() => {
    logText.split('\n').forEach((value, index, array) => {
      if (index === 0) {
        console.log(value);
      }
    });
  }, [logText]);
  // // Outputs UI logs.
  const rollLog = (text: any) => {
    setWarnText(preLogText => {
      let newLogText = text;
      preLogText
        .split('\n')
        .filter((value, index, array) => {
          if (index > 8) {
            return false;
          }
          return true;
        })
        .forEach((value, index, array) => {
          newLogText += '\n' + value;
        });
      return newLogText;
    });
  };
  useEffect(() => {
    // Registers listeners for messaging.
    const setMessageListener = () => {
      let msgListener = {
        onMessagesReceived(messages: any) {
          for (let index = 0; index < messages.length; index++) {
            console.log(messages);
            rollLog('received msgId: ' + messages[index].msgId);
          }
        },
        onCmdMessagesReceived: messages => {},
        onMessagesRead: messages => {},
        onGroupMessageRead: groupMessageAcks => {},
        onMessagesDelivered: messages => {},
        onMessagesRecalled: messages => {},
        onConversationsUpdate: () => {},
        onConversationRead: (from, to) => {},
      };
      chatManager.removeAllMessageListener();
      chatManager.addMessageListener(msgListener);
    };
    // Initializes the SDK.
    // Initializes any interface before calling it.
    const init = () => {
      let o = new ChatOptions({
        autoLogin: false,
        appKey: appKey,
      });
      chatClient.removeAllConnectionListener();
      chatClient
        .init(o)
        .then(() => {
          rollLog('init success');
          setInitialized(true);
          let listener = {
            onTokenWillExpire() {
              rollLog('token expire.');
            },
            onTokenDidExpire() {
              rollLog('token did expire');
            },
            onConnected() {
              rollLog('onConnected');
              setMessageListener();
            },
            onDisconnected(errorCode: any) {
              rollLog('onDisconnected:' + errorCode);
            },
          };
          chatClient.addConnectionListener(listener);
        })
        .catch(error => {
          rollLog(
            'init fail: ' +
              (error instanceof Object ? JSON.stringify(error) : error),
          );
        });
    };
    init();
  }, [chatClient, chatManager, AGORA_KEY]);

  const selectToken = () => {
    if (token < 1) {
      setChatToken(tokens[1]);
      setTokenCount(1);
      return;
    }
    setChatToken(tokens[0]);
  };

  // Logs in with an account ID and a token.
  const login = () => {
    if (!initialized) {
      rollLog('Perform initialization first.');
      return;
    }
    rollLog('start login ...');
    chatClient
      .login(user.id, user.agora_chat_token, false)
      .then(() => {
        rollLog('login operation success.');
      })
      .catch(reason => {
        rollLog('login fail: ' + JSON.stringify(reason));
      });
  };
  const renewToken = () => {
    try {
      chatClient
        .renewToken(chatToken)
        .then(() => {
          rollLog('renew token success.');
        })
        .catch((reason: any) => {
          rollLog('renew token fail: ' + JSON.stringify(reason));
        });
    } catch (error) {}
  };
  // Logs out from server.
  const logout = () => {
    if (!initialized) {
      rollLog('Perform initialization first.');
      return;
    }
    rollLog('start logout ...');
    chatClient
      .logout()
      .then(() => {
        rollLog('logout success.');
      })
      .catch(reason => {
        rollLog('logout fail:' + JSON.stringify(reason));
      });
  };
  const getLoggedToken = () => {
    chatClient
      .getAccessToken()
      .then(token => {
        console.log('token:', token);
      })
      .catch(error => {
        console.log('error:', error);
      });
  };
  // Sends a text message to somebody.
  const sendmsg = () => {
    if (!initialized) {
      rollLog('Perform initialization first.');
      return;
    }
    let msg = ChatMessage.createTextMessage(
      targetId,
      content,
      ChatMessageChatType.PeerChat,
    );
    const callback = new (class {
      onProgress(locaMsgId, progress) {
        rollLog(`send message process: ${locaMsgId}, ${progress}`);
      }
      onError(locaMsgId, error) {
        rollLog(`send message fail: ${locaMsgId}, ${JSON.stringify(error)}`);
      }
      onSuccess(message) {
        rollLog('send message success: ' + message.localMsgId);
      }
    })();
    rollLog('start send message ...');
    chatClient.chatManager
      .sendMessage(msg, callback)
      .then(() => {
        rollLog('send message: ' + msg.localMsgId);
      })
      .catch(reason => {
        rollLog('send fail: ' + JSON.stringify(reason));
      });
  };
  // Renders the UI.
  return (
    <SafeAreaView>
      <View style={styles.titleContainer}>
        <Text style={styles.title} onPress={() => navigation.goBack()}>
          {title}
        </Text>
      </View>
      <ScrollView>
        <View style={styles.inputCon}>
          <TextInput
            multiline
            style={styles.inputBox}
            placeholder="Enter username"
            onChangeText={text => setUsername(text)}
            value={username}
          />
        </View>
        <View style={styles.inputCon}>
          <TextInput
            multiline
            style={styles.inputBox}
            placeholder="Enter chatToken"
            onChangeText={text => setChatToken(text)}
            value={chatToken}
          />
        </View>
        <View style={styles.buttonCon}>
          <Text style={styles.eachBtn} onPress={login}>
            SIGN IN
          </Text>
          <Text style={styles.eachBtn} onPress={logout}>
            SIGN OUT
          </Text>
        </View>
        <View style={styles.inputCon}>
          <TextInput
            multiline
            style={styles.inputBox}
            placeholder="Enter the username you want to send"
            onChangeText={text => setTargetId(text)}
            value={targetId}
          />
        </View>
        <View style={styles.inputCon}>
          <TextInput
            multiline
            style={styles.inputBox}
            placeholder="Enter content"
            onChangeText={text => setContent(text)}
            value={content}
          />
        </View>
        <View style={styles.buttonCon}>
          <Text style={styles.btn2} onPress={sendmsg}>
            SEND TEXT
          </Text>
        </View>
        <Button title="select token" onPress={selectToken} />
        <Button title="get Token" onPress={getLoggedToken} />

        <View>
          <Text style={styles.logText} multiline={true}>
            {logText}
          </Text>
        </View>
        <View>
          <Text style={styles.logText}>{}</Text>
        </View>
        <View>
          <Text style={styles.logText}>{}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
// Sets UI styles.
const styles = StyleSheet.create({
  titleContainer: {
    height: 60,
    backgroundColor: '#6200ED',
  },
  title: {
    lineHeight: 60,
    paddingLeft: 15,
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  inputCon: {
    marginLeft: '5%',
    marginTop: 20,
    width: '90%',
    // height: 0,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  inputBox: {
    marginTop: 15,
    width: '100%',
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonCon: {
    marginLeft: '2%',
    width: '96%',
    flexDirection: 'row',
    marginTop: 20,
    height: 26,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  eachBtn: {
    height: 40,
    width: '28%',
    lineHeight: 40,
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    backgroundColor: '#6200ED',
    borderRadius: 5,
  },
  btn2: {
    height: 40,
    width: '45%',
    lineHeight: 40,
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    backgroundColor: '#6200ED',
    borderRadius: 5,
  },
  logText: {
    padding: 10,
    marginTop: 10,
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
  },
});
export default Chat2;
