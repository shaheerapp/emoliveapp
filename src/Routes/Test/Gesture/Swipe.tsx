import React from 'react';
import {Text, StyleSheet,View} from 'react-native';

import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

function RightAction(prog: SharedValue<number>, drag: SharedValue<number>) {
  const styleAnimation = useAnimatedStyle(() => {
    console.log('showRightProgress:', prog.value);
    console.log('appliedTranslation:', drag.value);

    return {
      transform: [{translateX: drag.value + 50}],
    };
  });

  return (
    <Reanimated.View style={styleAnimation}>
      <Text style={styles.rightAction}>Text</Text>

    </Reanimated.View>
  );
}

export default function SwipeImran() {
  return (
    <ReanimatedSwipeable
      containerStyle={styles.swipeable}
      friction={1}
      enableTrackpadTwoFingerGesture
      rightThreshold={40}
      renderRightActions={RightAction}
      renderLeftActions={}
      >
      <Text>Swipe me!</Text>
    </ReanimatedSwipeable>
  );
}

const styles = StyleSheet.create({
  rightAction: {width: 50, height: 50, backgroundColor: 'purple'},
  separator: {
    width: '100%',
    borderTopWidth: 1,
  },
  swipeable: {
    height: 50,
    marginTop: 60,
    backgroundColor: 'papayawhip',
    alignItems: 'center',
  },
});
