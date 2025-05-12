import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import appStyles from '../../../../../styles/styles';
import React from 'react';
import {colors} from '../../../../../styles/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconM from 'react-native-vector-icons/MaterialIcons';

export default function Tools() {
  return (
    <View>
      <Text
        style={[
          appStyles.headline,
          {
            color: colors.complimentary,
            textAlign: 'center',
            marginVertical: 20,
          },
        ]}>
        Tools
      </Text>
      <View style={{borderTopColor: '#fff', borderTopWidth: 1}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            marginTop: 20,
          }}>
          <View>
            <TouchableOpacity style={styles.toolBtn}>
              <Icon name="email" size={32} color={colors.complimentary} />
            </TouchableOpacity>
            <Text
              style={[
                appStyles.regularTxtRg,
                {
                  color: colors.complimentary,
                  textAlign: 'center',
                  marginTop: 10,
                },
              ]}>
              Inbox
            </Text>
          </View>
          <View>
            <TouchableOpacity style={styles.toolBtn}>
              <Icon
                name="share-variant"
                size={32}
                color={colors.complimentary}
              />
            </TouchableOpacity>
            <Text
              style={[
                appStyles.regularTxtRg,
                {
                  color: colors.complimentary,
                  textAlign: 'center',
                  marginTop: 10,
                },
              ]}>
              Games
            </Text>
          </View>
          <View>
            <TouchableOpacity style={styles.toolBtn}>
              <Icon
                name="gamepad-variant"
                size={32}
                color={colors.complimentary}
              />
            </TouchableOpacity>
            <Text
              style={[
                appStyles.regularTxtRg,
                {
                  color: colors.complimentary,
                  textAlign: 'center',
                  marginTop: 10,
                },
              ]}>
              Games 2
            </Text>
          </View>

          <View>
            <TouchableOpacity style={styles.toolBtn}>
              <Icon
                name="gamepad-variant"
                size={32}
                color={colors.complimentary}
              />
            </TouchableOpacity>
            <Text
              style={[
                appStyles.regularTxtRg,
                {
                  color: colors.complimentary,
                  textAlign: 'center',
                  marginTop: 10,
                },
              ]}>
              Room Skin
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            marginVertical: 10,
          }}>
          <View>
            <TouchableOpacity style={styles.toolBtn}>
              <Icon
                name="google-classroom"
                size={32}
                color={colors.complimentary}
              />
            </TouchableOpacity>
            <Text
              style={[
                appStyles.regularTxtRg,
                {
                  color: colors.complimentary,
                  textAlign: 'center',
                  marginTop: 10,
                },
              ]}>
              Room Skin
            </Text>
          </View>
          <View>
            <TouchableOpacity style={styles.toolBtn}>
              <Icon name="music-note" size={32} color={colors.complimentary} />
            </TouchableOpacity>
            <Text
              style={[
                appStyles.regularTxtRg,
                {
                  color: colors.complimentary,
                  textAlign: 'center',
                  marginTop: 10,
                },
              ]}>
              Music
            </Text>
          </View>
          <View>
            <TouchableOpacity style={styles.toolBtn}>
              <Icon name="volume-high" size={32} color={colors.complimentary} />
            </TouchableOpacity>
            <Text
              style={[
                appStyles.regularTxtRg,
                {
                  color: colors.complimentary,
                  textAlign: 'center',
                  marginTop: 10,
                },
              ]}>
              Speaker
            </Text>
          </View>
          <View>
            <TouchableOpacity style={styles.toolBtn}>
              <Icon
                name="block-helper"
                size={32}
                color={colors.complimentary}
              />
            </TouchableOpacity>
            <Text
              style={[
                appStyles.regularTxtRg,
                {
                  color: colors.complimentary,
                  textAlign: 'center',
                  marginTop: 10,
                },
              ]}>
              BlockList
            </Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', marginLeft: 10}}>
          <View>
            <TouchableOpacity style={styles.toolBtn}>
              <IconM
                name="warning-amber"
                size={32}
                color={colors.complimentary}
              />
            </TouchableOpacity>
            <Text
              style={[
                appStyles.regularTxtRg,
                {
                  color: colors.complimentary,
                  textAlign: 'center',
                  marginTop: 10,
                },
              ]}>
              Notice
            </Text>
          </View>
          <View>
            <TouchableOpacity style={[styles.toolBtn, {marginLeft: 18}]}>
              <Icon name="send" size={32} color={colors.complimentary} />
            </TouchableOpacity>
            <Text
              style={[
                appStyles.regularTxtRg,
                {
                  color: colors.complimentary,
                  textAlign: 'center',
                  marginTop: 10,
                },
              ]}>
              Rocket
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  toolBtn: {
    paddingHorizontal: 25,
    paddingVertical: 20,
    backgroundColor: colors.lines,
    borderRadius: 26,
    // backgroundColor: colors.tool_btn,
  },
});
