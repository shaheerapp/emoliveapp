import {View, Text, TouchableOpacity, Modal} from 'react-native';
import React from 'react';
import {chatStyles} from '../styles/chat';
import {appStyles} from '../../Tabs/Podcast/podcastImport';
import {colors} from '../../../../../styles/colors';

interface ChatModalProps {
  modalInfo: any;
  setModalInfo: any;
}
export default function ChatModal({modalInfo, setModalInfo}: ChatModalProps) {
  const deleteMessage = () => {
    try {
    } catch (error) {}
  };

  const reportUser = () => {
    try {
    } catch (error) {}
  };
  return (
    <Modal
      visible={modalInfo.modal}
      transparent={true}
      animationType="slide"
      onRequestClose={() =>
        setModalInfo((prev: any) => ({...prev, modal: false}))
      }>
      {/* Backdrop */}
      <View style={chatStyles.backdrop}>
        {/* Modal Content */}
        <View style={chatStyles.modalView}>
          <Text style={[appStyles.title1, {color: colors.complimentary}]}>
            {modalInfo.type === 'delete'
              ? 'Delete Conversation'
              : 'Report a Problem'}
          </Text>
          <View style={{marginVertical: 20}}>
            <Text
              style={[
                appStyles.regularTxtMd,
                {color: colors.body_text, textAlign: 'center'},
              ]}>
              {modalInfo.type == 'delete'
                ? 'All Messages will be permanently deleted for yourself'
                : 'Nudity, indecent exposure fake profile etc.'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              setModalInfo((prevState: any) => ({
                ...prevState,
                modal: false,
              }))
            }
            style={[chatStyles.deleteButton]}>
            <Text style={chatStyles.deleteText}>
              {modalInfo.type == 'delete' ? 'Delete' : 'Report'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              setModalInfo((prevState: any) => ({
                ...prevState,
                modal: false,
              }))
            }
            style={chatStyles.cancelButton}>
            <Text style={[appStyles.paragraph1, {color: colors.unknown2}]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
