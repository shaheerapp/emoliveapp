import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {GestureDetector, Gesture} from 'react-native-gesture-handler';

export default function MoveFunction() {
  const translateX = useSharedValue(0);

  // Define the swipe gesture
  const swipeGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationX < 0) {
        // Update position only when swiping left
        translateX.value = event.translationX;
      }
    })
    .onEnd(() => {
      // Animate back to original position if swipe doesn't pass threshold
      if (translateX.value < -100) {
        translateX.value = withTiming(-300); // Swipe out
      } else {
        translateX.value = withTiming(0); // Return to original
      }
    });

  // Animated style for the swipable element
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateX: translateX.value}],
  }));

  return (
    <View style={styles.container}>
      <GestureDetector gesture={swipeGesture}>
        <Animated.View style={[styles.box, animatedStyle]}>
          <Text style={styles.text}>Swipe Me Left</Text>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
  box: {
    width: 300,
    height: 100,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
