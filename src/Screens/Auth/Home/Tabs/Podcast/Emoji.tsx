import {
  View,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import appStyles from '../../../../../styles/styles';
import { colors } from '../../../../../styles/colors';

export default function Emoji({ handleEmojiPress }: any) {
  const sampleEmojis = [
    { id: 1, image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f600.png' },
    { id: 2, image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f601.png' },
    { id: 3, image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f602.png' },
    { id: 4, image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f603.png' },
    { id: 5, image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f604.png' },
    { id: 6, image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f605.png' },
    { id: 7, image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f606.png' },
    { id: 8, image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f607.png' },
    { id: 9, image: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f609.png' },
  ];

  const screenWidth = Dimensions.get('window').width;
  const itemWidth = (screenWidth - 40) / 4;

  const renderEmojiItem = ({ item }: any) => (
    <TouchableOpacity
      style={[styles.gridItem, { width: itemWidth }]}
      onPress={() => handleEmojiPress(item.image)}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.gridImage}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );

  return (
    <View style={{ width: '99%', flex: 1 }}>
      <FlatList
        data={sampleEmojis}
        renderItem={renderEmojiItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={4}
        contentContainerStyle={styles.gridContainer}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
  gridImage: {
    width: 50,
    height: 50,
  },
});


