import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import React from 'react';
import {RtcSurfaceView} from 'react-native-agora';
import {colors} from '../../../../../../styles/colors';
import {useDispatch, useSelector} from 'react-redux';
import {
  addStreamListenerS,
  removeUserFromSingleStream,
} from '../../../../../../store/slice/streamingSlice';
const deviceHeight = Dimensions.get('window').height;
import {singleLiveHosts} from '../../../../../../store/selectors/selectors';
// import sing
import {singleStyles} from '../../styles/singleStyles';
import envVar from '../../../../../../config/envVar';
import {users} from './users';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {appStyles} from '../streamingImport';

interface SingleLiveProps {
  user: any;
  isJoined: boolean;
  token: string;
  toggleMute: any;
  offCamera: any;
  toggleCamera: any;
}
export default function SingleLive({
  user,
  isJoined,
  token,
  toggleMute,
  offCamera,
  toggleCamera,
}: SingleLiveProps) {
  //
  const dispatch = useDispatch();
  // const hosts = useSelector(singleLiveHosts);

  const {stream, streamListenersS} = useSelector(
    (state: any) => state.streaming,
  );
  const guest = streamListenersS.filter(
    (item: any) => item.user.id !== stream.host,
  );
  const host = streamListenersS.find(
    (item: any) => item.user.id == stream.host,
  );

  // cons
  return (
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: 'green',
          flex: 1,
        }}>
        {isJoined && host ? (
          <>
            {host.camOn ? (
              <React.Fragment key={stream.host}>
                <RtcSurfaceView
                  canvas={{uid: stream.host == user.id ? 0 : stream.host}}
                />
              </React.Fragment>
            ) : (
              <View style={styles.avatar}>
                <Image
                  style={[appStyles.userAvatar]}
                  source={
                    host.user.avatar
                      ? {
                          uri:
                            envVar.API_URL + 'display-avatar/' + host.user.id,
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        }
                      : require('../../../../../../assets/images/place.jpg')
                  }
                />
                <Text style={styles.hostTxt}>
                  {host.user.first_name + ' ' + host.user.last_name}
                </Text>
              </View>
            )}

            {stream.host == user.id && (
              <View style={styles.control}>
                <TouchableOpacity style={{}} onPress={() => toggleCamera()}>
                  <Icon
                    name="camera-flip-outline"
                    size={25}
                    color={colors.complimentary}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{marginVertical: 20}}
                  onPress={() => toggleMute(host)}>
                  <Icon
                    name={host.muted ? 'microphone-off' : 'microphone'}
                    size={25}
                    color={colors.complimentary}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={{}} onPress={() => offCamera(host)}>
                  <Icon
                    name={host.camOn ? 'camera-off-outline' : 'camera-outline'}
                    size={25}
                    color={colors.complimentary}
                  />
                </TouchableOpacity>
              </View>
            )}
          </>
        ) : (
          <></>
        )}
      </View>
      <View style={styles.guest}>
        <FlatList
          data={guest}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <View style={styles.screen1}>
              {item.user ? (
                // {item.user && isJoined ? (
                <>
                  <React.Fragment key={item.user.id}>
                    {item.camOn ? (
                      <RtcSurfaceView
                        canvas={{
                          uid: user.id == item.user.id ? 0 : item.user.id,
                        }}
                        style={styles.videoView}
                      />
                    ) : (
                      <View style={{backgroundColor: colors.accent}}>
                        <Image
                          source={
                            item.user.avatar
                              ? {
                                  uri:
                                    envVar.API_URL +
                                    'display-avatar/' +
                                    item.user.id,
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                  },
                                }
                              : require('../../../../../../assets/images/place.jpg')
                          }
                        />
                      </View>
                    )}

                    <Text style={styles.userTxt}>
                      {item.user.first_name + ' ' + item.user.last_name}
                    </Text>
                    {item.user.id == user.id && (
                      <>
                        <TouchableOpacity
                          style={styles.otherCam}
                          onPress={() => toggleCamera()}>
                          <Icon
                            name="camera-flip-outline"
                            size={20}
                            color={colors.complimentary}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.audioInputBtn}
                          onPress={() => toggleMute(item)}>
                          <Icon
                            name={item.muted ? 'microphone-off' : 'microphone'}
                            size={20}
                            color={colors.complimentary}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.offCam}
                          onPress={() => offCamera(item)}>
                          <Icon
                            name={
                              item.camOn
                                ? 'camera-off-outline'
                                : 'camera-outline'
                            }
                            size={20}
                            color={colors.complimentary}
                          />
                        </TouchableOpacity>
                      </>
                    )}
                  </React.Fragment>
                </>
              ) : (
                <View>
                  <Text style={{color: colors.complimentary}}>
                    {item.seatNo}
                  </Text>
                </View>
              )}
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ...singleStyles,
  hostTxt: {
    ...appStyles.regularTxtMd,
    color: colors.complimentary,
    marginTop: 10,
  },
});
