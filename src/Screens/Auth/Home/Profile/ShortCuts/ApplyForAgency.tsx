import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  Modal,
  Platform,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../../../../styles/colors';
import {
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import axiosInstance from '../../../../../Api/axiosConfig';
import { useAppContext } from '../../../../../Context/AppContext';

export default function ApplyForAgency({ navigation }: any) {
  const { userAuthInfo, tokenMemo } = useAppContext();
  const { user, setUser } = userAuthInfo;
  const { token } = tokenMemo;
  const [formData, setFormData] = useState({
    owner_name: '',
    agency_name: '',
    email: '',
    whatsapp_number: '',
    country: 'India',
    country_code: '91',
    password: '',
    password_confirmation: '',
  });
  const [nicImage, setNicImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const countries = [
    { name: 'India', code: '91' },
    { name: 'Pakistan', code: '92' },
    { name: 'Bangladesh', code: '880' },
  ];

  const handleCountryChange = (countryName: any) => {
    const selectedCountry = countries.find(c => c.name === countryName);
    setFormData({
      ...formData,
      country: countryName,
      country_code: selectedCountry?.code || '91',
    });
    setShowDropdown(false);
  };

  const pickImage = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1000,
      maxHeight: 1000,
    };

    launchImageLibrary(options, (response: any) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        Alert.alert('Error', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const source = response.assets[0];
        setNicImage(source.uri);
      }
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Create FormData for file upload
      const formDataToSend = new FormData();

      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formDataToSend.append(key, value);
        }
      });

      // Append the image file if it exists
      if (nicImage) {
        formDataToSend.append('nic', {
          uri: nicImage,
          type: 'image/jpeg',
          name: `${Date.now()}.jpg`,
        });
      }
      const response = await axiosInstance.post(
        '/agency-request',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      if (response.data.success) {
        Alert.alert(
          'Application Submitted',
          'Your agency application has been submitted successfully!',
          [{ text: 'OK', onPress: () => navigation.goBack() }],
        );
      }
    } catch (error) {
      console.error('error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-left-thin" color={colors.complimentary} size={25} />
          <Text style={styles.heading}>Apply for Agency</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }}>
        <View style={styles.formContainer}>
          {/* Owner Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Owner Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor="#666"
              value={formData.owner_name}
              onChangeText={text =>
                setFormData({ ...formData, owner_name: text })
              }
            />
          </View>

          {/* Agency Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Agency Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter agency name"
              placeholderTextColor="#666"
              value={formData.agency_name}
              onChangeText={text =>
                setFormData({ ...formData, agency_name: text })
              }
            />
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#666"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={text => setFormData({ ...formData, email: text })}
            />
          </View>

          {/* Country */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Country</Text>
            <TouchableOpacity
              style={styles.customSelect}
              onPress={() => setShowDropdown(true)}
            >
              <Text style={styles.selectText}>{formData.country}</Text>
              <Icon name="chevron-down" size={20} color="#fff" />
            </TouchableOpacity>

            {/* Custom Dropdown */}
            <Modal
              visible={showDropdown}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setShowDropdown(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.dropdownContainer}>
                  {countries.map(country => (
                    <TouchableOpacity
                      key={country.code}
                      style={styles.dropdownItem}
                      onPress={() => handleCountryChange(country.name)}
                    >
                      <Text style={styles.dropdownItemText}>
                        {country.name}
                      </Text>
                      {formData.country === country.name && (
                        <Icon
                          name="check"
                          size={20}
                          color={colors.complimentary}
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </Modal>
          </View>

          {/* WhatsApp Number */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>WhatsApp Number</Text>
            <View style={styles.phoneInputContainer}>
              <View style={styles.countryCodeContainer}>
                <Text style={styles.countryCodeText}>
                  +{formData.country_code}
                </Text>
              </View>
              <TextInput
                style={[styles.input, styles.phoneInput]}
                placeholder="Enter WhatsApp number"
                placeholderTextColor="#666"
                keyboardType="phone-pad"
                value={formData.whatsapp_number}
                onChangeText={text =>
                  setFormData({ ...formData, whatsapp_number: text })
                }
              />
            </View>
          </View>

          {/* National ID */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>National ID Proof</Text>
            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
              <Text style={styles.uploadButtonText}>
                {nicImage ? 'ID Proof Selected' : 'Upload ID Proof (JPG/PNG)'}
              </Text>
              {nicImage && (
                <Image source={{ uri: nicImage }} style={styles.previewImage} />
              )}
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Submitting...' : 'Submit Application'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d1f31',
  },
  header: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#2d2f42',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heading: {
    fontSize: 20,
    marginLeft: 15,
    fontWeight: '600',
    color: '#fff',
  },
  formContainer: {
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: '#fff',
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#2d2f42',
    color: '#fff',
    borderRadius: 8,
    padding: Platform.OS === 'ios' ? 15 : 12,
    fontSize: 16,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCodeContainer: {
    backgroundColor: '#2d2f42',
    padding: Platform.OS === 'ios' ? 15 : 12,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    marginRight: 2,
  },
  countryCodeText: {
    color: '#fff',
    fontSize: 16,
  },
  phoneInput: {
    flex: 1,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  customSelect: {
    backgroundColor: '#2d2f42',
    borderRadius: 8,
    padding: Platform.OS === 'ios' ? 15 : 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectText: {
    color: '#fff',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    backgroundColor: '#2d2f42',
    width: '80%',
    borderRadius: 8,
    padding: 10,
  },
  dropdownItem: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#3d3f52',
  },
  dropdownItemText: {
    color: '#fff',
    fontSize: 16,
  },
  uploadButton: {
    backgroundColor: '#2d2f42',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  previewImage: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 4,
  },
  submitButton: {
    backgroundColor: colors.complimentary,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
  },
});
