import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  Platform,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
//   import appStyles from '../../../../../styles/styles';
import appStyles from '../../styles/styles';
import {colors} from '../../styles/colors';
import axiosInstance from '../../Api/axiosConfig';
//   import { colors } from '../../../../../styles/colors';
export default function ForgetPassword({navigation}) {
  const [emailSent, setEmailSent] = useState(false);
  const [form, setForm] = useState({
    token: '',
    email: '',
    password: '',
    securePass: true,
    secure_password_confirm: true,
    password_confirmation: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const sendEmail = async () => {
    try {
      if (emailSent) {
        updatePassword();
        return;
      }
      if (form.email.length < 5 || !form.email) {
        Alert.alert('Please Provide Email');
        return;
      }
      setLoading(true);
      const res = await axiosInstance.post('send-reset-password-mail', {
        email: form.email,
      });
      setEmailSent(true);
      console.log(res.data);
      setLoading(false);
    } catch (error: any) {
      console.log(error);
      clearError();
      setError(error.message);
    }
  };
  const clearError = () => {
    setLoading(false);
    setTimeout(() => {
      setForm({...form, email: ''});
      setError(false);
    }, 4000);
  };
  const updatePassword = async () => {
    try {
      console.log('yoi called me');
      setLoading(true);
      const res = await axiosInstance.post('reset-password', form);
      setLoading(false);
      console.log(res.data);
      Alert.alert('Password successfully updated');
      navigation.goBack();
    } catch (error: any) {
      clearError();
      setError(error.message);
    }
  };
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: Platform.OS == 'ios' ? 50 : 20,
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}>
          <Icon name="arrow-left-thin" color="#fff" size={25} />
        </TouchableOpacity>
        <Text
          style={[
            appStyles.headline,
            {color: colors.complimentary, marginLeft: 10},
          ]}>
          {' '}
          Forget Password
        </Text>
      </View>
      {loading ? (
        <ActivityIndicator
          animating={loading}
          size={'large'}
          style={[appStyles.indicatorStyle]}
        />
      ) : (
        <>
          <View style={{marginTop: 30, width: '90%', alignSelf: 'center'}}>
            {!emailSent ? (
              <View>
                <Text
                  style={{
                    color: '#737380',
                  }}>
                  Enter Email Address
                </Text>
                <TextInput
                  placeholder="jhon@gmail.com"
                  style={styles.input}
                  placeholderTextColor="#737380"
                  onChangeText={text => setForm({...form, email: text})}
                  value={form.email}
                  autoCapitalize="none"
                />
              </View>
            ) : (
              <>
                <View style={{marginVertical: 30}}>
                  <Text style={styles.label}>Token</Text>
                  <TextInput
                    placeholder="Enter Code"
                    keyboardType="decimal-pad"
                    value={form.token}
                    onChangeText={text => setForm({...form, token: text})}
                    style={styles.input}
                    placeholderTextColor="#737380"
                  />
                </View>
                <View style={{marginVertical: 30}}>
                  <Text style={styles.label}>Enter New Password</Text>
                  <TextInput
                    secureTextEntry={form.securePass}
                    placeholder="*******"
                    autoCapitalize="none"
                    value={form.password}
                    onChangeText={text => setForm({...form, password: text})}
                    style={styles.input}
                    placeholderTextColor="#737380"
                  />
                  <TouchableOpacity
                    onPress={() =>
                      setForm({...form, securePass: !form.securePass})
                    }
                    style={{
                      position: 'absolute',
                      right: 10,
                      top: 23,
                    }}>
                    <Icon
                      name={form.securePass ? 'eye-outline' : 'eye-off-outline'}
                      size={25}
                      color={colors.complimentary}
                    />
                  </TouchableOpacity>
                </View>
                <View>
                  <Text style={styles.label}>Confirm New Password</Text>
                  <TextInput
                    secureTextEntry={form.secure_password_confirm}
                    placeholder="*******"
                    style={styles.input}
                    autoCapitalize="none"
                    value={form.password_confirmation}
                    onChangeText={text =>
                      setForm({...form, password_confirmation: text})
                    }
                    placeholderTextColor="#737380"
                  />
                  <TouchableOpacity
                    onPress={() =>
                      setForm({
                        ...form,
                        secure_password_confirm: !form.secure_password_confirm,
                      })
                    }
                    style={{
                      position: 'absolute',
                      right: 10,
                      top: 23,
                    }}>
                    <Icon
                      name={
                        form.secure_password_confirm
                          ? 'eye-outline'
                          : 'eye-off-outline'
                      }
                      size={25}
                      color={colors.complimentary}
                    />
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
          {error && (
            <Text style={[appStyles.errorText, {marginTop: 40}]}>{error}</Text>
          )}
          <TouchableOpacity
            style={[
              appStyles.bottomBtn,
              {bottom: Platform.OS == 'ios' ? 90 : 50},
            ]}
            onPress={sendEmail}>
            <Text style={{color: '#fff', fontWeight: '600', fontSize: 17}}>
              Send Email
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d1f31',
    padding: 10,
  },
  input: {
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginTop: 15,
    color: colors.complimentary,
  },
  backBtn: {
    flexDirection: 'row',
    left: 10,
    alignItems: 'center',
    padding: 10,
    borderRadius: 16,
  },
  label: {
    ...appStyles.bodyRg,
    color: colors.body_text,
  },
  image: {
    flex: 1,
  },
  btn: {
    marginTop: 40,
    backgroundColor: '#ef0143',
    width: '90%',
    position: 'absolute',
    bottom: 20,
    padding: 15,
    alignSelf: 'center',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 10,
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
  },
});
