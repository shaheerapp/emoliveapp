import {View, Text, Image, StyleSheet} from 'react-native';
import React from 'react';

export default function SupportViewers() {
  return (
    <View>
      <View
        style={{
          backgroundColor: '#251444',
          height: 60,
          width: '100%',
          // Shadow for iOS
          shadowColor: '#000', // Shadow color
          shadowOffset: {width: 0, height: 2}, // Shadow offset (x, y)
          shadowOpacity: 0.2, // Shadow opacity
          shadowRadius: 4, // Shadow blur radius

          // Shadow for Android
          elevation: 5, // Elevation for Android
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 5,
            paddingTop: 5,
          }}>
          <View style={{flexDirection: 'row'}}>
            <Image
              style={styles.liveViewerLeft}
              source={require('../../../../../assets/images/live/girl2.jpg')}
            />
            <Image
              source={require('../../../../../assets/images/live/girl6.jpg')}
              style={styles.liveViewerLeft}
            />
            <Image
              source={require('../../../../../assets/images/live/girl7.jpg')}
              style={styles.liveViewerLeft}
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            <Image
              style={styles.liveViewerRight}
              source={require('../../../../../assets/images/live/girl2.jpg')}
            />
            <Image
              source={require('../../../../../assets/images/live/girl6.jpg')}
              style={styles.liveViewerRight}
            />
            <Image
              source={require('../../../../../assets/images/live/girl7.jpg')}
              style={styles.liveViewerRight}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  liveViewerLeft: {
    height: 30,
    width: 30,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: '#BEC8C5',
  },

  liveViewerRight: {
    height: 30,
    width: 30,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#CDAB6C',
  },
});
