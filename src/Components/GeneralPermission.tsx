import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React, {useState, useEffect} from 'react';
import {
  check,
  Permission,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions';
// import colors from '../../assets/colors/colors';
let IOS = PERMISSIONS.IOS;
type InfoType = {
  heading: string;
  subHeading: string;
  icon: string;
  permission: keyof typeof PERMISSIONS.IOS | keyof typeof PERMISSIONS.ANDROID; // Restrict to valid permission keys
};
let ANDROID = PERMISSIONS.ANDROID;
let platform = Platform.OS == 'ios' ? IOS : ANDROID;
import {colors} from '../styles/colors';
import appStyles from '../styles/styles';
interface PermissionProps {
  navigation: any;
  route: any;
}
export default function GeneralPermission({
  navigation,
  route,
}: PermissionProps) {
  const [info, setInfo] = useState<InfoType>({
    heading: '',
    subHeading: '',
    icon: 'help-circle-outline',
    permission: 'CAMERA',
  });

  useEffect(() => {
    updateInformation();
  }, []);
  const {type} = route.params;

  const updateInformation = () => {
    switch (type) {
      case 'camera':
        setInfo({
          heading: 'Camera Permission',
          subHeading: 'Allow Access to take pictures Live & videos',
          icon: 'camera-outline',
          permission:
            Platform.OS === 'ios'
              ? PERMISSIONS.IOS.CAMERA
              : PERMISSIONS.ANDROID.CAMERA,
        });
        break;

      case 'microphone':
        setInfo({
          heading: 'Audio',
          subHeading: 'Permission is required for audio broadcasting',
          icon: 'camera-outline',
          permission:
            Platform.OS === 'ios'
              ? PERMISSIONS.IOS.MICROPHONE
              : PERMISSIONS.ANDROID.RECORD_AUDIO,
        });
        break;
      case 'contacts':
        setInfo({
          heading: 'Contacts',
          subHeading: 'Permission is required to show contacts in app',
          icon: 'account-circle-outline',
          permission:
            Platform.OS === 'ios'
              ? PERMISSIONS.IOS.CONTACTS
              : PERMISSIONS.ANDROID.READ_CONTACTS,
        });
        break;
      case 'location':
        setInfo({
          heading: 'Location',
          subHeading:
            'Permission needed for live broadcast & nearby stream display',
          icon: 'map-marker-outline',
          permission:
            Platform.OS === 'ios'
              ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
              : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        });
        break;

      case 'gallery':
        setInfo({
          heading: 'Gallery',
          subHeading:
            'Permission needed to select images from gallery for profile picture',
          icon: 'camera-image',
          permission:
            Platform.OS === 'ios'
              ? PERMISSIONS.IOS.PHOTO_LIBRARY
              : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        });
        break;

      default:
        return 'help-circle-outline'; // Default icon for unknown types
    }
  };

  const checkPermission = async () => {
    try {
      let result = await check(info.permission);
      console.log('Result', result);
      switch (result) {
        case 'denied':
          requestPermission();
          break;
        case 'granted':
          navigation.replace('EditProfile');

          break;

        default:
          break;
      }
      // if (result === RESULTS.GRANTED) {
      // }
    } catch (error) {
      console.log(error);
    }
  };
  const requestPermission = async () => {
    try {
      const result = await request(info.permission);
      console.log('Result', result);
      switch (result) {
        case 'denied':
          Alert.alert('Permission Denied');
          break;
        case 'granted':
          navigation.replace('EditProfile');
          break;
        default:
          Alert.alert('Permission Denied');
          break;
      }
    } catch (error) {}
  };

  return (
    <View style={styles.container}>
      <View style={styles.image}>
        <View style={styles.main}>
          <View
            style={{
              height: '40%',
              // backgroundColor: 'rgba(0, 0, 0, 0.4)',
            }}>
            <View style={styles.imageStatic}>
              <Image
                style={{position: 'relative'}}
                source={require('../assets/images/parts/permission.png')}
              />
              <View style={styles.floatIcon}>
                <Icon name={info.icon} size={26} color={colors.complimentary} />
                <Text
                  style={[
                    appStyles.regularTxtMd,
                    {color: colors.complimentary, marginLeft: 15},
                  ]}>
                  {info.heading}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              height: '60%',
            }}>
            <View style={{width: '80%', alignSelf: 'center', marginTop: 40}}>
              <Text style={styles.heading}>{info.heading}</Text>
              <View>
                <Text style={styles.subText}>{info.subHeading}</Text>
              </View>
            </View>

            <View style={{marginTop: 50, width: '90%', alignSelf: 'center'}}>
              <TouchableOpacity
                onPress={checkPermission}
                style={[styles.faceBtn]}>
                <View>
                  <Text style={styles.agreeTxt}>Allow</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.replace('EditProfile')}
                style={[styles.phoneBtn]}>
                <View>
                  <Text style={styles.agreeTxt}>Don't Allow</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
  },
  main: {
    flex: 1,
    backgroundColor: colors.dark_gradient,
    justifyContent: 'space-between',
  },
  heading: {
    ...appStyles.display1,
    color: colors.complimentary,
    textAlign: 'center',
  },
  subText: {
    ...appStyles.paragraph1,
    color: colors.complimentary,
    marginTop: 40,
    textAlign: 'center',
  },
  faceBtn: {
    marginTop: 20,
    backgroundColor: colors.accent,
    borderRadius: 30,
    justifyContent: 'center',
    width: '100%',
    height: 60,
  },
  imageStatic: {
    marginTop: '27%',
    alignSelf: 'center',
    position: 'relative',
  },
  floatIcon: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 17,
  },
  phoneBtn: {
    marginTop: 20,
    backgroundColor: colors.LG,
    borderRadius: 30,
    justifyContent: 'center',
    width: '100%',
    height: 60,
  },

  agreeTxt: {
    ...appStyles.paragraph1,
    color: colors.complimentary,
    textAlign: 'center',
  },
  privacyUrl: {
    fontSize: 18,
    color: '#868791',
    textAlign: 'center',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
