import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  TextInput,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../styles/colors';
import appStyles from '../../styles/styles';
import Svg, {Polyline} from 'react-native-svg';

export default function Audio() {
  const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;

  const [audioData, setAudioData] = useState<any>([]);
  const [audioMessage, setAudioMessage] = useState({
    record: false,
    recorded: false,
    played: false,
    renderPlay: false,
    // audioData:[],
    uri: '',
    // recordTime:'',
    // playTime:
  });
  const [recordTime, setRecordTime] = useState<any>('12:00');
  const [playTime, setPlayTime] = useState('');

  useEffect(() => {
    return () => {
      audioRecorderPlayer.removePlayBackListener();
      audioRecorderPlayer.removeRecordBackListener();
    };
  }, []);

  const onStartPlay = async () => {
    try {
      if (audioMessage.played) {
        await audioRecorderPlayer.stopPlayer();
        onStopPlay();
        return;
      }
      const msg = await audioRecorderPlayer.startPlayer();
      console.log('Playing audio:', msg);

      audioRecorderPlayer.addPlayBackListener(e => {
        const waveform = processAudioData(e.currentPosition); // Simulated data
        setAudioData(waveform);

        const positionInSeconds = e.currentPosition / 1000;

        setPlayTime(audioRecorderPlayer.mmss(Math.floor(positionInSeconds)));

        if (e.currentPosition >= e.duration) {
          onStopPlay();
        }
      });

      setAudioMessage({...audioMessage, played: true});
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
        const result = await audioRecorderPlayer.stopRecorder();
        console.log(result, 'recording stopped');
        audioRecorderPlayer.removeRecordBackListener();
        setRecordTime('');
        setAudioMessage({...audioMessage, record: false, renderPlay: true});
        return;
      }
      console.log('a');
      const result = await audioRecorderPlayer.startRecorder();
      console.log('file uri ', result);

      audioRecorderPlayer.addRecordBackListener(e => {
        const waveform = processAudioData(e.currentPosition); // Simulated data
        setAudioData(waveform);
        const positionInSeconds = e.currentPosition / 1000;
        setRecordTime(audioRecorderPlayer.mmss(Math.floor(positionInSeconds)));
        // setRecordTime(
        //   audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
        // );
      });
      setAudioMessage({
        ...audioMessage,
        record: true,
        recorded: true,
        renderPlay: false,
        uri: result,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onStopPlay = async () => {
    await audioRecorderPlayer.stopPlayer();
    setAudioMessage({...audioMessage, played: false});

    // setAudioData([]);
  };

  const deleteVoice = async () => {
    try {
      await audioRecorderPlayer.stopRecorder();
      await audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removeRecordBackListener();
      audioRecorderPlayer.removePlayBackListener();
      setPlayTime('');
      setRecordTime('');
      setAudioData([]);
      setAudioMessage({
        ...audioMessage,
        record: false,
        recorded: false,
        renderPlay: false,
        uri: '',
      });

      // Optional: Delete file logic (if needed)
      console.log('Voice deleted');
    } catch (error) {
      console.error('Error deleting voice:', error);
    }
  };
  return (
    <View style={styles.container}>
      {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {audioMessage.recorded && (
          <TouchableOpacity onPress={deleteVoice}>
            <Icon name="trash-can" size={35} color={colors.complimentary} />
          </TouchableOpacity>
        )}

        {audioMessage.recorded && (
          <View style={styles.messageView}>
            {audioMessage.renderPlay ? (
              <TouchableOpacity onPress={onStartPlay}>
                <Icon
                  name={audioMessage.played ? 'pause' : 'play'}
                  size={35}
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
                <View style={{width: '70%', padding: 12}}>
                  <View style={styles.waveForm}>
                    <Svg height="18" width="100%">
                      <Polyline
                        points={audioData
                          .map((value, index) => `${index * 5},${18 - value}`)
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

        <View style={styles.voiceBtn}>
          <TouchableOpacity
            style={[styles.pauseBtn, audioMessage.record && {borderWidth: 1}]}
            onPress={recordVoice}>
            <Icon
              name={audioMessage.record ? 'pause' : 'microphone'}
              size={25}
              color={colors.complimentary}
            />
          </TouchableOpacity>
          <TouchableOpacity style={{marginLeft: 10}}>
            <Icon name="send" size={25} color={colors.complimentary} />
          </TouchableOpacity>
        </View>
      </View> */}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: colors.LG,
    justifyContent: 'center',
    alignItems: 'center',
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
  // voiceBtn: {marginLeft: 20, flexDirection: 'row', alignItems: 'center'},
});
