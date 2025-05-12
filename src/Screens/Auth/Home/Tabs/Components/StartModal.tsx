import {
  View,
  Text,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useState} from 'react';
import appStyles from '../../../../../styles/styles';
import {colors} from '../../../../../styles/colors';
import {useDispatch, useSelector} from 'react-redux';
import {setLiveForm} from '../../../../../store/slice/usersSlice';
interface StartModalProps {
  navigation: any;
  modal: boolean;
  setModal: any;
}

export default function StartModal({
  navigation,
  modal,
  setModal,
}: StartModalProps) {
  const dispatch = useDispatch();
  const {liveForm} = useSelector((state: any) => state.users);

  const startLiveTransmission = async () => {
    if (!validations()) return;
    setModal(false);
    navigation.navigate('GoLive2');
  };

  const validations = () => {
    let valid = false;
    if (!liveForm.liveType)
      return Alert.alert('error', 'Please click live type is required..');
    if (!liveForm.title) return Alert.alert('error', 'Title is required');
    if (!liveForm.duration) return Alert.alert('error', 'Duration is required');
    // if (!liveForm.listeners)
    //   return Alert.alert('error', 'Listeners is required');
    return true;
  };
  const cancelLeave = () => {
    try {
    } catch (error) {}
  };
  return (
    <View>
      <Modal
        visible={modal}
        transparent={true}
        animationType="slide"
        onRequestClose={cancelLeave}>
        {/* Backdrop */}
        <View style={styles.backdrop}>
          {/* Modal Content */}

          <View style={styles.modalView}>
            <Text
              style={[
                appStyles.title1,
                {color: colors.complimentary, textAlign: 'center'},
              ]}>
              {liveForm.liveType == 'video' ? 'Live Streaming' : 'Podcast'}
            </Text>
            <View style={{marginVertical: 10}}>
              <View>
                <Text style={styles.label}>Title:</Text>
                <TextInput
                  style={styles.inputBox}
                  value={liveForm.title}
                  autoCapitalize="none"
                  keyboardType="default"
                  onChangeText={(e: any) => dispatch(setLiveForm({title: e}))}
                  placeholder="title of live ...."
                  placeholderTextColor={colors.body_text}
                />
              </View>
              <View style={{marginVertical: 10}}>
                <Text style={styles.label}>Duration:</Text>
                <TextInput
                  style={styles.inputBox}
                  value={liveForm.duration}
                  autoCapitalize="none"
                  // maxLength={2}
                  maxLength={3}
                  keyboardType="number-pad"
                  onChangeText={(e: any) => {
                    dispatch(setLiveForm({field: 'duration', value: e}));
                  }}
                  placeholder="duration in minutes ...."
                  placeholderTextColor={colors.body_text}
                />
              </View>
              <View>
                <Text style={styles.label}>Podcast Type:</Text>
                <View
                  style={{
                    marginTop: 10,
                    flexDirection: 'row',
                    width: '99%',
                    paddingRight: 10,
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() =>
                      dispatch(setLiveForm({field: 'type', value: 'PRIVATE'}))
                    }
                    style={[
                      styles.genderBtn,
                      liveForm.type == 'PRIVATE' && {
                        backgroundColor: '#64566e',
                      },
                      styles.leftBtn,
                    ]}>
                    <Text style={styles.genderTxt}>PRIVATE</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      dispatch(setLiveForm({field: 'type', value: 'PUBLIC'}))
                    }
                    style={[
                      styles.genderBtn,
                      liveForm.type == 'PUBLIC' && {
                        backgroundColor: '#64566e',
                      },
                      styles.rightBtn,
                    ]}>
                    <Text style={styles.genderTxt}>PUBLIC</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={{alignItems: 'center', marginTop: 20}}>
              <TouchableOpacity
                onPress={startLiveTransmission}
                style={[styles.deleteButton]}>
                <Text style={styles.deleteText}>Start</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModal(false)}
                style={styles.cancelButton}>
                <Text style={[appStyles.paragraph1, {color: colors.unknown2}]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
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
    // alignItems: 'center',
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
  genderBtn: {
    borderColor: 'grey',
    justifyContent: 'center',
    padding: 15,
    width: '52%',
  },
  genderTxt: {
    color: '#fff',
    textAlign: 'center',
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
    marginTop: 5,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.accent,
  },
  rightBtn: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderTopEndRadius: 10,
    borderBottomEndRadius: 10,
  },
  leftBtn: {
    borderWidth: 1,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  label: {
    ...appStyles.paragraph1,
    color: colors.complimentary,
    marginTop: 10,
  },
  inputBox: {
    marginTop: 5,
    borderColor: colors.complimentary,
    borderWidth: 1,
    // width: '100%',
    color: colors.complimentary,
    padding: 12,
    borderRadius: 4,
  },
});
