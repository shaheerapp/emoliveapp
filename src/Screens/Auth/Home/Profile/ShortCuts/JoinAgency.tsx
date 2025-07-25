import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import appStyles from '../../../../../styles/styles';
import { colors } from '../../../../../styles/colors';
import IconF from 'react-native-vector-icons/FontAwesome6';
import {
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import axios from 'axios';
import axiosInstance from '../../../../../Api/axiosConfig';

export default function JoinAgency({ navigation }: any) {
  const [agencyCode, setAgencyCode] = useState('');
  const [hostType, setHostType] = useState<'audio' | 'video'>('audio');
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // Add error state
  const [success, setSuccess] = useState(''); // Add error state

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
        setDocument(source.uri);
      }
    });
  };

  const sendRequest = async () => {
    setError(''); // Clear previous errors
    setSuccess('');

    if (!agencyCode) {
      setError('Please enter agency code');
      return;
    }

    if (!document) {
      setError('Please upload your ID document');
      return;
    }

    try {
      setLoading(true);

      // Create form data
      const formData = new FormData();
      formData.append('agency_code', agencyCode);
      formData.append('host_type', hostType);

      // Append the image file if it exists
      if (document) {
        formData.append('document', {
          uri: document,
          type: 'image/jpeg',
          name: `${Date.now()}.jpg`,
        });
      }
      const response = await axiosInstance.post('/agency/add-host', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data) {
        setSuccess(response.data?.message);
        setAgencyCode('');
        setDocument(null);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[appStyles.backBtn]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left-thin" color={colors.complimentary} size={25} />
        </TouchableOpacity>
        <Text style={styles.heading}>Join Agency</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={{ marginTop: 30 }}>
          {/* Success Message Display */}
          {success ? (
            <View style={styles.successContainer}>
              <Text style={styles.successText}>{success}</Text>
            </View>
          ) : null}

          {/* Error Message Display */}
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
          <View>
            <Text style={{ color: '#737380' }}>Method 1</Text>
            <Text style={styles.text}>
              Agency will be provided by Agency code
            </Text>

            {/* Agency Code Input */}
            <TextInput
              placeholder="Type Agency code here"
              style={styles.input}
              placeholderTextColor="#737380"
              value={agencyCode}
              onChangeText={setAgencyCode}
            />

            {/* Host Type Selection */}
            <View style={styles.hostTypeContainer}>
              <Text style={styles.label}>Host Type:</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    hostType === 'audio' && styles.radioButtonSelected,
                  ]}
                  onPress={() => setHostType('audio')}
                >
                  <Text style={styles.radioText}>Audio</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    hostType === 'video' && styles.radioButtonSelected,
                  ]}
                  onPress={() => setHostType('video')}
                >
                  <Text style={styles.radioText}>Video</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Document Upload */}
            <View style={styles.uploadContainer}>
              <Text style={styles.label}>National ID Proof</Text>
              <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                <Text style={styles.uploadButtonText}>
                  {document ? 'ID Proof Selected' : 'Upload ID Proof (JPG/PNG)'}
                </Text>
                {document && (
                  <Image
                    source={{ uri: document }}
                    style={styles.previewImage}
                  />
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.btn1, loading && styles.disabledButton]}
              onPress={sendRequest}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text
                  style={{ color: '#fff', fontWeight: '600', fontSize: 17 }}
                >
                  Submit Request
                </Text>
              )}
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: 60 }}>
            <Text
              style={{
                color: '#737380',
              }}
            >
              Method 2
            </Text>
            <Text style={styles.text}>Ask Agency to Invite</Text>
            <Text style={styles.userText}>
              you are required to provide the agency admin with your id and host
              code
            </Text>
            <View style={{ marginTop: 30 }}>
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
              <Text style={{ color: '#fff', fontWeight: '600', fontSize: 17 }}>
                Submit Request
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  input: {
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginTop: 30,
    color: '#fff',
  },
  hostTypeContainer: {
    marginTop: 20,
  },
  label: {
    color: '#737380',
    marginBottom: 10,
  },
  radioGroup: {
    flexDirection: 'row',
    marginTop: 10,
  },
  radioButton: {
    borderWidth: 1,
    borderColor: '#737380',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  radioButtonSelected: {
    backgroundColor: '#ef0143',
    borderColor: '#ef0143',
  },
  radioText: {
    color: '#fff',
  },
  uploadContainer: {
    marginTop: 20,
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
  disabledButton: {
    opacity: 0.6,
  },
  previewImage: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 4,
  },

  errorContainer: {
    backgroundColor: '#ef014320',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ef0143',
  },
  errorText: {
    color: '#fff',
    textAlign: 'center',
  },

  successContainer: {
    backgroundColor: '#4CAF5020', // Light green background
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#4CAF50', // Green border
  },
  successText: {
    color: '#fff',
    textAlign: 'center',
  },
});
