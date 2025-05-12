import AudioRecorderPlayer from 'react-native-audio-recorder-player';

class AudioService {
  static instance = null;

  constructor() {
    if (!AudioService.instance) {
      this.audioRecorderPlayer = new AudioRecorderPlayer();
      AudioService.instance = this;
    }
    return AudioService.instance;
  }
  startRecording = async () => {
    try {
      const result = await this.audioRecorderPlayer.startRecorder();
      console.log('Recording uri :', result);
      return result;
    } catch (error) {
      console.log('Error starting recording :', error);
    }
  };

  stopRecording = async () => {
    try {
      const result = await this.audioRecorderPlayer.stopRecorder();
      console.log('Recoding stopped:', result);
    } catch (error) {
      console.log('error stopping recording:', error);
    }
  };
  startPlaying = async uri => {
    try {
      const result = await this.audioRecorderPlayer.startPlayer(uri);
      console.log('Playing started at:', result);
    } catch (error) {
      console.log('Error playing audio:', error);
    }
  };
  stopPlaying = async () => {
    try {
      const result = await this.audioRecorderPlayer.stopPlayer();
      console.log(result);
    } catch (error) {
      console.log('Error stopping recording', error);
    }
  };
  mmss = sec => {
    const seconds = this.audioRecorderPlayer.mmss(sec);
    return seconds;
  };
}
const audioService = new AudioService();
export default audioService;
