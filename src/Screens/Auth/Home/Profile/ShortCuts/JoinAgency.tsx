import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import appStyles from '../../../../../styles/styles';
import {colors} from '../../../../../styles/colors';
import IconF from 'react-native-vector-icons/FontAwesome6';
export default function JoinAgency({navigation}) {
  const [tab, setTab] = useState(1);
  const [gender, setGender] = useState('female');

  const updateGender = (valTab: string) => {
    setGender(valTab);
  };
  const updateTab = (valTab: number) => {
    setTab(valTab);
  };

  const sendRequest = () => {
    try {
      alert('please wait ...');
    } catch (error) {}
  };
  return (
    <View style={styles.container}>
      <View style={[appStyles.backBtn]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left-thin" color={colors.complimentary} size={25} />
        </TouchableOpacity>
        <Text style={styles.heading}>Join Agency</Text>
      </View>

      <View style={{marginTop: 30}}>
        <View>
          <Text
            style={{
              color: '#737380',
            }}>
            Method 1
          </Text>
          <Text style={styles.text}>Join Agency</Text>
          <Text style={styles.userText}>Agency will be provided by Agency</Text>
          <TextInput
            placeholder="Type Agency code here"
            style={{
              borderBottomColor: 'grey',
              borderBottomWidth: 1,
              paddingBottom: 10,
              marginTop: 10,
            }}
            placeholderTextColor="#737380"
          />
          <TouchableOpacity style={styles.btn1} onPress={sendRequest}>
            <Text style={{color: '#fff', fontWeight: '600', fontSize: 17}}>
              Submit Request
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{marginTop: 60}}>
          <Text
            style={{
              color: '#737380',
            }}>
            Method 2
          </Text>
          <Text style={styles.text}>Ask Agency to Invite</Text>
          <Text style={styles.userText}>
            you are required to provide the agency admin with your id and host
            code
          </Text>
          <View style={{marginTop: 30}}>
            <TextInput
              placeholder="Enter admin ID"
              style={{
                borderBottomColor: 'grey',
                borderBottomWidth: 1,
                paddingBottom: 10,
                marginTop: 10,
              }}
              placeholderTextColor="#737380"
            />
            <TextInput
              placeholder="Enter host code"
              style={{
                marginTop: 30,
                borderBottomColor: 'grey',
                borderBottomWidth: 1,
                paddingBottom: 10,
                fontSize: 15,
              }}
              placeholderTextColor="#737380"
            />
          </View>

          <TouchableOpacity style={styles.btn1} onPress={sendRequest}>
            <Text style={{color: '#fff', fontWeight: '600', fontSize: 17}}>
              Submit Request
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
    width: '30%',
    // position: 'absolute',
    top: 20,
    left: 10,
    alignItems: 'center',
    padding: 10,
    borderRadius: 16,
  },
  heading: {
    fontSize: 22,
    marginLeft: 20,
    fontWeight: '600',
    color: '#fff',
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
  image: {
    flex: 1,
    // display: 'flex',
    // justifyContent: 'space-around',
  },
  btn1: {
    marginTop: 40,
    backgroundColor: '#ef0143',
    width: '90%',
    padding: 15,
    alignSelf: 'center',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    width: '25%',
  },
  infoHeading: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '500',
    marginLeft: 5,
  },
  infoText: {
    color: '#868791',
    fontSize: 17,
    fontWeight: '500',
  },
  text: {
    marginTop: 10,
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
  },
  userText: {
    marginTop: 10,
    // textAlign: 'center',
    color: '#666673',
    fontWeight: '500',
    fontSize: 16,
  },
});
