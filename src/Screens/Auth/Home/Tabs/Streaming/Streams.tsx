import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
// import { Colors } from 'react-native/Libraries/NewAppScreen';
import {colors} from '../../../../../styles/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import appStyles from '../../../../../styles/styles';
import {RtcSurfaceView} from 'react-native-agora';

export default function Streams({item}) {
  return (
    <View style={styles.hostView}>
      {item.user ? (
        <>
          <React.Fragment key={item.user.id}>
            <RtcSurfaceView
              canvas={{
                uid: item.user.id,
                // sourceType: VideoSourceType.VideoSourceRemote,
              }}
              style={styles.videoView}
            />
          </React.Fragment>
          <Text style={styles.userTxt}>
            {' '}
            {item.user.first_name + ' ' + item.user.last_name} {item.user.id}
          </Text>
        </>
      ) : (
        <View style={{alignItems: 'center'}}>
          <TouchableOpacity>
            <Icon name="sofa-single" color={'#CDC6CE'} size={60} />
            <Text style={[appStyles.bodyMd, {color: colors.complimentary}]}>
              Apply to join
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  hostView: {
    flex: 0.3,
    aspectRatio: 1, // Ensure each host view is square
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Transparent white
    // backgroundColor: '#98347E',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  videoView: {
    width: '100%',
    flex: 1,
    height: '100%',
    backgroundColor: 'red',
  },
  userTxt: {
    position: 'absolute',
    bottom: 10,
    textAlign: 'center',
    alignSelf: 'center',
    color: colors.complimentary,
  },
});
