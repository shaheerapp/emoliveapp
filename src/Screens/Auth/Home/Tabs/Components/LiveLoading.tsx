import {View, Text, Modal, ActivityIndicator, StyleSheet} from 'react-native';
import React from 'react';
import {colors} from '../../../../../styles/colors';
import appStyles from '../../../../../styles/styles';
import {useSelector} from 'react-redux';

export default function LiveLoading() {
  const {liveStatus} = useSelector((state: any) => state.users);
  return (
    <View>
      <Modal
        visible={liveStatus == 'LOADING' ? true : false}
        transparent={true}
        animationType="slide">
        {/* Backdrop */}
        <View style={styles.backdrop}>
          {/* Modal Content */}

          <View style={styles.modalView}>
            <View>
              <Text
                style={[appStyles.headline2, {color: colors.complimentary}]}>
                Please Wait Connecting ...
              </Text>
              <ActivityIndicator
                style={{marginTop: 30}}
                animating={true}
                size={'large'}
                color={'#fff'}
              />
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
    height: 150,
    backgroundColor: colors.LG,
    alignSelf: 'center',
    width: '90%',
    justifyContent: 'center',

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
    borderRadius: 12,
  },
});
