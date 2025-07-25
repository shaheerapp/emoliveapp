import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import appStyles from '../../../../../styles/styles';
import { colors } from '../../../../../styles/colors';
import axios from 'axios';
import axiosInstance from '../../../../../Api/axiosConfig';
import envVar from '../../../../../config/envVar';
import { useAppContext } from '../../../../../Context/AppContext';

export default function Agencies({ navigation }: any) {
  const { userAuthInfo, tokenMemo } = useAppContext();
  const { user, setUser } = userAuthInfo;
  const { token } = tokenMemo;
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAgencies = async () => {
    try {
      const response = await axiosInstance(`/agency-all`);
      setAgencies(response.data.data);
    } catch (err) {
      setError('Failed to load agencies');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('agencies: ', agencies);
    fetchAgencies();
  }, []);

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator size="large" color={colors.complimentary} />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <Text style={{ color: '#fff' }}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            setError('');
            fetchAgencies();
          }}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[appStyles.backBtn]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Icon name="arrow-left-thin" color={colors.complimentary} size={25} />
          <Text style={styles.heading}>Agencies</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ marginTop: 20 }}>
        {agencies.map((agency: any) => (
          <View key={agency.id} style={styles.userSection}>
            <TouchableOpacity
              style={styles.profile}
              onPress={() =>
                navigation.navigate('AgencyMembers', { agencyId: agency.id })
              }
            >
              {agency.owner?.avatar ? (
                <Image
                  style={{ width: 50, height: 50, borderRadius: 25 }}
                  source={
                    agency.owner.avatar
                      ? {
                          uri:
                            envVar.API_URL +
                            'display-avatar/' +
                            agency.owner.id,
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        }
                      : require('../../../../../assets/images/place.jpg')
                  }
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={{ color: '#fff', fontSize: 20 }}>
                    {agency.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <View style={{ marginLeft: 20 }}>
                <Text style={styles.userText}>{agency.name}</Text>
                <Text style={styles.agencyCode}>Code: {agency.code}</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '90%',
                  }}
                >
                  <Text style={styles.userDesc}>Country: {agency.country}</Text>
                  <Text style={styles.userDesc}>
                    Members:{' '}
                    {
                      agency.hosts.filter(
                        (host: any) => host.id !== agency.owner.id,
                      ).length
                    }
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        ))}
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
  heading: {
    fontSize: 22,
    marginLeft: 20,
    fontWeight: '600',
    color: '#fff',
  },
  userSection: {
    marginTop: 20,
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  userText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 20,
  },
  agencyCode: {
    color: colors.complimentary,
    fontSize: 14,
    marginTop: 2,
  },
  userDesc: {
    color: '#82838d',
    marginTop: 5,
    fontWeight: '500',
    fontSize: 14,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2d2f42',
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: colors.complimentary,
    borderRadius: 5,
  },
  retryText: {
    color: '#000',
    fontWeight: 'bold',
  },
});
