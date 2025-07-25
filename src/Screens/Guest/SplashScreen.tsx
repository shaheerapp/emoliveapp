import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from 'react-native';
import React from 'react';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <ImageBackground
        //   blurRadius=
        style={styles.image}
        source={require('../../assets/images/parts/Splash.png')}>
        <View
          style={{
            flex: 1,
            // backgroundColor: 'rgba(255, 0, 0, 0.5)',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              height: '60%',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
            }}></View>
          <View
            style={{
              height: '40%',
              //   borderT
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
            }}>
            <View style={{width: '60%', alignSelf: 'center'}}>
              <Text style={styles.heading}>Emo Live</Text>
              <View>
                <Text style={styles.subText}>
                  Unlimited Live streams and live concerts
                </Text>
              </View>
            </View>

            <View style={{marginTop: 50}}>
              <View style={styles.loader}>
                <View
                  style={{
                    backgroundColor: 'red',
                    borderRadius: 10,
                    height: 20,
                    width: '60%',
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    // display: 'flex',
    // justifyContent: 'space-around',
  },
  heading: {
    fontSize: 26,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  subText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#fff',
    marginTop: 40,
    textAlign: 'center',
  },
  loader: {
    backgroundColor: 'black',
    borderRadius: 10,
    width: '100%',
    height: 20,
  },
});
