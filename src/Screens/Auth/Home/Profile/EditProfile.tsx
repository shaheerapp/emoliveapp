import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  Image,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../../../styles/colors';
import GeneralPermission from '../../../../Components/GeneralPermission';
import {RESULTS} from 'react-native-permissions';
import appStyles from '../../../../styles/styles';
import axiosInstance from '../../../../Api/axiosConfig';
import {launchImageLibrary} from 'react-native-image-picker';
import envVar from '../../../../config/envVar';
import {checkPermission} from '../../../../scripts/index';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAppContext} from '../../../../Context/AppContext';
interface EditProfile {
  navigation: any;
}
export default function EditProfile({navigation}: EditProfile) {
  const {userAuthInfo, tokenMemo} = useAppContext();
  const {user, setUser} = userAuthInfo;
  const {token} = tokenMemo;

  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(user);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [error, setError] = useState<any>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [gender, setGender] = useState('female');

  const updateGender = (valTab: string) => {
    setGender(valTab);
  };

  const updateProfile = async () => {
    try {
      let res;
      setLoading(true);
      if (selectedImage) {
        let formData = new FormData();
        // const formData = new FormData();

        formData.append('first_name', form.first_name);
        formData.append('last_name', form.last_name);
        formData.append('bio', form.bio);
        formData.append('address', form.address);
        formData.append('dob', form.dob);
        formData.append('gender', form.gender);
        formData.append('avatar', {
          uri: selectedImage.uri,
          type: selectedImage.type,
          name: selectedImage.fileName,
        });
        res = await axiosInstance.post('/profile-update', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        res = await axiosInstance.post('/profile-update', JSON.stringify(form));
      }

      console.log(res.data);
      setUser(res.data.user);
      setLoading(false);
      await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
    } catch (error: any) {
      clearError();
      setError(error.message);
    }
  };

  const selectImage = async () => {
    try {
      // Define options for the image picker
      const options = {
        mediaType: 'photo', // Specify that only photos should be picked
        quality: 1, // Highest quality for the image
      };
      // Launch the image library
      const result = await launchImageLibrary(options);
      if (result.didCancel) {
        // User canceled the image selection
        Alert.alert('Cancelled', 'Image selection was cancelled.');
      } else if (result.errorCode) {
        // Handle errors returned by the image picker
        Alert.alert('Error', `ImagePicker Error: ${result.errorMessage}`);
      } else if (result.assets && result.assets.length > 0) {
        // If successful, get the selected image asset
        const asset = result.assets[0];
        console.log('Selected Image:', asset);
        // Example: Call a function to handle the selected image
        setSelectedImage(asset); // Ensure setSelectedImage is defined in your state
      } else {
        // Handle the case where no assets are returned
        Alert.alert('Error', 'No image selected.');
      }
      setModal(false);
    } catch (error) {
      // Log unexpected errors
      setModal(false);
      console.error('Unexpected Error:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  const clearError = () => {
    setLoading(false);
    setTimeout(() => {
      setError(false);
    }, 4000);
  };

  // const
  const openGallery = async () => {
    let result = await checkPermission();
    console.log(result);
    if (result) {
      selectImage();

      return;
    }
    setModal(false);

    navigation.navigate('GeneralPermission', {type: 'gallery'});
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate('HomeB', {screen: 'Profile'})}
        style={styles.backBtn}>
        <Icon name="arrow-left-thin" color="#fff" size={40} />
      </TouchableOpacity>
      <View
        style={{
          alignSelf: 'center',
          alignItems: 'center',
          marginTop: Platform.OS == 'ios' ? 60 : 40,
        }}>
        <TouchableOpacity
          onPress={() => setModal(true)}
          style={{flexDirection: 'row', alignItems: 'center'}}>
          {selectedImage ? (
            <Image
              source={{uri: selectedImage.uri}}
              style={styles.imagePreview}
            />
          ) : (
            <Image
              style={styles.imagePreview}
              source={
                user.avatar
                  ? {
                      uri: envVar.API_URL + 'display-avatar/' + user.id,
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  : require('../../../../assets/images/place.jpg')
              }
              // source={require('../../../../assets/images/place.jpg')}
            />
          )}
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator
          size={'large'}
          color={'red'}
          style={appStyles.indicatorStyle}
        />
      ) : (
        <>
          <View style={{marginTop: 20, marginBottom: 100, paddingBottom: 50}}>
            <ScrollView>
              <View>
                <Text
                  style={{
                    color: '#737380',
                  }}>
                  First Name
                </Text>
                <TextInput
                  placeholder="Isabella Rose"
                  style={styles.input}
                  value={form?.first_name}
                  onChangeText={text => setForm({...form, first_name: text})}
                  placeholderTextColor="#737380"
                />
              </View>
              <View style={{marginVertical: 20}}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                  placeholder="Isabella Rose"
                  style={styles.input}
                  value={form?.last_name}
                  onChangeText={text => setForm({...form, last_name: text})}
                  placeholderTextColor="#737380"
                />
              </View>
              <View>
                <Text style={styles.label}>Bio</Text>
                <TextInput
                  placeholder="Save Earth and Spread Love...."
                  style={styles.input}
                  value={form?.bio}
                  onChangeText={text => setForm({...form, bio: text})}
                  placeholderTextColor="#737380"
                />
              </View>
              <View style={{marginTop: 20}}>
                <Text style={styles.label}>City</Text>
                <TextInput
                  placeholder="New York"
                  style={styles.input}
                  value={form?.address}
                  onChangeText={text => setForm({...form, address: text})}
                  placeholderTextColor="#737380"
                />
              </View>
              <View style={{marginTop: 20}}>
                <Text style={styles.label}>Date of Birth</Text>
                <TextInput
                  placeholder="Please Provide DOB"
                  style={{
                    borderBottomColor: 'grey',
                    borderBottomWidth: 1,
                    marginTop: 10,
                    paddingBottom: 10,
                    color: '#fff',
                  }}
                  value={form.dob}
                  // value="11 Sept 2001"
                  placeholderTextColor="#737380"
                />
              </View>
              <View style={{marginTop: 20, width: '98%'}}>
                <Text style={styles.label}>Gender</Text>
                <View style={styles.gender}>
                  <TouchableOpacity
                    onPress={() => setForm({...form, gender: 'female'})}
                    style={[
                      styles.genderBtn,
                      form.gender == 'female' && {backgroundColor: '#64566e'},
                      {
                        borderWidth: 1,
                        borderTopLeftRadius: 10,
                        borderBottomLeftRadius: 10,
                      },
                    ]}>
                    <Text style={styles.genderTxt}>Female</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setForm({...form, gender: 'male'})}
                    style={[
                      styles.genderBtn,
                      form.gender == 'male' && {backgroundColor: '#64566e'},

                      {borderTopWidth: 1, borderBottomWidth: 1},
                    ]}>
                    <Text style={styles.genderTxt}>Male</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setForm({...form, gender: 'other'})}
                    style={[
                      styles.genderBtn,
                      form.gender == 'other' && {backgroundColor: '#64566e'},
                      {
                        borderWidth: 1,
                        borderTopRightRadius: 10,
                        borderBottomEndRadius: 10,
                      },
                    ]}>
                    <Text style={styles.genderTxt}>Other</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity style={styles.btn} onPress={updateProfile}>
                <Text style={{color: '#fff', fontWeight: '600', fontSize: 17}}>
                  Save
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
          {/* <GeneralPermission /> */}
          {error && (
            <Text style={[appStyles.errorText, {marginVertical: 20}]}>
              {error}
            </Text>
          )}

          <Modal
            visible={modal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModal(false)}>
            {/* Backdrop */}
            <View style={styles.backdrop}>
              {/* Modal Content */}
              <View style={styles.modalView}>
                <Text style={[appStyles.title1, {color: colors.complimentary}]}>
                  Open Gallery
                </Text>
                <View style={{marginVertical: 20}}>
                  <Text
                    style={[appStyles.regularTxtMd, {color: colors.body_text}]}>
                    {/* {modalInfo.type == 'delete' */}
                    Select Image From Gallery
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={openGallery}
                  style={[styles.deleteButton]}>
                  <Text style={styles.deleteText}>Open Gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setModal(false)}
                  style={styles.cancelButton}>
                  <Text
                    style={[appStyles.paragraph1, {color: colors.unknown2}]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          {/* <TouchableOpacity style={styles.btn} onPress={updateProfile}>
            <Text style={{color: '#fff', fontWeight: '600', fontSize: 17}}>
              Save
            </Text>
          </TouchableOpacity> */}
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
    position: 'absolute',
    top: Platform.OS == 'android' ? 20 : 60,
    left: 10,
    alignItems: 'center',
    padding: 10,
    borderRadius: 16,
  },
  input: {
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    paddingBottom: 10,
    ...appStyles.paragraph1,
    marginTop: 10,
    color: colors.complimentary,
  },
  label: {
    ...appStyles.bodyRg,
    color: colors.body_text,
  },
  gender: {
    marginTop: 20,
    flexDirection: 'row',
    width: '99%',
    paddingRight: 10,
    alignItems: 'center',
  },
  modalView: {
    // width: 300,
    padding: 20,
    backgroundColor: colors.LG,
    // alignSelf: 'center',
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
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Custom RGBA backdrop color
    justifyContent: 'center',
    alignItems: 'center',
    // alignSelf: 'center',
  },
  modalBody: {
    marginBottom: 20,
  },
  centeredView: {
    flex: 1,
    // backgroundColor: 'red',
    opacity: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genderBtn: {
    borderColor: 'grey',
    justifyContent: 'center',
    padding: 15,
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
  cardCategory: {
    color: '#fff',
    marginVertical: 5,
    fontWeight: '500',
  },
  cardPeriod: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 16,
    marginVertical: 10,
    fontWeight: '500',
  },
  cardPrice: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 80,
    borderColor: colors.lines,
    borderWidth: 1,
  },
  card: {
    paddingTop: 10,
    width: '30%',
    height: 150,
    backgroundColor: '#302847',
    borderWidth: 1,
    borderColor: '#403f51',
    alignItems: 'center',
    borderRadius: 8,
  },
  btn: {
    backgroundColor: colors.accent,
    width: '99%',
    padding: 15,
    marginTop: 30,
    // position: 'absolute',
    // bottom: 60,
    alignSelf: 'center',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeCard: {
    borderColor: '#a30733',
    backgroundColor: '#291118',
  },
  vipText: {
    color: '#868791',
    marginVertical: 10,
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  tabBtn: {
    borderBottomColor: 'white',
    paddingBottom: 10,
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
  cardAmount: {
    backgroundColor: '#ed005c',
    borderRadius: 9,
    padding: 5,
    marginTop: -5,
  },
  userText: {
    marginTop: 10,
    textAlign: 'center',
    color: '#fff',
    fontWeight: '500',
    fontSize: 20,
  },
});
