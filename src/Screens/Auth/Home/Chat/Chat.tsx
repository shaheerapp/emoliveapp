import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Platform,
  Dimensions,
  Alert,
  StyleSheet,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import ChatModal from './Components/ChatModal';
import Svg, {Polyline} from 'react-native-svg';
const deviceHeight = Dimensions.get('window').height;
import RNFS from 'react-native-fs';
import {
  ChatClient,
  ChatMessageType,
  ChatOptions,
  ChatConversationType,
  ChatMessageChatType,
  ChatSearchDirection,
  ChatMessage,
} from 'react-native-agora-chat';
import {selectMessagesForConversation} from '../../../../store/selectors/selectors';
import Header from './Components/Header';
import {colors} from '../../../../styles/colors';
import Input from './Components/Input';
import {
  setMessages,
  setMessageStatus,
  setSentMessage,
  setConnected,
} from '../../../../store/slice/chatSlice';
import axiosInstance from '../../../../Api/axiosConfig';
import envVar from '../../../../config/envVar';
import {useSelector, useDispatch} from 'react-redux';
import appStyles from '../../../../styles/styles';
import {chatStyles} from './styles/chat';
import {useAppContext} from '../../../../Context/AppContext';
const voiceMessage = {
  body: {
    localPath:
      '/Users/macbookpro/Library/Developer/CoreSimulator/Devices/9B56342A-16A9-4EBC-A996-9B76BD6DC2FA/data/Containers/Data/Application/603A65A4-E9BB-4717-86BF-02FA8B812759/Library/Application Support/HyphenateSDK/appdata/2/2/android_75fa8df7-b9bb-41a4-a358-8803e7b61930/d8d16b30-fc49-11ef-8631-4fbf3e6bcc02',
  },
};

