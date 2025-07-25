import React from 'react';
import { Dimensions, View, TouchableOpacity, StyleSheet } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Carousel, {
  ICarouselInstance,
  Pagination,
} from 'react-native-reanimated-carousel';
import { colors } from '../styles/colors';
import envVar from '../config/envVar';
import FastImage from 'react-native-fast-image';

const Banners = ({ banners }: any) => {
  const carouselRef = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const screenWidth = Dimensions.get('window').width;
  const itemWidth = screenWidth - 32; // Full width minus padding
  const itemHeight = itemWidth / 3; // 3:1 aspect ratio

  return (
    <View style={styles.container}>
      <Carousel
        ref={carouselRef}
        width={itemWidth}
        height={itemHeight}
        data={banners}
        onProgressChange={progress}
        autoPlay={true}
        autoPlayInterval={5000}
        style={styles.carousel}
        snapEnabled={true}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 1,
          parallaxScrollingOffset: 0,
        }}
        renderItem={({ item }: any) => (
          <TouchableOpacity activeOpacity={0.9} style={styles.bannerItem}>
            <FastImage
              source={{ uri: `${envVar.IMAGES_URL}${item.image}` }}
              style={styles.bannerImage}
              resizeMode={FastImage.resizeMode.cover}
            />
          </TouchableOpacity>
        )}
      />

      {/* <Pagination.Basic
        progress={progress}
        data={banners}
        dotStyle={styles.dotStyle}
        activeDotStyle={styles.activeDotStyle}
        containerStyle={styles.paginationContainer}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
  },
  carousel: {
    width: '100%',
    overflow: 'hidden',
  },
  bannerItem: {
    width: '98%',
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 8,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  //   dotStyle: {
  //     width: 8,
  //     height: 8,
  //     borderRadius: 4,
  //     backgroundColor: 'rgba(0, 0, 0, 0.2)',
  //     marginHorizontal: 4,
  //   },
  //   activeDotStyle: {
  //     width: 12,
  //     height: 8,
  //     borderRadius: 4,
  //     backgroundColor: colors.complimentary,
  //   },
  //   paginationContainer: {
  //     paddingHorizontal: 16,
  //   },
});

export default Banners;
