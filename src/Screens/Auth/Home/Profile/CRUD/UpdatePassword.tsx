import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import appStyles from '../../../../../styles/styles';
import {colors} from '../../../../../styles/colors';
import axiosInstance from '../../../../../Api/axiosConfig';
export default function JoinAgency({navigation}) {
  const [error, setError] = useState<any>('');
  const [loading, setLoading] = useState<any>(false);
  const [form, setForm] = useState({
    password: '',
    new_password: '',
    new_password_confirmation: '',
    securePass: true,
    secure_password_confirm: true,
  });

  const updatePassword = async () => {
    try {
      setLoading(true);
      const url = '/auth/update-password';
      const res = await axiosInstance.post(url, JSON.stringify(form));
      setLoading(false);
      setError(res.data.message);
      console.log(res.data);
    } catch (error: any) {
      console.log(error);
      setError(error.response.data.message);
      clearError();
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
      <View style={[appStyles.backBtn2]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}>
          <Icon name="arrow-left-thin" color={colors.complimentary} size={25} />
        </TouchableOpacity>
        <Text
          style={[
            appStyles.headline,
            {color: colors.complimentary, marginLeft: 20},
          ]}>
          Password
        </Text>
      </View>

      <View style={{marginTop: 30}}>
        <View>
          <Text
            style={{
              color: '#737380',
            }}>
            Enter old Password
          </Text>
          <TextInput
            secureTextEntry={true}
            placeholder="*******"
            style={styles.input}
            value={form.password}
            autoCapitalize="none"
            onChangeText={text => setForm({...form, password: text})}
            placeholderTextColor="#737380"
          />
        </View>
        <View style={{marginVertical: 30}}>
          <Text
            style={{
              color: '#737380',
            }}>
            Enter New Password
          </Text>
          <TextInput
            secureTextEntry={form.securePass}
            placeholder="*******"
            style={styles.input}
            autoCapitalize="none"
            value={form.new_password}
            onChangeText={text => setForm({...form, new_password: text})}
            placeholderTextColor="#737380"
          />
          <TouchableOpacity
            onPress={() =>
              setForm({
                ...form,
                securePass: !form.securePass,
              })
            }
            style={{
              position: 'absolute',
              right: 10,
              top: 25,
            }}>
            <Icon
              name={form.securePass ? 'eye-outline' : 'eye-off-outline'}
              size={25}
              color={colors.complimentary}
            />
          </TouchableOpacity>
        </View>
        <View>
          <Text
            style={{
              color: '#737380',
            }}>
            Confirm New Password
          </Text>
          <TextInput
            secureTextEntry={form.secure_password_confirm}
            placeholder="*******"
            style={styles.input}
            value={form.new_password}
            autoCapitalize="none"
            onChangeText={text =>
              setForm({...form, new_password_confirmation: text})
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
              top: 25,
            }}>
            <Icon
              name={
                form.secure_password_confirm ? 'eye-outline' : 'eye-off-outline'
              }
              size={25}
              color={colors.complimentary}
            />
          </TouchableOpacity>
        </View>
      </View>
      {error && (
        <Text style={[appStyles.errorText, {marginTop: 10}]}>{error}</Text>
      )}
      <TouchableOpacity style={[appStyles.bottomBtn]} onPress={updatePassword}>
        <Text style={{color: '#fff', fontWeight: '600', fontSize: 17}}>
          Update Password
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d1f31',
    padding: 10,
  },
  tab: {
    flexDirection: 'row',
    width: '50%',
    paddingBottom: 10,
    borderBottomColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtn: {
    flexDirection: 'row',
    // width: '30%',
    // position: 'absolute',
    // top: 20,
    alignItems: 'center',
    borderRadius: 16,
  },
  input: {
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginTop: 10,
    color: colors.complimentary,
  },
  genderBtn: {
    borderColor: 'grey',
    // borderWidth: 1,
    justifyContent: 'center',
    padding: 15,
    // borderRadius: 10,
    width: '35%',
  },
  genderTxt: {
    color: '#fff',
    textAlign: 'center',
  },
  tabText: {
    color: '#868791',
    fontSize: 18,
    // padding: 10,
    fontWeight: '600',
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
  info: {
    width: '25%',
  },
  text: {
    marginTop: 10,
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
  },
});
