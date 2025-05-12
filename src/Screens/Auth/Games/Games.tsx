import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React from 'react';
import {colors} from '../../../styles/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import appStyles from '../../../styles/styles';

export default function Games({navigation}) {
  return (
    <View style={styles.container}>
      {/* <Text>Games</Text> */}
      <View style={{padding: 10}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 20,
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('PlayCenter')}
            style={[styles.game, {marginLeft: 20}]}>
            <Image
              style={{width: 160, height: 150, borderRadius: 10}}
              source={require('../../../assets/images/games/teenpatti.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('PlayCenter')}
            style={styles.gameB}>
            {/* <Lucky style={{marginTop: 40}} width={65} height={59} /> */}
            <Text style={styles.gameName}>Lucky 77</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 20,
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            style={styles.gameB}
            onPress={() => navigation.navigate('PlayCenter')}>
            <Text style={styles.gameName}>Greedy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('PlayCenter')}
            style={styles.gameB}>
            <Text style={styles.gameName}>Roulette</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: colors.dark_gradient,
    // padding: 16,
  },
  heading: {
    ...appStyles.headline,
    color: colors.complimentary,
    textAlign: 'center',
  },
  game: {
    borderWidth: 1,
    borderColor: colors.body_text,
    // justifyContent: 'center',
    borderRadius: 20,
    alignItems: 'center',
    width: '30%',
  },
  gameB: {
    borderWidth: 1,
    borderColor: colors.body_text,
    // justifyContent: 'center',
    borderRadius: 20,
    height: 150,
    alignItems: 'center',
    width: 160,
    // flexDirection
  },
  gameName: {
    ...appStyles.paragraph1,
    color: colors.complimentary,
    marginVertical: 20,
    // alignSelf: 'flex-end',
    // textAlign
    // alignSelf: 'flex-start',
  },
});
