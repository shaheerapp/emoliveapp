import {StyleSheet} from 'react-native';
import {colors} from '../../../../../styles/colors';
// import appStyles from '../../../../styles/styles';
import appStyles from '../../../../../styles/styles';

const mainStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.LG,
  },
  count: {
    ...appStyles.bodyMd,
    marginRight: 30,
    color: colors.complimentary,
  },

  countLeft: {
    marginLeft: 12,
    ...appStyles.bodyMd,
    color: colors.complimentary,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: colors.LG,
  },
  winLeft: {
    position: 'absolute',
    left: 15,
    top: 15,
    paddingHorizontal: 15,
    paddingVertical: 3,
    backgroundColor: '#756B61',
    borderRadius: 10,
  },
  winRight: {
    position: 'absolute',
    right: 15,
    top: 15,
    paddingHorizontal: 15,
    paddingVertical: 3,
    backgroundColor: '#756B61',
    borderRadius: 10,
  },

  duration: {
    backgroundColor: '#36332e',
    width: '40%',
    alignSelf: 'center',
    // top: ,
    padding: 2,
    alignItems: 'center',
    position: 'absolute',
    borderBottomEndRadius: 12,
    zIndex: 3,
    borderBottomStartRadius: 12,
  },
});
export default mainStyles;
