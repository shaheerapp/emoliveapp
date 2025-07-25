import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../../Api/axiosConfig';
import appStyles from '../../styles/styles';
import envVar from '../../config/envVar';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import {colors} from '../../styles/colors';
import {useAppContext} from '../../Context/AppContext';

export default function Landing({navigation}: any) {
  const {userAuthInfo, tokenMemo} = useAppContext();
  const {setUser} = userAuthInfo;
  const {setToken} = tokenMemo;
  const [form, setForm] = useState({
    email: '',
    password: '',
    secure: true,
  });
  const [error, setError] = useState<any>(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    // Initialize Google Sign-In
    // GoogleSignin.configure({
    //   webClientId: envVar.WEB_CLIENT_ID,
    //   offlineAccess: true,
    //   iosClientId: envVar.IOS_CLIENT_ID,
    // });
  }, []);

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      apiCallForGoogle(userInfo);
      // AsyncStorage.setItem('loggedUser', JSON.stringify(userInfo));
      console.log('User Info:', userInfo);
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Error', 'google sign in cancelled by user');
        console.log('User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign-in is in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services not available');
      } else {
        console.error('Error:', error);
      }
    }
  };
  const apiCallForGoogle = async (data: any) => {
    try {
      let formData = {
        email: data.email,
        first_name: data.givenName,
        last_name: data.familyName,
        avatar: data.photo,
      };
      const url = 'register-with-google';
      const res = await axiosInstance.post(url, JSON.stringify(formData));
      console.log(res.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const loginWithApp = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.post('/login', JSON.stringify(form));
      console.log('====================================');
      console.log(res);
      console.log('====================================');
      await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
      await AsyncStorage.setItem('token', res.data.access_token);
      setUser(res.data.user);
      setToken(res.data.access_token);
      setLoading(false);
    } catch (error: any) {
      console.log(error);
      if (error.request) {
        setError('please check internet connection');
      }
      if (error.response) {
        setError(error.message);
      }
      clearError();
    }
  };

  const clearStorage = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      await AsyncStorage.multiRemove(keys);
      await AsyncStorage.removeItem('user');
      userAuthInfo.setUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  const clearError = () => {
    setLoading(false);
    setTimeout(() => {
      setError(false);
    }, 3000);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.image}
        source={require('../../assets/images/parts/landing.png')}>
        {loading ? (
          <ActivityIndicator
            style={[appStyles.indicatorStyle]}
            size={'large'}
            color="blue"
          />
        ) : (
          <View
            style={{
              flex: 1,
              // backgroundColor: 'rgba(255, 0, 0, 0.5)',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                height: Platform.OS == 'ios' ? '30%' : '25%',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
              }}></View>
            <View
              style={{
                height: Platform.OS == 'ios' ? '70%' : '75%',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              }}>
              <View style={{width: '80%', alignSelf: 'center'}}>
                <Text style={styles.heading}>Emo Live</Text>
                <View>
                  <Text
                    style={[
                      styles.subText,
                      {textAlign: 'center', marginTop: 20},
                    ]}>
                    Experience the Live experience
                  </Text>
                </View>
              </View>
              <View
                style={{
                  width: '90%',
                  justifyContent: 'center',
                  paddingLeft: 20,
                }}>
                <View>
                  <Text style={styles.subText}>Email:</Text>
                  <TextInput
                    style={styles.emailInput}
                    value={form.email}
                    onChangeText={(e: any) => setForm({...form, email: e})}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="jhon@gmail.com"
                    placeholderTextColor={colors.body_text}
                  />
                </View>

                <View style={{marginTop: 10}}>
                  <Text style={styles.subText}>Password:</Text>
                  <TextInput
                    style={styles.passwordInput}
                    secureTextEntry={form.secure}
                    autoCapitalize="none"
                    onChangeText={(text: any) =>
                      setForm({...form, password: text})
                    }
                    value={form.password}
                    placeholder="**********"
                    placeholderTextColor={colors.body_text}
                  />
                  <TouchableOpacity
                    onPress={() => setForm({...form, secure: !form.secure})}
                    style={{
                      position: 'absolute',
                      right: 10,
                      top: 34,
                    }}>
                    <Icon
                      name={form.secure ? 'eye-outline' : 'eye-off-outline'}
                      size={25}
                      color={colors.complimentary}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 5,
                    justifyContent: 'space-between',
                  }}>
                  <TouchableOpacity
                    onPress={() => setRememberMe(!rememberMe)}
                    style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Icon
                      name={
                        rememberMe
                          ? 'checkbox-marked'
                          : 'checkbox-blank-outline'
                      }
                      color={colors.complimentary}
                      size={25}
                    />
                    <Text style={{color: colors.complimentary, marginLeft: 5}}>
                      Remember Me
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('ForgetPassword')}>
                    <Text style={{color: colors.complimentary}}>
                      Forget Password?
                    </Text>
                  </TouchableOpacity>
                </View>
                {error && (
                  <Text style={[appStyles.errorText, {marginVertical: 10}]}>
                    {error}
                  </Text>
                )}

                <TouchableOpacity
                  style={styles.signInBtn}
                  onPress={loginWithApp}>
                  <Text
                    style={[
                      appStyles.headline2,
                      {color: colors.complimentary, textAlign: 'center'},
                    ]}>
                    Sign In
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.signUp}>
                <Text style={styles.subText}>New user?</Text>
                <TouchableOpacity
                  style={{marginLeft: 2}}
                  onPress={() => navigation.navigate('Register')}>
                  <Text style={[appStyles.headline2, {color: colors.accent}]}>
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={{color: colors.complimentary, textAlign: 'center'}}>
                ------------- OR -------------{' '}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                  marginTop: 20,
                }}>
                <TouchableOpacity
                  style={styles.googleBtn}
                  onPress={clearStorage}>
                  <Icon
                    name="facebook"
                    size={25}
                    color={colors.complimentary}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={signInWithGoogle}
                  style={[
                    styles.googleBtn,
                    {
                      marginHorizontal: 10,
                    },
                  ]}>
                  <Icon name="google" size={25} color={colors.complimentary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.googleBtn}
                  onPress={() => navigation.navigate('Phone')}>
                  <Icon
                    name="cellphone"
                    size={25}
                    color={colors.complimentary}
                  />
                </TouchableOpacity>
              </View>

              <View style={{marginTop: Platform.OS == 'ios' ? 30 : 10}}>
                <Text style={styles.agreeTxt}>
                  By creating account or signing in, you agree to,
                </Text>
                <Text style={styles.privacyUrl}>
                  our user agreement and privacy policy
                </Text>
              </View>
            </View>
          </View>
        )}
      </ImageBackground>
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
  heading: {
    ...appStyles.headline,
    color: colors.complimentary,
    textAlign: 'center',
  },
  subText: {
    ...appStyles.paragraph1,
    color: colors.complimentary,
  },
  googleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emailInput: {
    marginTop: 5,
    borderColor: colors.complimentary,
    color: colors.complimentary,
    borderWidth: 1,
    padding: 12,
    borderRadius: 4,
  },
  signInBtn: {
    padding: 10,
    backgroundColor: colors.accent,
    marginTop: 30,
    borderRadius: 6,
  },
  agreeTxt: {
    ...appStyles.regularTxtRg,
    color: colors.complimentary,
    textAlign: 'center',
  },
  privacyUrl: {
    ...appStyles.regularTxtRg,
    color: colors.semantic,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  passwordInput: {
    marginTop: 5,
    borderColor: colors.complimentary,
    color: colors.complimentary,
    borderWidth: 1,
    padding: 12,
    borderRadius: 4,
  },
  signUp: {
    alignSelf: 'center',
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
