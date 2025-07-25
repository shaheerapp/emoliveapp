import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Platform,
  Dimensions,
  ActivityIndicator,
  TextInput,
  Image,
} from 'react-native';
import appStyles from '../../styles/styles';
import {colors} from '../../styles/colors';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAppContext} from '../../Context/AppContext';
export default function Phone() {
  const {userAuthInfo} = useAppContext();
  const {setUser} = userAuthInfo;
  const [loading, setLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  const sendCode = () => {
    setLoading(true);
    setTimeout(() => {
      setCodeSent(true);
      setLoading(false);
    }, 600);
  };
  const VerifyOtp = () => {
    setLoading(true);
    setTimeout(() => {
      setCodeSent(false);
      setLoading(true);
      setUser('imean');
    }, 600);
  };
  const submitAction = () => {
    if (codeSent) {
      VerifyOtp();
      return;
    }
    sendCode();
  };
  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.image}
        source={require('../../assets/images/parts/phone.png')}>
        {loading ? (
          <ActivityIndicator
            style={{marginTop: 100}}
            color={'blue'}
            size="large"
          />
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                height: '40%',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
              }}></View>
            <View
              style={{
                height: '60%',
                padding: 10,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
              }}>
              <View style={{width: '80%', alignSelf: 'center'}}>
                <Text style={styles.heading}>Emo Live</Text>
                <View>
                  <Text style={styles.subText}>
                    {!codeSent
                      ? 'Enter Phone number to verify OPP'
                      : 'Enter 6 digit verification code sent to your phone number'}
                  </Text>
                </View>
              </View>
              {!codeSent ? (
                <View
                  style={{
                    marginTop: 20,
                    flexDirection: 'row',
                    width: '90%',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '30%',
                      alignItems: 'center',
                    }}>
                    <Image
                      style={{height: 30, width: 30}}
                      source={require('../../assets/images/flag.png')}
                    />
                    <Text style={styles.country}>+92</Text>
                    <Icon name="chevron-down" color="#fff" size={30} />
                  </View>
                  <TextInput
                    style={styles.numberInput}
                    keyboardType="decimal-pad"
                  />
                </View>
              ) : (
                <>
                  <View style={styles.codeInput}>
                    <TextInput
                      keyboardType="decimal-pad"
                      maxLength={1}
                      style={styles.input}
                    />
                    <TextInput
                      keyboardType="decimal-pad"
                      maxLength={1}
                      style={styles.input}
                    />
                    <TextInput
                      keyboardType="decimal-pad"
                      maxLength={1}
                      style={styles.input}
                    />
                    <TextInput
                      keyboardType="decimal-pad"
                      maxLength={1}
                      style={styles.input}
                    />
                  </View>
                  <TouchableOpacity style={styles.resendBtn}>
                    <Text style={styles.resendBtnTxt}>Resend Code</Text>
                  </TouchableOpacity>
                </>
              )}

              <View style={{marginTop: Platform.OS == 'ios' ? 160 : 80}}>
                <TouchableOpacity
                  onPress={submitAction}
                  style={styles.googleBtn}>
                  <Text style={styles.btnTxt}>Next</Text>
                </TouchableOpacity>
              </View>
              {!codeSent && (
                <View style={{marginTop: 30}}>
                  <Text style={styles.agreeTxt}>
                    By creating account or signing in, you agree to,
                  </Text>
                  <Text style={styles.privacyUrl}>
                    our user agreement and privacy policy
                  </Text>
                </View>
              )}
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
    // display: 'flex',
    // justifyContent: 'space-around',
  },
  heading: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  subText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#fff',
    marginTop: 20,
    textAlign: 'center',
  },
  googleBtn: {
    backgroundColor: '#EF0143',
    borderRadius: 30,
    width: '100%',
    height: 60,
    justifyContent: 'center',
  },
  phoneBtn: {
    marginTop: 20,
    backgroundColor: '#1d1f31',
    borderRadius: 30,
    justifyContent: 'center',
    // alignItems: 'center',
    width: '100%',
    height: 60,
  },
  country: {
    color: '#787783',
    fontSize: 12,
    marginLeft: 5,
    fontWeight: '500',
  },
  resendBtn: {
    alignSelf: 'center',
    marginTop: 20,
    width: '40%',
  },
  codeInput: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  resendBtnTxt: {
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 20,
    color: '#ed0043',
  },
  numberInput: {
    borderColor: '#494759',
    borderWidth: 1,
    width: '80%',
    borderRadius: 9,
    height: 50,
    color: '#fff',
  },
  input: {
    height: 50,
    width: 50,
    borderColor: '#494759',
    borderWidth: 1,
    borderRadius: 3,
    color: '#fff',
    fontSize: 18,
    paddingLeft: 20,
    fontWeight: '600',
    justifyContent: 'center',
    // alignItems: 'center',
    // alignSelf: 'center',
    // textAlign: 'center',
  },
  agreeTxt: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  privacyUrl: {
    fontSize: 13,
    color: '#868791',
    textAlign: 'center',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  btnTxt: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '500',
  },
});
