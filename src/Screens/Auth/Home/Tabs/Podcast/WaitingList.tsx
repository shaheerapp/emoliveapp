import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';
import React, { useState } from 'react';
import appStyles from '../../../../../styles/styles';
import { colors } from '../../../../../styles/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { envVar } from './podcastImport';
import { Switch } from 'react-native';

export default function WaitingList({
  waitingList,
  approveUser,
  rejectUser,
  isHost,
  handleLockAllSeats,
  isToggleOn,
  setIsToggleOn,
}: any) {
  return (
    <View style={styles.container}>
      <View
        style={[styles.header, { justifyContent: 'center', display: 'flex' }]}
      >
        <Text style={[styles.waitingListTitle, { marginRight: 10 }]}>
          Allow Guest
        </Text>
        <Switch
          value={isToggleOn}
          onValueChange={value => {
            setIsToggleOn(value);
            handleLockAllSeats(!value);
          }}
          thumbColor={isToggleOn ? colors.pimary : '#ccc'}
          trackColor={{ false: '#ddd', true: colors.dark_gradient }}
        />
      </View>
      <View style={styles.header}>
        <Text style={styles.waitingListTitle}>
          Waiting for Approval ({waitingList.length})
        </Text>
      </View>

      <FlatList
        data={waitingList}
        keyExtractor={item => item.userData.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.waitingListItem}>
            <View style={styles.userInfoContainer}>
              <Image
                source={{
                  uri: envVar.API_URL + 'display-avatar/' + item.userData.id,
                }}
                style={styles.waitingListAvatar}
              />
              <Text style={styles.waitingListName} numberOfLines={1}>
                {item.userData.name}
              </Text>
            </View>
            {isHost && (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.approveButton}
                  onPress={() => approveUser(item.userData.id)}
                >
                  <Text style={styles.buttonText}>Approve</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.rejectButton}
                  onPress={() => rejectUser(item.userData.id)}
                >
                  <Text style={styles.buttonText}>Reject</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.LG,
    borderBottomWidth: 1,
    borderBottomColor: colors.LG,
  },
  waitingListTitle: {
    ...appStyles.bodyMd,
    color: colors.complimentary,
    fontWeight: 'bold',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    ...appStyles.bodyMd,
    color: colors.complimentary,
    marginRight: 4,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  waitingListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.LG,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  waitingListAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  waitingListName: {
    ...appStyles.bodyMd,
    color: colors.complimentary,
    flexShrink: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginLeft: 12,
  },
  approveButton: {
    backgroundColor: colors.green,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  rejectButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  buttonText: {
    ...appStyles.smallTxt,
    color: colors.white,
    fontWeight: 'bold',
  },
});
