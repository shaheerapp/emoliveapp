import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import {colors} from '../../../../../styles/colors';
import appStyles from '../../../../../styles/styles';
import {ChatClient} from 'react-native-agora-chat';
import {useSelector, useDispatch} from 'react-redux';
// import setModalInfo from '../../'
import {
  setHostLeftPodcast,
  setLeaveModal,
} from '../../../../../store/slice/podCastSlice';
import {setLiveStatus} from '../../../../../store/slice/usersSlice';

import axios from 'axios';
import envVar from '../../../../../config/envVar';
import axiosInstance from '../../../../../Api/axiosConfig';

interface EndLiveProps {
  user: any;
  endPodcastForUser: any;
  navigation: any;
  id: any;
  live: boolean;
  PK: boolean;
  battle: any;
}
export default function EndLive({
  user,
  endPodcastForUser,
  navigation,
  id,
  live = false,
  PK = false,
  battle,
}: EndLiveProps) {
  const dispatch = useDispatch();
  const [disabled, setDisabled] = useState(false);
  const {leaveModal, hostLeftPodcast, podcast} = useSelector(
    (state: any) => state.podcast,
  );
  const {stream} = useSelector((state: any) => state.streaming);

  const endPodcast = async () => {
    try {
      dispatch(setLiveStatus('IDLE'));
      setDisabled(true);
      let url = 'end/' + id;
      if (PK) {
        url = 'battle/' + url;
        if ([battle.user1_id, battle.user2_id].includes(user.id)) {
          url = url + '/guest';
        }
      } else {
        url = (live ? 'stream/' : 'podcast/') + url;
        if (user.id !== podcast.host || user.id !== stream.host) {
          url = url + '/guest';
        }
      }

      // console.log(url);
      await axiosInstance.get(url);
    } catch (error) {
      console.log(error);
    } finally {
      setDisabled(false);
      endPodcastForUser();
    }
  };
  // const endPodcast = async () => {
  //   try {
  //     dispatch(setLiveStatus('IDLE'));
  //     setDisabled(true);
  //     let url =
  //     if (battle) {

  //     }
  //     url = (live ? 'stream' : 'podcast') + '/end/' + id;
  //     if (user.id !== podcast.host || user.id !== stream.host) {
  //       url = url + '/guest';
  //     }
  //     // console.log(url);
  //     await axiosInstance.get(url);
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setDisabled(false);
  //     endPodcastForUser();
  //   }
  // };
  const title = () => {
    if (PK) {
      return 'Live Battle';
    }
    if (live) {
      return 'Live Streaming';
    }
    return 'Podcast';
  };
  const description = () => {
    if (hostLeftPodcast) {
      return 'Host Has Left Stream';
    }
  };
  const cancelLeave = () => {
    dispatch(setLeaveModal(false));
  };

  interface BodyText {
    live: boolean;
    podcastId: number;
    userId: number;
  }
  const getText = ({live, podcastId, userId}: BodyText) => {
    if (PK) {
      return 'Are you sure to left this Battle.';
    }
    if (hostLeftPodcast) {
      return live ? 'Host Has Left Stream' : 'Host Has Left PodCast';
    } else if (userId === podcastId) {
      return 'Are you sure to end this podcast Host';
    } else {
      return live
        ? 'Are you sure to left this Stream.'
        : 'Are you sure to left this Podcast.';
    }
  };

  return (
    <View>
      <Modal
        visible={leaveModal}
        transparent={true}
        animationType="slide"
        onRequestClose={cancelLeave}>
        {/* Backdrop */}
        <View style={styles.backdrop}>
          {/* Modal Content */}
          {disabled ? (
            <ActivityIndicator
              animating={disabled}
              size={'large'}
              color={colors.complimentary}
            />
          ) : (
            <View style={styles.modalView}>
              <Text style={[appStyles.title1, {color: colors.complimentary}]}>
                {title()} End
                {/* {live ? 'Live Streaming' : 'Podcast'} End */}
              </Text>
              <View style={{marginVertical: 20}}>
                <Text
                  style={[appStyles.regularTxtMd, {color: colors.body_text}]}>
                  {getText({live, podcastId: podcast.id, userId: user.id})}
                </Text>
              </View>

              <TouchableOpacity
                disabled={disabled}
                onPress={endPodcast}
                style={[styles.deleteButton]}>
                <Text style={styles.deleteText}>
                  {hostLeftPodcast ? 'Ok' : 'Confirm'}
                </Text>
              </TouchableOpacity>
              {!hostLeftPodcast && (
                <TouchableOpacity
                  disabled={disabled}
                  onPress={cancelLeave}
                  style={styles.cancelButton}>
                  <Text
                    style={[appStyles.paragraph1, {color: colors.unknown2}]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </Modal>
      {/* <Text>EndLive</Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Custom RGBA backdrop color
    justifyContent: 'center',
    alignItems: 'center',
    // alignSelf: 'center',
  },
  modalView: {
    // width: 300,
    padding: 20,
    backgroundColor: colors.LG,
    alignSelf: 'center',
    width: '90%',
    // minWidth
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderRadius: 26,
  },
  deleteButton: {
    backgroundColor: colors.accent,
    padding: 16,
    borderRadius: 12,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  deleteText: {
    color: colors.offwhite,
    ...appStyles.paragraph1,
  },
  cancelButton: {
    padding: 16,
  },
});