interface ChatProps {
  navigation: any;
  route: any;
}
export default function Chat({navigation, route}: ChatProps) {
  const {chatUser} = useSelector((state: any) => state.users);

  const dispatch = useDispatch();
  const chatClient = ChatClient.getInstance();
  const audioPlayerRef = useRef<AudioRecorderPlayer | null>(null);
  const {connected, messagesByConversation} = useSelector(
    (state: any) => state.chat,
  );
  const {userAuthInfo, tokenMemo} = useAppContext();
  const {user} = userAuthInfo;
  const {token} = tokenMemo;

  const [modalInfo, setModalInfo] = useState({
    modal: false,
    type: '',
  });

  const [message, setMessage] = useState({
    type: 'initial',
    uri: '',
    content: '',
    icon: 'microphone',
  });
  const [voicePlay, setVoicePlay] = useState<any>({
    audioData: [],
    playTime: '12:22',
    id: '',
    played: false,
  });

  const userMessages = useSelector(state =>
    selectMessagesForConversation(state, chatUser.id),
  );

  useEffect(() => {
    if (!audioPlayerRef.current) {
      audioPlayerRef.current = new AudioRecorderPlayer();
    }
    return () => {
      // Clean up the audio player instance on component unmount
      audioPlayerRef.current?.stopPlayer();
      audioPlayerRef.current = null;
    };
  }, []);

  const downloadAndPlayVoice = async () => {
    try {
      const remotePath =
        'https://a61.easemob.com/611258830/1451592/chatfiles/567513a0-fcdd-11ef-9626-53989cf3b277';
      // const remotePath = voiceMessage.body.remotePath;
      // const localPath = voiceMessage.body.localPath;

      if (!remotePath) {
        console.error('No remote path found');
        return;
      }

      // Define the local file path with the correct extension
      const fileName = remotePath.split('/').pop(); // Extract the file name from the URL
      const newPath = `${RNFS.CachesDirectoryPath}/${fileName}.mp4`; // Save as .mp4

      // Check if the file already exists in the cache directory
      const fileExists = await RNFS.exists(newPath);

      console.log(fileExists, 'Ss');

      if (!fileExists) {
        // Download the file from the remote path
        const downloadResult = await RNFS.downloadFile({
          fromUrl: remotePath,
          toFile: newPath,
        }).promise;

        console.log('File downloaded to:', newPath);
      }

      // Construct the URI based on the platform
      const audioURI = Platform.OS === 'ios' ? `file://${newPath}` : newPath;

      console.log('Playing audio from:', audioURI);

      // Start playing the audio
      const result = await audioPlayerRef.current?.startPlayer(audioURI);

      console.log('Playback started:', result);

      // Handle playback completion
      audioPlayerRef.current?.addPlayBackListener(e => {
        if (e.currentPosition === e.duration) {
          console.log('Playback finished');
          audioPlayerRef.current?.stopPlayer();
          audioPlayerRef.current?.removePlayBackListener();
        }
      });
    } catch (error) {
      console.error('Error downloading or playing audio:', error);
    }
  };
  const downloadAndPlayVoiced = async () => {
    try {
      const remotePath =
        'https://a61.easemob.com/611258830/1451592/chatfiles/567513a0-fcdd-11ef-9626-53989cf3b277';
      // const remotePath = voiceMessage.body.remotePath;
      // const localPath = voiceMessage.body.localPath;

      if (!remotePath) {
        console.error('No remote path found');
        return;
      }

      // Define the local file path with the correct extension
      const fileName = remotePath.split('/').pop(); // Extract the file name from the URL
      const newPath = `${RNFS.CachesDirectoryPath}/${fileName}.mp4`; // Save as .mp4

      // Check if the file already exists in the cache directory
      const fileExists = await RNFS.exists(newPath);

      console.log(fileExists, 'Ss');

      if (!fileExists) {
        // Download the file from the remote path
        const downloadResult = await RNFS.downloadFile({
          fromUrl: remotePath,
          toFile: newPath,
        }).promise;

        console.log('File downloaded to:', newPath);
      }

      // Construct the URI based on the platform
      const audioURI = Platform.OS === 'ios' ? `file://${newPath}` : newPath;

      console.log('Playing audio from:', audioURI);

      // Start playing the audio
      const result = await audioPlayerRef.current?.startPlayer(audioURI);

      console.log('Playback started:', result);

      // Handle playback completion
      audioPlayerRef.current?.addPlayBackListener(e => {
        if (e.currentPosition === e.duration) {
          console.log('Playback finished');
          audioPlayerRef.current?.stopPlayer();
          audioPlayerRef.current?.removePlayBackListener();
        }
      });
    } catch (error) {
      console.error('Error downloading or playing audio:', error);
    }
  };

  // Sends a text message to somebody.
  const sendMsg = async () => {
    try {
      // remotePath?: string;
      type Payload = {
        conversationId: any;
        status: number;
        msgId: any;
        remotePath?: string;
      };
      if (!connected) return;
      let msg;
      console.log('why i am not sending message');
      if (message.type == 'text') {
        msg = ChatMessage.createTextMessage(
          String(chatUser.id),
          message.content,
        );
      }
      if (message.type == 'voice') {
        let messageInfo = {
          displayName: 'voice',
        };
        let fileUri = message.uri.replace('file:///', '/');
        msg = ChatMessage.createVoiceMessage(
          String(chatUser.id),
          fileUri,
          // message.uri,
          // messageInfo,
        );
      }
      setMessage((prevState: any) => ({
        ...prevState,
        content: '',
        uri: '',
      }));

      dispatch(setSentMessage(msg));

      console.log(msg);
      const callback = new (class {
        onProgress(locaMsgId: string, progress: string) {
          // console.log(`send message process: ${locaMsgId}, ${progress}`);
          let payload: Payload = {
            conversationId: chatUser.id,
            status: 1,
            msgId: locaMsgId,
          };
          dispatch(setMessageStatus(payload));
        }
        onError(locaMsgId: string, error: any) {
          // console.log(error);
          if (error.code == 201) {
            dispatch(setConnected(false));
          }
          let payload = {
            conversationId: chatUser.id,
            status: 3,
            msgId: locaMsgId,
          };
          dispatch(setMessageStatus(payload));
        }
        onSuccess(message: any) {
          // console.log('sent', message);
          let payload: Payload = {
            conversationId: message.conversationId,
            status: 2,
            msgId: message.localMsgId,
          };
          if (message.body.type == 'voice') {
            payload = {...payload, remotePath: message.body.remotePath};
          }
          dispatch(setMessageStatus(payload));
        }
      })();
      await chatClient.chatManager.sendMessage(msg, callback);
      // Push the new message to the messages array and update the state
    } catch (error) {
      console.error('Unexpected error occurred:', error);
    }
  };

  const getMessages = async () => {
    console.log(chatUser.id);
    try {
      let params = {
        convId: String(chatUser.id),
        convType: 0,
        msgType: ChatMessageType.TXT,
        direction: ChatSearchDirection.DOWN,
        timestamp: Date.now(),
        count: 1,
        // sender: String(user.id),
        isChatThread: false,
      };
      const textMessages = await chatClient.chatManager.getMsgsWithMsgType(
        params,
      );
      const voiceMessages = await chatClient.chatManager.getMsgsWithMsgType({
        ...params,
        msgType: ChatMessageType.VOICE,
      });
      // const allMessages = [...textMessages, ...voiceMessages].sort(
      // (a, b) => a.timestamp - b.timestamp,
      // );
      console.log(voiceMessages);
      // setMessages(voiceMessages);
      // setMessages(allMessages);
    } catch (error) {
      console.log(error);
    }
  };
  const processAudioData = (position: any) => {
    const maxHeight = 18;
    const maxAmplitude = 100;

    return Array.from({length: 50}, () => {
      const randomValue = Math.random() * maxAmplitude; // Simulate amplitude
      return (randomValue / maxAmplitude) * maxHeight; // Normalize to maxHeight
    });
  };
  const playVoice2 = async () => {
    try {
      const localPath = voiceMessage.body.localPath;

      if (!localPath) {
        console.error('No valid local path found');
        return;
      }

      // Define the new path with the correct extension
      const newFilename = 'sound.m4a'; // Use .mp4 for Android if needed
      const newPath = `${RNFS.CachesDirectoryPath}/${newFilename}`;

      // Check if the file already exists in the cache directory
      const fileExists = await RNFS.exists(newPath);

      if (!fileExists) {
        // If the file doesn't exist, copy it to the cache directory
        await RNFS.copyFile(localPath, newPath);
        console.log('File copied to cache directory');
      }

      // Construct the URI based on the platform
      const audioURI = Platform.OS === 'ios' ? `file://${newPath}` : newPath;

      console.log('Playing audio from:', audioURI);

      // Start playing the audio
      const result = await audioPlayerRef.current?.startPlayer(audioURI);

      console.log('Playback started:', result);

      // Handle playback completion
      audioPlayerRef.current?.addPlayBackListener(e => {
        if (e.currentPosition === e.duration) {
          console.log('Playback finished');
          audioPlayerRef.current?.stopPlayer();
          audioPlayerRef.current?.removePlayBackListener();
        }
      });
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const playVoice = async (item: any) => {
    try {
      if (voicePlay.played) {
        stopPlay();
        return;
      }
      let remotePath = item.body.remotePath;
      // Define the local file path with the correct extension
      const fileName = remotePath.split('/').pop(); // Extract the file name from the URL
      const newPath = `${RNFS.CachesDirectoryPath}/${fileName}.mp4`; // Save as .mp4

      // Check if the file already exists in the cache directory
      const fileExists = await RNFS.exists(newPath);

      if (!fileExists) {
        // Download the file from the remote path
        const downloadResult = await RNFS.downloadFile({
          fromUrl: remotePath,
          toFile: newPath,
        }).promise;

        console.log('File downloaded to:', newPath);
      }
      const audioURI = Platform.OS === 'ios' ? `file://${newPath}` : newPath;
      // return;
      await audioPlayerRef.current?.startPlayer(audioURI);
      // await audioPlay.er.startPlayer(uri);
      console.log('Playing audio:');
      setVoicePlay((prevState: any) => ({
        ...prevState,
        id: item.msgId,
        played: true,
      }));

      // Add playback listener
      audioPlayerRef.current?.addPlayBackListener(e => {
        // Process waveform data if needed
        const waveform = processAudioData(e.currentPosition); // Simulated function for visualization
        setVoicePlay((prevState: any) => ({...prevState, audioData: waveform}));

        const positionInSeconds = e.currentPosition / 1000;
        const playTime = audioPlayerRef.current?.mmss(
          Math.floor(positionInSeconds),
        );
        setVoicePlay((prevState: any) => ({...prevState, playtime: playTime}));

        // Stop playback when the audio finishes
        if (e.currentPosition >= e.duration) {
          stopPlay();
        }
      });
    } catch (error) {
      // Log any error during playback
      console.error('Error starting playback:', error);
    }
  };

  const stopPlay = async () => {
    try {
      const res = await audioPlayerRef.current?.stopPlayer();
      setVoicePlay((prevState: any) => ({...prevState, played: false, id: ''}));
      audioPlayerRef.current?.removePlayBackListener();
    } catch (error) {
      console.log(error);
    }
  };

  const formatTime = (timestamp: any) => {
    const date = new Date(timestamp);

    // Get the time components
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    hours = hours % 12 || 12;

    // Format the date components
    const day = date.getDate();
    const month = date.toLocaleString('default', {month: 'short'}); // Short month name
    const year = date.getFullYear();

    // Create the formatted string
    const formattedTime = `${hours}:${minutes
      .toString()
      .padStart(2, '0')} ${ampm} ${day} ${month} ${year}`;
    return formattedTime;
  };

  const clearMessages = async () => {
    try {
      const res = await chatClient.chatManager.deleteConversation(
        String(1),
        // String(user.id),
      );
      console.log(res, 'Ss');
    } catch (error) {
      console.log(error);
    }
  };

  const logout = async () => {
    try {
      const res = await chatClient.logout();
      dispatch(setConnected(false));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={chatStyles.container}>
      {/* Header */}
      <>
        <Header
          navigation={navigation}
          token={token}
          logout={logout}
          connected={connected}
        />

        {/* <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text
            style={{color: '#fff'}}
            onPress={() => console.log(userMessages)}>
            getMessages
          </Text>
          <Text
            style={{color: '#fff'}}
            onPress={() => console.log(messagesByConversation)}>
            tests
          </Text>
          <Text style={{color: '#fff'}} onPress={playVoice2}>
            playVoice2
          </Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text onPress={downloadAndPlayVoice} style={{color: '#fff'}}>
            dandPlay
          </Text>
        </View> */}

        <View style={styles.list}>
          <FlatList
            data={userMessages}
            contentContainerStyle={{paddingBottom: 30}}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}: any) => {
              return (
                <>
                  {parseInt(item.to) == user.id ? (
                    <TouchableOpacity
                      onLongPress={() => {
                        setModalInfo(() => ({modal: true, type: 'report'}));
                      }}>
                      <View style={chatStyles.myMessage}>
                        {item.body.type == 'txt' ? (
                          <Text
                            style={[
                              appStyles.bodyRg,
                              {color: colors.complimentary},
                            ]}>
                            {item.body?.content}
                          </Text>
                        ) : item.body.type == 'voice' ? (
                          <View style={styles.voice}>
                            <TouchableOpacity onPress={() => playVoice(item)}>
                              <Icon
                                name={
                                  voicePlay.id == item.id && voicePlay.played
                                    ? 'pause'
                                    : 'play'
                                }
                                size={25}
                                color={colors.accent}
                              />
                            </TouchableOpacity>

                            {voicePlay.id == item.msgId ? (
                              <>
                                <View style={chatStyles.waveForm}>
                                  <Svg height="18" width="100%">
                                    <Polyline
                                      points={voicePlay.audioData
                                        .map(
                                          (value, index) =>
                                            `${index * 5},${18 - value}`,
                                        )
                                        .join(' ')}
                                      fill="none"
                                      stroke={colors.accent}
                                      strokeWidth="2"
                                    />
                                  </Svg>
                                </View>
                                <Text
                                  style={[
                                    appStyles.regularTxtRg,
                                    {
                                      marginLeft: 10,
                                      color: colors.complimentary,
                                    },
                                  ]}>
                                  {voicePlay.playtime}
                                </Text>
                              </>
                            ) : (
                              <View style={styles.voiceView}>
                                <Text style={{color: colors.complimentary}}>
                                  {
                                    '||||| :::: ||||| |||| ||||| ||||| ||| ||||| ::::::: |||||'
                                  }
                                </Text>
                                <Text
                                  style={{
                                    alignSelf: 'flex-end',
                                    color: colors.complimentary,
                                  }}>
                                  00:03
                                </Text>
                              </View>
                            )}
                          </View>
                        ) : (
                          <Text>File Type</Text>
                        )}
                      </View>
                      <Text style={[appStyles.smallTxt, {color: '#7B8095'}]}>
                        {formatTime(item.localTime)}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={chatStyles.mineMessage}>
                      <TouchableOpacity
                        onLongPress={() => {
                          setModalInfo({
                            modal: true,
                            type: 'delete',
                          });
                        }}
                        style={chatStyles.myMessageBody}>
                        {item.body.type == 'txt' ? (
                          <Text style={[{color: colors.dominant}]}>
                            {item.body?.content}
                          </Text>
                        ) : item.body.type == 'voice' ? (
                          <>
                            <View style={styles.voiceMsg}>
                              <TouchableOpacity onPress={() => playVoice(item)}>
                                <Icon
                                  name={
                                    voicePlay.id == item.msgId &&
                                    voicePlay.played
                                      ? 'pause'
                                      : 'play'
                                  }
                                  size={25}
                                  color={colors.accent}
                                />
                              </TouchableOpacity>
                              {voicePlay.id == item.msgId ? (
                                <>
                                  <View style={{width: '78%', marginLeft: 5}}>
                                    <Svg height="18" width="100%">
                                      <Polyline
                                        points={voicePlay.audioData
                                          .map(
                                            (value, index) =>
                                              `${index * 5},${18 - value}`,
                                          )
                                          .join(' ')}
                                        fill="none"
                                        stroke={colors.accent}
                                        strokeWidth="2"
                                      />
                                    </Svg>
                                  </View>

                                  <Text
                                    style={[
                                      appStyles.regularTxtRg,
                                      {marginLeft: 5},
                                    ]}>
                                    {voicePlay.playtime}
                                  </Text>
                                </>
                              ) : (
                                <>
                                  <View style={styles.voicePattern}>
                                    <Text>
                                      {
                                        '||||| :::: ||||| |||| ||||| ||||| ||| ||||| ::::::: |||||'
                                      }
                                    </Text>
                                    <Text style={{alignSelf: 'flex-end'}}>
                                      00:03
                                    </Text>
                                  </View>
                                </>
                              )}
                            </View>
                          </>
                        ) : (
                          <Text>File Type</Text>
                        )}
                      </TouchableOpacity>
                      <View style={styles.messageAck}>
                        {item.status == 1 &&
                        ![2, 3].includes(item.status) &&
                        item.body.type == 'voice' ? (
                          <Icon
                            name="clock-time-four-outline"
                            color={colors.lines}
                            size={16}
                          />
                        ) : item.status == 3 ? (
                          <Icon
                            name="alert-circle-outline"
                            color={colors.lines}
                            size={16}
                          />
                        ) : item.status == 1 || item.status == 2 ? (
                          <Icon
                            name={item.status == 1 ? 'check' : 'check-all'}
                            color={item.hasReadAck ? 'blue' : colors.accent}
                            size={16}
                          />
                        ) : (
                          <></>
                        )}
                      </View>
                      <Text style={chatStyles.messageTime}>
                        {formatTime(item.localTime)}
                      </Text>
                    </View>
                  )}
                </>
              );
            }}
          />
        </View>
        <ChatModal modalInfo={modalInfo} setModalInfo={setModalInfo} />
        <View style={styles.input}>
          <Input
            audioPlayerRef={audioPlayerRef}
            setMessage={setMessage}
            message={message}
            sendMsg={sendMsg}
          />
        </View>
      </>
    </View>
  );
}
const styles = StyleSheet.create({
  voiceMsg: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  list: {
    // marginTop: 20,
    // marginVertical: 180,
    height: deviceHeight * 0.78,
  },
  voice: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voicePattern: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  voiceView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  input: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    width: '100%',
  },
  messageAck: {position: 'absolute', right: 10, bottom: 25},
});

// file:////data/user/0/com.meow/cache/sound.mp4 recording stopped
// (NOBRIDGE) LOG  Playing audio: /data/user/0/com.meow/cache/sound.mp4
