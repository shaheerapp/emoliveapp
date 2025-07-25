import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';
import envVar from '../config/envVar';

const SCREEN_WIDTH = Dimensions.get('window').width;

const WinnerBanner = ({ userImage, username, userId, amount, token }: any) => {
  const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;

  useEffect(() => {
    // Slide in
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Slide out after 3 seconds
    const timeout = setTimeout(() => {
      Animated.timing(slideAnim, {
        toValue: -SCREEN_WIDTH,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
      <ImageBackground
        source={require('../assets/images/banners/game-winner-banner.png')}
        style={styles.banner}
        resizeMode="cover"
        imageStyle={{ borderRadius: 10 }}
      >
        <Image
          source={
            userImage
              ? {
                  uri: `${envVar.API_URL}display-avatar/${userId}`,
                  headers: { Authorization: `Bearer ${token}` },
                }
              : require('../assets/images/place.jpg')
          }
          style={styles.avatar}
        />

        <View style={styles.textContainer}>
          <Text style={styles.text}>
            🥳 <Text style={styles.username}>{username}</Text> WON{' '}
            <Text style={styles.amount}>{amount.toLocaleString()}</Text> 🎉
          </Text>
        </View>

        <Image
          source={require('../assets/svg/diamond.svg')}
          style={styles.coins}
        />
      </ImageBackground>
    </Animated.View>
  );
};

export default WinnerBanner;

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 80,
    left: 10,
    right: 10,
    height: 120,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Add this to properly space elements
    paddingHorizontal: 20, // Increased padding for better spacing
    elevation: 5,
    zIndex: 999,
    overflow: 'hidden', // Ensure content stays within rounded corners
  },
  avatar: {
    width: 50, // Slightly larger for better visibility
    height: 50,
    borderRadius: 25,
    borderColor: '#FFD700',
    borderWidth: 2,
    marginRight: 8,
    marginLeft: 10,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column', // Stack text vertically
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center', // Center text
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  username: {
    color: '#FFEB3B',
    fontWeight: '900',
    fontSize: 16,
  },
  amount: {
    color: '#00FFAA',
    fontWeight: '900',
    fontSize: 18,
  },
  coins: {
    width: 40,
    height: 40,
    marginLeft: 15,
  },
});
