import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../styles/colors';
import appStyles from '../../styles/styles';
import NetInfo from '@react-native-community/netinfo';
import {useAppContext} from '../../Context/AppContext';

export default function ConnectionError() {
  // import
  const {netConnection} = useAppContext();
  const {setConnection} = netConnection;
  const retryConnection = async () => {
    NetInfo.fetch().then(state => {
      console.log('connection ::', state.isConnected);
      if (state.isConnected) {
        setConnection(true);
      } else {
        setConnection(false);
      }
    });
  };
  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: '600',
          // marginVertical: 10,
          color: colors.complimentary,
        }}>
        Disconnected
      </Text>
      <Icon name="access-point-off" size={90} color={colors.body_text} />
      <Text style={{color: colors.accent, fontSize: 18, marginVertical: 10}}>
        Please check internet Connection .!!
      </Text>
      <TouchableOpacity
        onPress={retryConnection}
        style={{
          backgroundColor: colors.accent,
          paddingHorizontal: 20,
          paddingVertical: 5,
          borderRadius: 9,
        }}>
        <Text style={[appStyles.headline, {color: colors.complimentary}]}>
          Retry !
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.LG,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
