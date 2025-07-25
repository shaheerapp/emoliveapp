import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import axiosInstance from '../../../../../Api/axiosConfig';
import {colors} from '../../../../../styles/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import appStyles from '../../../../../styles/styles';
export default function Privacy({navigation}) {
  const [data, setData] = useState({
    hide_gender: false,
    hide_age: false,
    allow_screenshot: false,
    hide_dob: false,
    hide_location: false,
    hide_your_video_nearBy: false,
    hide_yourself_in_nearby: false,
    hide_last_active_time: false,
    self_secure: false,
  });

  const updateSettings = (key: string) => {
    setData((prevState: any) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  //   const updateSettings = () =>
  //     setMuteNotifications(previousState => !previousState);

  return (
    <View style={styles.container}>
      <View style={[appStyles.backBtn2]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left-thin" size={25} color={colors.complimentary} />
        </TouchableOpacity>
        <Text
          style={[
            appStyles.headline,
            {color: colors.complimentary, marginLeft: 10},
          ]}>
          Privacy Settings
        </Text>
      </View>
      <ScrollView contentContainerStyle={{marginTop: 40}}>
        <View style={{padding: 10}}>
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={styles.tabText}>Hide Gender</Text>
              <TouchableOpacity>
                <Switch
                  trackColor={{
                    false: colors.complimentary,
                    true: colors.accent,
                  }}
                  thumbColor={
                    data.hide_gender
                      ? colors.complimentary
                      : colors.complimentary
                  }
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => updateSettings('hide_gender')}
                  value={data.hide_gender}
                />
              </TouchableOpacity>
            </View>
            <View style={{marginTop: 10}}>
              <Text style={styles.text}>
                After turning this on! your Gender will not appear on profile of
                EMO Live
              </Text>
            </View>
          </View>
          <View style={{marginVertical: 25}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={styles.tabText}>Hide Age</Text>
              <TouchableOpacity>
                <Switch
                  trackColor={{false: 'red', true: colors.accent}}
                  thumbColor={
                    data.hide_age ? colors.complimentary : colors.body_text
                  }
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => updateSettings('hide_age')}
                  value={data.hide_age}
                />
              </TouchableOpacity>
            </View>
            <View style={{marginTop: 10}}>
              <Text style={styles.text}>
                After turning this on! your Age will not appear on profile of
                EMO Live
              </Text>
            </View>
          </View>
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={[styles.tabText]}>Allow Screenshot</Text>
              <TouchableOpacity>
                <Switch
                  trackColor={{
                    false: colors.complimentary,
                    true: colors.accent,
                  }}
                  thumbColor={
                    data.allow_screenshot
                      ? colors.complimentary
                      : colors.complimentary
                  }
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => updateSettings('allow_screenshot')}
                  value={data.allow_screenshot}
                />
              </TouchableOpacity>
            </View>
            <View style={{marginTop: 10}}>
              <Text style={styles.text}>
                After turning this on! you're not allowing viewers to take
                screenshot of your steaming
              </Text>
            </View>
          </View>
          <View style={{marginVertical: 25}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={styles.tabText}>Hide Date of Birth</Text>
              <TouchableOpacity>
                <Switch
                  trackColor={{
                    false: colors.complimentary,
                    true: colors.accent,
                  }}
                  thumbColor={
                    data.hide_dob ? colors.complimentary : colors.complimentary
                  }
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => updateSettings('hide_dob')}
                  value={data.hide_dob}
                />
              </TouchableOpacity>
            </View>
            <View style={{marginTop: 10}}>
              <Text style={styles.text}>
                After turning this on! your Date of Birth will not appear on
                profile of EMO Live
              </Text>
            </View>
          </View>
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={styles.tabText}>Hide Location</Text>
              <TouchableOpacity>
                <Switch
                  trackColor={{
                    false: colors.complimentary,
                    true: colors.accent,
                  }}
                  thumbColor={
                    data.hide_location
                      ? colors.complimentary
                      : colors.complimentary
                  }
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => updateSettings('hide_location')}
                  value={data.hide_location}
                />
              </TouchableOpacity>
            </View>
            <View style={{marginTop: 10}}>
              <Text style={styles.text}>
                After turning this on! your Location will not appear on profile
                of EMO Live
              </Text>
            </View>
          </View>
          <View style={{marginVertical: 25}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={styles.tabText}>Hide your video NearBy</Text>
              <TouchableOpacity>
                <Switch
                  trackColor={{
                    false: colors.complimentary,
                    true: colors.accent,
                  }}
                  thumbColor={
                    data.hide_your_video_nearBy
                      ? colors.complimentary
                      : colors.complimentary
                  }
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => updateSettings('hide_your_video_nearBy')}
                  value={data.hide_your_video_nearBy}
                />
              </TouchableOpacity>
            </View>
            <View style={{marginTop: 10}}>
              <Text style={styles.text}>
                After turning this on your hide your video NearBy
              </Text>
            </View>
          </View>
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={styles.tabText}>Hide yourself in NearBy</Text>
              <TouchableOpacity>
                <Switch
                  trackColor={{
                    false: colors.complimentary,
                    true: colors.accent,
                  }}
                  thumbColor={
                    data.hide_yourself_in_nearby
                      ? colors.complimentary
                      : colors.complimentary
                  }
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() =>
                    updateSettings('hide_yourself_in_nearby')
                  }
                  value={data.hide_yourself_in_nearby}
                />
              </TouchableOpacity>
            </View>
            <View style={{marginTop: 10}}>
              <Text style={styles.text}>
                After turning this on your hide your video NearBy
              </Text>
            </View>
          </View>
          <View style={{marginVertical: 25}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={styles.tabText}>Hide Yourself Last Active Time</Text>
              <TouchableOpacity>
                <Switch
                  trackColor={{
                    false: colors.complimentary,
                    true: colors.accent,
                  }}
                  thumbColor={
                    data.hide_last_active_time
                      ? colors.complimentary
                      : colors.complimentary
                  }
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => updateSettings('hide_last_active_time')}
                  value={data.hide_last_active_time}
                />
              </TouchableOpacity>
            </View>
            <View style={{marginTop: 10}}>
              <Text style={styles.text}>
                After turning this on other won't see your active time
              </Text>
            </View>
          </View>
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={styles.tabText}>Secure yourself</Text>
              <TouchableOpacity>
                <Switch
                  trackColor={{
                    false: colors.complimentary,
                    true: colors.accent,
                  }}
                  thumbColor={
                    data.self_secure
                      ? colors.complimentary
                      : colors.complimentary
                  }
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => updateSettings('self_secure')}
                  value={data.self_secure}
                />
              </TouchableOpacity>
            </View>
            <View style={{marginTop: 10}}>
              <Text style={styles.text}>
                After turning this on other could not download and take
                screenshots your profile photo
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark_gradient,
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
  text: {
    ...appStyles.bodyMd,
    color: colors.body_text,
  },
  icon: {
    width: '50%',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 16,
  },
  tabText: {
    ...appStyles.paragraph1,
    color: colors.complimentary,
  },
});
