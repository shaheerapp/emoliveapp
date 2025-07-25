import {StyleSheet, Platform} from 'react-native';
import {colors} from '../../../../../styles/colors';
import appStyles from '../../../../../styles/styles';
export const chatStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark_gradient,
    padding: 16,
  },
  user: {
    color: colors.complimentary,
    ...appStyles.headline2,
  },
  userStatus: {
    color: colors.body_text,
    ...appStyles.regularTxtRg,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Custom RGBA backdrop color
    justifyContent: 'center',
    alignItems: 'center',
    // alignSelf: 'center',
  },
  modalView: {
    // width: 300,
    padding: 20,
    backgroundColor: colors.LG,
    alignSelf: 'center',
    width: '90%',
    // minWidth
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderRadius: 26,
  },
  mineMessage: {
    width: '90%',
    alignSelf: 'flex-end',
  },
  myMessageBody: {
    marginTop: 20,
    // marginVertical: 30,
    backgroundColor: colors.semantic,
    padding: 16,
    borderStartEndRadius: 16,
    borderStartStartRadius: 16,
    // borderEndEndRadius: 16,
    borderEndStartRadius: 16,
  },
  modalBody: {
    marginBottom: 20,
  },
  messageTime: {
    ...appStyles.smallTxt,
    color: '#7B8095',
    marginTop: 10,
    // marginTop: -15,
    textAlign: 'right',
  },
  centeredView: {
    flex: 1,
    // backgroundColor: 'red',
    opacity: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waveForm: {
    height: 10,
    width: '80%',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '99%',
    marginTop: Platform.OS == 'ios' ? 50 : 0,
  },
  deleteButton: {
    backgroundColor: colors.accent,
    padding: 16,
    borderRadius: 12,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  deleteText: {
    color: colors.offwhite,
    ...appStyles.paragraph1,
  },
  cancelButton: {
    padding: 16,
  },
  myMessage: {
    position: 'relative',
    marginVertical: 10,
    backgroundColor: colors.LG,
    width: '90%',
    padding: 20,
    borderEndEndRadius: 16,
    borderStartStartRadius: 16,
    borderEndStartRadius: 16,
  },
});
