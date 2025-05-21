import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors } from '../../../styles/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import appStyles from '../../../styles/styles';
import useCurrentUser from '../../../hooks/useCurrentUser';
import { v4 as uuidv4 } from 'uuid';
import { useSelector } from 'react-redux';
import { useAppContext } from '../../../Context/AppContext';
import { generateCode } from '../../../Api/baishun';

interface Props {
  navigation: any;
  route: any;
}


const PlayCenter: React.FC<Props> = ({ navigation, route }) => {
  const { userAuthInfo, tokenMemo } = useAppContext();
  const { user } = userAuthInfo;
  const { game } = route.params;


  const handlePlay = async () => {
    try {
      const code = await generateCode(user.id);

      navigation.navigate('WebViewGame', {
        url: game.download_url,
        user: user,
        code: code,
      });
    } catch (err) {
      console.error('Failed to get code:', err);
      Alert.alert('Error', 'Unable to start game. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          // justifyContent: 'space-between',
          alignItems: 'center',
          justifyContent: 'center',
          width: '99%',
          marginTop: Platform.OS === 'ios' ? 60 : 15,
        }}>
        <View style={{ width: '38%' }} />
        <View
          style={{
            width: '62%',

            alignSelf: 'center',
            flexDirection: 'row',
            // justifyContent:"center",
            justifyContent: 'space-between',
          }}>
          <Text style={styles.heading}>Play Center</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="close" size={24} color={colors.complimentary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 40 }}>
        <TouchableOpacity style={styles.game}
          onPress={handlePlay}
        >
          <Image source={{ uri: game.preview_url }} style={{ width: 60, height: 60, marginTop: 20 }} />
          <Text style={styles.gameName}>Play {game.name}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.game} onPress={() => navigation.navigate('ScoreCard', { gameId: game.game_id })}>
          <Image source={require('../../../assets/images/games/bag.png')} style={{ width: 60, height: 60, marginTop: 20 }} />
          <Text style={styles.gameName}>View Scores</Text>
        </TouchableOpacity>
      </View>
      {/* <Text>ScoreCard</Text> */}
    </View>
  );
};

export default PlayCenter;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark_gradient,
    padding: 16,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '99%',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: colors.lines,
    paddingRight: 10,
    paddingBottom: 15,
    marginVertical: 10,
  },
  heading: {
    ...appStyles.headline,
    color: colors.complimentary,
    textAlign: 'center',
  },
  playerScore: {
    backgroundColor: colors.complimentary,
    // scoreSection,
    paddingVertical: 5,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  sheetCategory: {
    width: '20%',
    borderRadius: 18,
    // backgroundColor: 'red',
  },
  sheetCategoryTxt: {
    ...appStyles.smallM,
    color: colors.complimentary,
    textAlign: 'center',
  },
  catText: {
    ...appStyles.small,
    color: colors.complimentary,
  },
  scoreHead: {
    backgroundColor: colors.dominant,
    // borderRadius: 30,
    borderTopRightRadius: 6,
    borderTopLeftRadius: 6,
    paddingVertical: 5,
  },
  scoreSection: {
    paddingVertical: 5,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.store,
    backgroundColor: colors.complimentary,
  },
  score: {
    ...appStyles.smallM,
    color: colors.body_text,
    textAlign: 'center',
  },
  icon: {
    width: '50%',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 16,
  },
  game: {
    borderWidth: 1,
    borderColor: colors.body_text,
    justifyContent: 'center',
    borderRadius: 20,
    alignItems: 'center',
    width: '45%',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: colors.golden,
  },
  gameName: {
    ...appStyles.paragraph1,
    color: colors.complimentary,
    marginVertical: 20,
  },
  profile: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  btn: {
    marginRight: 10,
    backgroundColor: colors.lines,
    height: 40,
    width: 90,
    alignItems: 'center',
    justifyContent: 'center',
    // paddingVertical: 5,
    borderRadius: 8,
  },
  btnText: {
    textAlign: 'center',
    color: colors.complimentary,
    ...appStyles.bodyMd,
  },
});
