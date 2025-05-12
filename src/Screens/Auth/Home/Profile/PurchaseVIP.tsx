import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Platform,
  Alert,
} from 'react-native';
import React, {useState, useRef, useCallback} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import appStyles from '../../../../styles/styles';
import {colors} from '../../../../styles/colors';
import Easypaisa from '../../../../assets/svg/easy.svg';
import TradeMark from '../../../../assets/svg/trademark.svg';
import axiosInstance from '../../../../Api/axiosConfig';
import {useDispatch, useSelector} from 'react-redux';

interface PurchaseProps {
  navigation: any;
}
export default function PurchaseVIP({navigation}: PurchaseProps) {
  const {purchase} = useSelector((state: any) => state.account);
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    loading: false,
    phone: '',
    error: null,
  });

  const makePayment = async () => {
    try {
      console.log(purchase);
      Alert.alert('Error', 'EasyPaisa Merchant Account Required');
      return;
      setForm({...form, loading: false});
      const url = '';
      const res = await axiosInstance.post('/');
      console.log(res.data);
      setForm({...form, loading: true});
    } catch (error: any) {
      setForm({...form, error: error.message});
    }
  };

  const clearError = () => {
    setForm({...form, loading: false});
    setTimeout(() => {
      setForm({...form, error: false});
    }, 3000);
  };

  return (
    <View style={styles.container}>
      <View style={appStyles.backBtn}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}>
          <Icon name="arrow-left-thin" color={colors.complimentary} size={25} />
        </TouchableOpacity>
        <Text style={[appStyles.headline, {color: colors.complimentary}]}>
          Purchase VIP
        </Text>
      </View>
      {form.loading ? (
        <ActivityIndicator
          style={appStyles.indicatorStyle}
          animating={form.loading}
          size="large"
          color={colors.accent}
        />
      ) : (
        <>
          <View
            style={{alignSelf: 'center', alignItems: 'center', marginTop: 40}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Easypaisa height={60} width={58} />
              <TradeMark style={{marginLeft: 30}} height={60} width={58} />
            </View>
          </View>
          <View style={{marginTop: 40, padding: 6}}>
            <Text style={styles.label}>
              Enter your Easypaisa Mobile Account Number
            </Text>
            <TextInput
              placeholder="e.g 034435434567"
              style={styles.input}
              placeholderTextColor="#737380"
            />
          </View>
          <TouchableOpacity style={styles.btn} onPress={makePayment}>
            <Text style={[appStyles.paragraph1, {color: colors.complimentary}]}>
              Pay Upto 150000
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
  backBtn: {
    flexDirection: 'row',
    width: '30%',
    alignItems: 'center',
  },

  label: {
    ...appStyles.bodyRg,
    color: colors.body_text,
  },
  input: {
    marginTop: 20,
    borderBottomColor: colors.body_text,
    borderBottomWidth: 1,
    paddingBottom: 10,
    color: colors.complimentary,
  },
  btn: {
    backgroundColor: '#ef0143',
    width: '90%',
    padding: 15,
    position: 'absolute',
    bottom: Platform.OS == 'ios' ? 60 : 40,
    alignSelf: 'center',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBtn: {
    borderBottomColor: 'white',
    paddingBottom: 10,
  },
});
