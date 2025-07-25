import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import {colors} from '../../../styles/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import appStyles from '../../../styles/styles';
import Cards from '../../../assets/svg/games/cards.svg';
import Greedy from '../../../assets/svg/games/greedy.svg';
import Frame from '../../../assets/svg/games/frame.svg';
import Lucky from '../../../assets/svg/games/lucky.svg';
import Roulette from '../../../assets/svg/games/Roulette.svg';
import CardGp from '../../../assets/svg/games/cardGp.svg';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';

export default function ScoreCard({navigation}) {
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Function to handle open Bottom Sheet
  const handleOpenSheet = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);
  // callbacks
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          width: '99%',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: Platform.OS == 'ios' ? 50 : 40,
        }}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="close" size={24} color={colors.complimentary} />
          </TouchableOpacity>
          <Text style={styles.heading}>Emo Live</Text>
        </View>
        <TouchableOpacity
          style={{
            paddingHorizontal: 20,
            paddingVertical: 8,
            borderRadius: 12,
            backgroundColor: colors.lines,
          }}>
          <Text style={[appStyles.regularTxtMd, {color: colors.complimentary}]}>
            Close
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          marginTop: 50,
        }}>
        <View style={{alignSelf: 'flex-end', marginRight: 40}}>
          <Image
            style={{height: 80, width: 60}}
            source={require('../../../assets/images/games/chair.png')}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 20,
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
          <View style={styles.column}>
            <Text style={styles.category}>A</Text>
            <TouchableOpacity style={styles.resultBtn}>
              <Text style={styles.category}>Fail</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.resultBtn, {backgroundColor: colors.accent}]}>
              <Text style={styles.category}>Pass</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.resultBtn, {backgroundColor: colors.accent}]}>
              <Text style={styles.category}>Pass</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resultBtn}>
              <Text style={styles.category}>Fail</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.resultBtn, {backgroundColor: colors.accent}]}>
              <Text style={styles.category}>Pass</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resultBtn}>
              <Text style={styles.category}>Fail</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.column}>
            <Text style={styles.category}>B</Text>
            <TouchableOpacity style={styles.resultBtn}>
              <Text style={styles.category}>Fail</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.resultBtn, {backgroundColor: colors.accent}]}>
              <Text style={styles.category}>Pass</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resultBtn}>
              <Text style={styles.category}>Fail</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.resultBtn, {backgroundColor: colors.accent}]}>
              <Text style={styles.category}>Pass</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resultBtn}>
              <Text style={styles.category}>Fail</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.resultBtn, {backgroundColor: colors.accent}]}>
              <Text style={styles.category}>Pass</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.column}>
            <Text style={styles.category}>C</Text>
            <TouchableOpacity style={styles.resultBtn}>
              <Text style={styles.category}>Fail</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resultBtn}>
              <Text style={styles.category}>Fail</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.resultBtn, {backgroundColor: colors.accent}]}>
              <Text style={[styles.category]}>Pass</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.resultBtn, {backgroundColor: colors.accent}]}>
              <Text style={styles.category}>Pass</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resultBtn}>
              <Text style={styles.category}>Fail</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resultBtn}>
              <Text style={styles.category}>Fail</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
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
    marginLeft: 30,
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
  resultBtn: {
    backgroundColor: colors.lines,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    borderRadius: 30,
    marginVertical: 15,
    // backgroundColor: 'red',
  },
  column: {justifyContent: 'center', alignItems: 'center'},
  catText: {
    ...appStyles.small,
    color: colors.complimentary,
  },
  category: {
    color: colors.complimentary,
    ...appStyles.regularTxtMd,
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
