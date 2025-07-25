import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');
const WALLPAPER_BASE_URL =
  'https://emolivestreaming.online/wallpapers/wallpaper-';
const WALLPAPER_COUNT = 11;

interface RoomSkinProps {
  navigation: any;
  handleWallpaperSelect: any;
}

export default function RoomSkin({
  navigation,
  handleWallpaperSelect,
}: RoomSkinProps) {
  const { selectedWallpaper } = useSelector((state: any) => state.users);

  const wallpapers = Array.from({ length: WALLPAPER_COUNT }, (_, i) => i + 1);

  return (
    <ScrollView
      contentContainerStyle={styles.wallpaperContainer}
      nestedScrollEnabled={true}
    >
      {wallpapers.map(number => {
        const currentWallpaperUrl = `${WALLPAPER_BASE_URL}${number}.jpeg`;
        const isSelected = selectedWallpaper === currentWallpaperUrl;

        return (
          <View
            key={number}
            style={[styles.wallpaperItem, isSelected && styles.selectedItem]}
          >
            <TouchableOpacity
              onPress={() => handleWallpaperSelect(number)}
              activeOpacity={0.7}
            >
              <Image
                style={styles.wallpaperImage}
                source={{ uri: currentWallpaperUrl }}
                resizeMode="cover"
              />
              {isSelected && (
                <View style={styles.checkIconContainer}>
                  <Icon
                    name="check-circle-outline"
                    size={30}
                    color="#4CAF50"
                    style={styles.checkIcon}
                  />
                </View>
              )}
            </TouchableOpacity>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wallpaperContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
  },
  wallpaperItem: {
    width: width * 0.45,
    height: 250,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    position: 'relative', // Needed for absolute positioning of check icon
  },
  wallpaperImage: {
    width: '100%',
    height: '100%',
  },
  selectedItem: {
    borderWidth: 2,
    borderColor: '#4CAF50',
    width: width * 0.45,
    height: 250,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    position: 'relative',
  },
  checkIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 15,
    padding: 2,
    zIndex: 9999,
  },
  checkIcon: {
    // Additional icon styling if needed
  },
});
