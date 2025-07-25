import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import appStyles from '../../../../../styles/styles';
import { colors } from '../../../../../styles/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { envVar } from './podcastImport';
import LottieView from 'lottie-react-native';
import { formatNumber } from '../../../../../utils/generalScript';

export default function Gifts({
  sendGift,
  podcastListeners,
  podcastHost,
  token,
  hostUser,
  currentUser,
  closeGiftSheet,
}: any) {
  const [tab, setTab] = useState(1);
  const [gifs, setGifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUserID, setSelectedUserID] = useState(podcastHost);
  const [receiverUser, setRceiverUser] = useState(
    hostUser.first_name + ' ' + hostUser.last_name,
  );
  const [selectedGift, setSelectedGift] = useState<any>(null); // Track selected gift
  const [customAmount, setCustomAmount] = useState(''); // For custom amount input

  useEffect(() => {
    fetchGifs();
  }, []);

  const fetchGifs = async () => {
    try {
      const response = await axios.get(`${envVar.API_URL}gifs-all`);
      setGifs(response.data.data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSendGift = () => {
    if (!selectedGift) {
      // Show error message if no gift selected
      Alert.alert('Error', 'Please select a gift first');
      return;
    }

    sendGift(
      selectedGift.id,
      selectedUserID,
      currentUser.id,
      receiverUser,
      selectedGift.coins,
    );

    // Reset selection after sending
    setSelectedGift(null);
    setCustomAmount('');
    closeGiftSheet();
  };

  const screenWidth = Dimensions.get('window').width;
  const itemWidth = (screenWidth - 40) / 4; // 40 = total horizontal padding (20 each side)

  const renderGifItem = ({ item }: any) => (
    <TouchableOpacity
      style={[
        styles.gridItem,
        {
          width: itemWidth,
          backgroundColor:
            selectedGift?.id === item.id ? colors.dark_gradient : 'transparent',
        },
      ]}
      onPress={() => setSelectedGift(item)}
    >
      <View style={styles.svgaContainer}>
        <LottieView
          style={styles.gridImage}
          source={{ uri: `${envVar.IMAGES_URL}${item.image}` }}
          autoPlay
          loop
        />
        {selectedGift?.id === item.id && (
          <View style={styles.selectedGiftBadge}>
            <Ionicons
              name="checkmark-circle"
              size={24}
              color={colors.complimentary}
            />
          </View>
        )}
      </View>
      <Text style={styles.gridName}>{item.name}</Text>
      <Text style={styles.gridCoins}>{item.coins} coins</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* User selection FlatList (unchanged) */}
      <FlatList
        data={podcastListeners}
        renderItem={({ item }) =>
          item.user &&
          item.user.id !== podcastHost && (
            <TouchableOpacity
              onPress={() => {
                setSelectedUserID(item.user.id);
                setRceiverUser(
                  item.user.first_name + ' ' + item.user.last_name,
                );
              }}
              style={{ position: 'relative', marginHorizontal: 8 }}
            >
              <Image
                source={
                  item?.user.avatar
                    ? {
                        uri: envVar.API_URL + 'display-avatar/' + item?.user.id,
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    : require('../../../../../assets/images/place.jpg')
                }
                style={styles.userAvatar}
              />
              {selectedUserID === item.user.id && (
                <View style={styles.selectedUserBadge}>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={16}
                    color="green"
                  />
                </View>
              )}
            </TouchableOpacity>
          )
        }
        keyExtractor={(item: any, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        horizontal
        ListHeaderComponent={
          <TouchableOpacity
            onPress={() => {
              setSelectedUserID(podcastHost);
              setRceiverUser(hostUser.first_name + ' ' + hostUser.last_name);
            }}
            style={{ position: 'relative' }}
          >
            <Image
              source={
                hostUser.avatar
                  ? {
                      uri: envVar.API_URL + 'display-avatar/' + hostUser.id,
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  : require('../../../../../assets/images/place.jpg')
              }
              style={styles.userAvatar}
            />
            {selectedUserID === podcastHost && (
              <View style={styles.selectedUserBadge}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={16}
                  color="green"
                />
              </View>
            )}
          </TouchableOpacity>
        }
      />

      {/* Tabs (unchanged) */}
      <View style={styles.sheetTab}>
        <TouchableOpacity
          onPress={() => setTab(1)}
          style={[
            styles.sheetBtn,
            tab == 1 && { borderBottomColor: colors.complimentary },
          ]}
        >
          <Text style={[tab == 1 && { color: colors.complimentary }]}>
            Gifts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setTab(2)}
          style={[
            styles.sheetBtn,
            tab == 2 && { borderBottomColor: colors.complimentary },
            { marginLeft: 10 },
          ]}
        >
          <Text style={[tab == 2 && { color: colors.complimentary }]}>
            Lucky Gifts
          </Text>
        </TouchableOpacity>
      </View>

      {/* Gifts Grid */}
      <FlatList
        data={gifs}
        renderItem={renderGifItem}
        keyExtractor={(item: any) => item.id.toString()}
        numColumns={4}
        contentContainerStyle={styles.gridContainer}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />

      {/* Bottom Action Bar */}
      <View style={styles.bottomActionBar}>
        <Text style={styles.balanceText}>
          💎 {formatNumber(currentUser?.wallet?.diamonds || 0)}
        </Text>

        <View style={styles.amountInputContainer}>
          <TextInput
            style={styles.amountInput}
            placeholder="Enter Coin Amount"
            placeholderTextColor="#666"
            value={customAmount}
            onChangeText={setCustomAmount}
            keyboardType="numeric"
          />
          {selectedGift && (
            <Text style={styles.selectedGiftText}>
              {customAmount.trim() ? customAmount : selectedGift.coins} coins
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSendGift}
          disabled={!selectedGift}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '99%',
    flex: 1,
    position: 'relative',
  },
  userAvatar: {
    backgroundColor: colors.complimentary,
    height: 30,
    width: 30,
    borderRadius: 15,
  },
  selectedUserBadge: {
    position: 'absolute',
    right: 5,
    top: 5,
    left: 5,
    bottom: 5,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 2,
  },
  sheetTab: {
    marginVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  sheetBtn: {
    paddingBottom: 10,
    borderBottomWidth: 2,
    justifyContent: 'center',
    width: '40%',
  },
  gridContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  gridItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    borderRadius: 8,
  },
  svgaContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    position: 'relative',
  },
  selectedGiftBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
  },
  gridImage: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  gridName: {
    ...appStyles.smallTxt,
    color: colors.complimentary,
    marginTop: 5,
    textAlign: 'center',
  },
  gridCoins: {
    ...appStyles.smallTxt,
    color: colors.pimary,
    textAlign: 'center',
  },
  bottomActionBar: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#1D1F31',
    borderTopColor: '#494759',
    paddingVertical: 15,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
  },
  balanceText: {
    color: 'white',
    fontSize: 13,
    marginRight: 10,
  },
  amountInputContainer: {
    flex: 1,
    marginLeft: 10,
    position: 'relative',
  },
  amountInput: {
    backgroundColor: '#292b3c',
    color: colors.complimentary,
    padding: 10,
    borderRadius: 10,
    width: '100%',
  },
  selectedGiftText: {
    position: 'absolute',
    right: 10,
    top: 10,
    color: colors.complimentary,
    fontSize: 12,
  },
  sendButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.primary_gradient,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    opacity: 1, // Change opacity based on selection
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    ...appStyles.bodyMd,
    color: colors.complimentary,
  },
});
