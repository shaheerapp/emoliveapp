import {colors} from '../../../../../styles/colors';
import {Platform, StyleSheet, Dimensions} from 'react-native';
import appStyles from '../../../../../styles/styles';
const deviceHeight = Dimensions.get('window').height;
export const singleStyles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  guest: {
    width: '40%',
    alignSelf: 'flex-end',
    position: 'absolute',
    top: 150,
  },
  avatar: {
    alignItems: 'center',
    height: deviceHeight * 0.5,
    justifyContent: 'center',
    width: '80%',
  },
  screen1: {
    marginBottom: 10,
    backgroundColor: 'black',
    height: deviceHeight * 0.15,
    borderColor: colors.yellow,
    borderWidth: 5,
    borderRadius: 5,
  },
  videoView: {
    width: '100%',
    flex: 1,
    height: '100%',
    backgroundColor: 'red',
  },
  control: {
    alignItems: 'center',
    top: 60,
    left: 20,
    position: 'absolute',
  },
  userTxt: {
    position: 'absolute',
    bottom: 10,
    textAlign: 'center',
    alignSelf: 'center',
    color: colors.complimentary,
  },
  offCam: {
    position: 'absolute',
    right: 5,
    bottom: 3,
  },
  otherCam: {position: 'absolute', right: 5, top: 3},
  audioInputBtn: {position: 'absolute', left: 2, top: 3},
});
