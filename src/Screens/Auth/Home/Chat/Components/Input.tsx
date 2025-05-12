import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  TextInput,
  Alert,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../../../../styles/colors';
import appStyles from '../../../../../styles/styles';
import audioService from '../../../../../services/audioService';
import Svg, {Polyline} from 'react-native-svg';
interface InputProps {
  audioPlayerRef: React.RefObject<AudioRecorderPlayer | null>;
  message: any;
  setMessage: any;
  sendMsg: any;
}

export default function Input({
  audioPlayerRef,
  message,
  setMessage,
  sendMsg,
}: InputProps) {
  const [audioData, setAudioData] = useState<any>([]);
  const [audioMessage, setAudioMessage] = useState<any>({
    record: false,
    recorded: false,
    played: false,
    renderPlay: false,
    // audioData:[],
    uri: '',
    // recordTime:'',
    // playTime:
  });
  const [recordTime, setRecordTime] = useState<any>('');
  const [playTime, setPlayTime] = useState<any>('');

  const onStartPlay = async () => {
    try {
      if (audioMessage.played) {
        await audioService.stopPlaying();
        // await audioPlayerRef.current?.stopPlayer();
        onStopPlay();
        return;
      }
      const msg = await audioPlayerRef.current?.startPlayer();
      console.log('Playing audio:', msg);

      audioPlayerRef.current?.addPlayBackListener(e => {
        const waveform = processAudioData(e.currentPosition); // Simulated data
        setAudioData(waveform);

        const positionInSeconds = e.currentPosition / 1000;

        setPlayTime(
          audioPlayerRef.current?.mmss(Math.floor(positionInSeconds)),
        );

        if (e.currentPosition >= e.duration) {
          onStopPlay();
        }
      });

      setAudioMessage(prevState => ({...prevState, played: true}));
    } catch (error) {
      console.error('Error starting playback:', error);
    }
  };

  const processAudioData = position => {
    const maxHeight = 18;
    const maxAmplitude = 100;

    return Array.from({length: 50}, () => {
      const randomValue = Math.random() * maxAmplitude; // Simulate amplitude
      return (randomValue / maxAmplitude) * maxHeight; // Normalize to maxHeight
    });
  };

  const recordVoice = async () => {
    try {
      if (audioMessage.record) {
        console.log('b');
        const result = await audioPlayerRef.current?.stopRecorder();
        console.log(result, 'recording stopped');
        audioPlayerRef.current?.removeRecordBackListener();
        setRecordTime('');
        setAudioMessage(prevState => ({
          ...prevState,
          record: false,
          renderPlay: true,
        }));
        setMessage((prevState: any) => ({
          ...prevState,
          icon: 'microphone',
        }));
        return;
      }
      console.log('a');
      const filePath = await audioPlayerRef.current?.startRecorder();

      audioPlayerRef.current?.addRecordBackListener(e => {
        const waveform = processAudioData(e.currentPosition); // Simulated data
        setAudioData(waveform);
        const positionInSeconds = e.currentPosition / 1000;
        setRecordTime(
          audioPlayerRef.current?.mmss(Math.floor(positionInSeconds)),
        );
        // setRecordTime(
        //   audioPlayerRef.current?.mmssss(Math.floor(e.currentPosition)),
        // );
      });
      setAudioMessage(prevState => ({
        ...prevState,
        record: true,
        recorded: true,
        renderPlay: false,
        uri: filePath,
      }));
      setMessage((prevState: any) => ({
        ...prevState,
        type: 'voice',
        icon: 'pause',
        uri: filePath,
      }));
      console.log('i am king ....');
    } catch (error) {
      console.log(error);
    }
  };

  const onStopPlay = async () => {
    await audioPlayerRef.current?.stopPlayer();
    setAudioMessage(prevState => ({...prevState, played: false}));

    // setAudioData([]);
  };

  const deleteVoice = async () => {
    try {
      await audioPlayerRef.current?.stopRecorder();
      await audioPlayerRef.current?.stopPlayer();
      audioPlayerRef.current?.removeRecordBackListener();
      audioPlayerRef.current?.removePlayBackListener();
      setPlayTime('');
      setRecordTime('');
      setAudioData([]);
      setAudioMessage(prevState => ({
        ...prevState,
        record: false,
        recorded: false,
        renderPlay: false,
        uri: '',
      }));
      setMessage((prevState: any) => ({
        ...prevState,
        type: 'initial',
        icon: 'microphone',
      }));

      // Optional: Delete file logic (if needed)
      console.log('Voice deleted');
    } catch (error) {
      console.error('Error deleting voice:', error);
    }
  };
  const sendVoiceMessage = () => {
    resetParentMessage();
    // sendMsg();
    // deleteVoice()
  };
  const resetParentMessage = () => {
    setMessage((prevState: any) => ({
      ...prevState,
      type: 'initial',
      icon: 'microphone',
    }));
    // console.log('i run ...');
    // return;
    setAudioMessage(prevState => ({
      ...prevState,
      record: false,
      recorded: false,
      renderPlay: false,
      uri: '',
    }));
    console.log('i run ...');
    sendMsg();
  };
  return (
    <View style={styles.container}>
      {/* <Text
        style={{color: '#fff'}}
        onPress={() => setMessage({...message, type: 'voice'})}>
        change to Voice
      </Text>
      <Text
        style={{color: '#fff'}}
        onPress={() => setMessage({...message, type: 'text'})}>
        change to text
      </Text>
      <Text style={{color: '#fff'}}>{JSON.stringify(message)}</Text> */}
      <View style={styles.chatInput}>
        {message.type == 'initial' || message.type == 'text' ? (
          <>
            <View style={styles.textInput}>
              <TextInput
                placeholder="Say hello ..."
                placeholderTextColor={colors.body_text}
                style={styles.input}
                value={message.content}
                onChangeText={text => {
                  if (text.length < 1) {
                    setMessage((prevState: any) => ({
                      ...prevState,
                      content: text,
                      icon: 'microphone',
                    }));
                    return;
                  }
                  setMessage((prevState: any) => ({
                    ...prevState,
                    type: 'text',
                    icon: 'send',
                    content: text,
                  }));
                }}
              />
              <Icon name="camera" size={25} color={colors.body_text} />
            </View>
            <TouchableOpacity
              style={styles.voiceBtn}
              onPress={() => {
                if (message.type == 'text') {
                  resetParentMessage();
                } else {
                  recordVoice();
                }
              }}>
              <Icon
                name={message.icon}
                size={25}
                color={colors.complimentary}
              />
            </TouchableOpacity>
          </>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
            }}>
            {audioMessage.recorded && (
              <TouchableOpacity onPress={deleteVoice}>
                <Icon name="trash-can" size={27} color={colors.complimentary} />
              </TouchableOpacity>
            )}
            {audioMessage.recorded && (
              <View style={styles.messageView}>
                {audioMessage.renderPlay ? (
                  <TouchableOpacity onPress={onStartPlay}>
                    <Icon
                      name={audioMessage.played ? 'pause' : 'play'}
                      size={27}
                      color={colors.accent}
                    />
                  </TouchableOpacity>
                ) : (
                  <Text style={[appStyles.paragraph1, {marginLeft: 5}]}>
                    {recordTime}
                  </Text>
                )}
                {audioMessage.recorded && (
                  <>
                    <View style={{width: '70%', padding: 13}}>
                      <View style={styles.waveForm}>
                        <Svg height="18" width="100%">
                          <Polyline
                            points={audioData
                              .map(
                                (value, index) => `${index * 5},${18 - value}`,
                              )
                              .join(' ')}
                            fill="none"
                            stroke={colors.accent}
                            strokeWidth="2"
                          />
                        </Svg>
                      </View>
                    </View>
                    {!audioMessage.record && <Text>{playTime}</Text>}
                  </>
                )}
              </View>
            )}
            <TouchableOpacity
              style={styles.voiceBtn}
              onPress={() => {
                if (message.type == 'text') {
                  sendVoiceMessage();
                } else {
                  recordVoice();
                }
              }}>
              <Icon
                name={message.icon}
                size={25}
                color={colors.complimentary}
              />
            </TouchableOpacity>
            {audioMessage.recorded && (
              <TouchableOpacity
                onPress={sendVoiceMessage}
                style={[styles.voiceBtn]}>
                <Icon name={'send'} size={25} color={colors.complimentary} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    // backgroundColor: colors.LG,
    justifyContent: 'center',
    alignItems: 'center',
    // padding: 30,
  },
  waveForm: {
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseBtn: {
    width: 35,
    height: 35,
    borderColor: colors.accent,
    alignItems: 'center',
    borderRadius: 20,
    justifyContent: 'center',
  },
  messageView: {
    width: '70%',
    flexDirection: 'row',
    backgroundColor: colors.complimentary,
    alignItems: 'center',
    borderRadius: 40,
  },
  chatInput: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    // alignSelf: 'center',
    width: '99%',
  },
  voiceBtn: {
    width: 35,
    marginLeft: 10,
    height: 35,
    borderRadius: 20,
    backgroundColor: colors.accent,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    padding: 16,
    borderRadius: 40,
    color: colors.complimentary,
  },
  textInput: {
    flexDirection: 'row',
    width: '86%',
    alignItems: 'center',
    backgroundColor: '#685670',
    borderRadius: 40,
    paddingLeft: 10,
  },
  // voiceBtn: {marginLeft: 20, flexDirection: 'row', alignItems: 'center'},
});
