import {Platform, StyleSheet, Dimensions} from 'react-native';
import {colors} from '../../../../../../styles/colors';
const deviceHeight = Dimensions.get('window').height;
import {appStyles} from '../../Podcast/podcastImport';
const styles = StyleSheet.create({
  singleLive: {
    position: 'relative',
    alignSelf: 'center',
    width: '100%',
    bottom: Platform.OS == 'ios' ? deviceHeight * 0.385 : deviceHeight * 0.35,
    padding: 10,
    zIndex: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  messages: {
    // height: '30%',
    backgroundColor: 'red',
    // marginTop: 10,
  },

  sheetMessage: {
    position: 'relative',
    flexDirection: 'row',
    width: '95%',
    paddingHorizontal: 20,
    borderRadius: 4,
    paddingVertical: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  guest: {
    marginTop: 10,
    paddingVertical: 10,
    width: '95%',
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  list: {
    padding: 4,
    alignItems: 'center',
    flexDirection: 'row',
  },
  userJoin: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    backgroundColor: colors.yellow,
    borderRadius: 9,
  },
});
export default styles;
