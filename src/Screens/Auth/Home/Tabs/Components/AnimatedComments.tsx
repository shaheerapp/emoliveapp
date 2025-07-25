import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  Text,
  Image,
  ImageBackground,
} from 'react-native';
import { colors } from '../../../../../styles/colors';
import { LEVELIMAGES } from '../../../../../assets/levelImages';

const AnimatedComment = ({
  message,
  name,
}: {
  message: string;
  name: string;
}) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Slide in from right and fade in
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const slideInterpolate = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateX: slideInterpolate }],
          marginBottom: 8, // Add some spacing between comments
        },
      ]}
    >
      <View style={styles.wrapper}>
        <ImageBackground style={styles.iconContainer} source={LEVELIMAGES.lvl5}>
          <View style={styles.imageWrapper}>
            <Image source={LEVELIMAGES.icon10} style={styles.iconImage} />
          </View>
          <Text style={styles.countText}>5</Text>
        </ImageBackground>

        <Text style={[styles.nameText, { color: colors.complimentary }]}>
          {name}
        </Text>
      </View>

      <Text style={[styles.messageText, { color: colors.complimentary }]}>
        {message}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.41)',
    marginHorizontal: 8,
    width: '90%',
    alignSelf: 'center',
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  messageText: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 38, // Match icon width + margin
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: 30,
    width: 50,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  imageWrapper: {
    height: 20,
    width: 20,
    backgroundColor: colors.white,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    height: 20,
    width: 20,
  },
  countText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
    marginRight: 10,
  },
});

export default AnimatedComment;
