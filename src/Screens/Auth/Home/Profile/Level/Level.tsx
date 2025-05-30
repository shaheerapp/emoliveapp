import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  Image,
  FlatList,
  StatusBar,
} from 'react-native';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../../../../styles/colors';
import appStyles from '../../../../../styles/styles';
import {IMAGES} from '../../../../../assets/images';
import {LEVELIMAGES} from '../../../../../assets/levelImages';

const deviceHeight = Dimensions.get('window').height;
const totalLevels = 20;
const achievedLevels = 19;
const progressPercentage = (achievedLevels / totalLevels) * 100;
const dummyData = [
  {
    id: '1',
    icon: LEVELIMAGES.icon10,
    count: 5,
    label: '1234243',
    image: LEVELIMAGES.lvl5,
  },
  {
    id: '2',
    icon: LEVELIMAGES.icon10,

    count: 10,
    label: '9876543',
    image: LEVELIMAGES.lvl10,
  },
  {
    id: '3',
    icon: LEVELIMAGES.icon10,
    count: 15,
    label: '9876543',
    image: LEVELIMAGES.lvl15,
  },
  {
    id: '4',
    icon: LEVELIMAGES.icon20,
    count: 20,
    label: '9876543',
    image: LEVELIMAGES.lvl20,
  },
  {
    id: '5',
    icon: LEVELIMAGES.icon25,
    count: 25,
    label: '9876543',
    image: LEVELIMAGES.lvl25,
  },
  {
    id: '6',
   icon: LEVELIMAGES.icon10,
   
    count: 30,
    label: '9876543',
    image: LEVELIMAGES.lvl30,
  },
  {
    id: '7',
    icon: LEVELIMAGES.icon35,
    count: 35,
    label: '9876543',
    image: LEVELIMAGES.lvl35,
  },
  {
    id: '8',
    icon: LEVELIMAGES.icon10,
    count: 40,
    label: '9876543',
    image: LEVELIMAGES.lvl40,
  },
  {
    id: '9',
    icon: LEVELIMAGES.icon45,
    count: 45,
    label: '9876543',
    image: LEVELIMAGES.lvl45,
  },
  {
    id: '10',
    icon: LEVELIMAGES.icon50,
    count: 50,
    label: '9876543',
    image: LEVELIMAGES.lvl50,
  },
  {
    id: '11',
    icon: LEVELIMAGES.icon10,
    count: 55,
    label: '9876543',
    image: LEVELIMAGES.lvl55,
  },
  {
    id: '12',
    icon: LEVELIMAGES.icon60,
    count: 60,
    label: '9876543',
    image: LEVELIMAGES.lvl60,
  },
  {
    id: '13',
    icon: LEVELIMAGES.icon65,
    count: 65,
    label: '9876543',
    image: LEVELIMAGES.lvl65,
  },
  {
    id: '15',
    icon: LEVELIMAGES.icon70,
    count: 70,
    label: '9876543',
    image: LEVELIMAGES.lvl70,
  },
  {
    id: '16',
    icon: LEVELIMAGES.icon75,
    count: 75,
    label: '9876543',
    image: LEVELIMAGES.lvl75,
  },
  {
    id: '17',
    icon: LEVELIMAGES.icon80,
    count: 80,
    label: '9876543',
    image: LEVELIMAGES.lvl80,
  },
  {
    id: '18',
    icon: LEVELIMAGES.icon85,
    count: 85,
    label: '9876543',
    image: LEVELIMAGES.lvl85,
  },
  {
    id: '19',
    icon: LEVELIMAGES.icon90,
    count: 90,
    label: '9876543',
    image: LEVELIMAGES.lvl90,
  },
  {
    id: '20',
    icon: LEVELIMAGES.icon95,
    count: 95,
    label: '987654355',
    image: LEVELIMAGES.lvl95,
  },
  {
    id: '20',
    icon: LEVELIMAGES.icon100,
    count: 100,
    label: '987654355',
    image: LEVELIMAGES.lvl100,
  },
];

export default function Level({navigation}) {
  const renderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <ImageBackground style={styles.iconContainer} source={item.image}>
        <View style={styles.imageWrapper}>
          <Image source={item.icon} style={styles.iconImage} />
        </View>
        <Text style={styles.countText}>{item.count}</Text>
      </ImageBackground>
      <View style={styles.labelWrapper}>
        <Text numberOfLines={1} style={styles.labelText}>
          {item.label}
        </Text>
      </View>
    </View>
  );

  return (
    <ImageBackground source={IMAGES.bglevel} style={styles.container}>
      <StatusBar barStyle={"dark-content"} />
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <IconM name="chevron-left" size={25} color={colors.complimentary} />
        </TouchableOpacity>

        <View style={styles.headerTitleWrapper}>
          <Text style={[appStyles.headline, styles.headerTitle]}>My Level</Text>
        </View>
      </View>

      <ImageBackground source={IMAGES.bglevel} style={styles.innerContainer}>
        <ImageBackground source={IMAGES.level} style={styles.levelImage} />
        <Text style={styles.levelLabel}>170.80M/250.00M</Text>

        <View style={styles.progressWrapper}>
          <View style={styles.progressRow}>
            <Text style={styles.levelLabel}>Lv {achievedLevels}</Text>
            <View style={styles.progressBar}>
              <View
                style={[styles.achievedBar, {width: `${progressPercentage}%`}]}
              />
            </View>
            <Text style={styles.levelLabel}>Lv {totalLevels}</Text>
          </View>
        </View>
        <FlatList
          data={dummyData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      </ImageBackground>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    backgroundColor: colors.secondary,
    zIndex: 10000,
  },
  headerRow: {
    marginTop: 70,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitleWrapper: {
    width: '85%',
  },
  headerTitle: {
    color: colors.complimentary,
    textAlign: 'center',
  },
  innerContainer: {
    flex: 1,
    marginTop: 30,
    paddingBottom: 40,
    backgroundColor: colors.pimary,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    zIndex: 999,
    overflow: 'hidden',
  },
  levelImage: {
    height: deviceHeight * 0.2,
    width: deviceHeight * 0.24,
    alignSelf: 'center',
  },
  listContent: {
    paddingHorizontal: 10,
    marginTop: 10,
  },
  progressWrapper: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 10,
    backgroundColor: 'yellow',
    borderRadius: 5,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  achievedBar: {
    height: '100%',
    backgroundColor: 'orange',
  },
  levelLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 20,
    padding: 5,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.white,
    borderRadius: 30,
    width: deviceHeight * 0.1,
    justifyContent: 'space-between',overflow:"hidden"
  },
  imageWrapper: {
    height: 25,
    width: 25,
    backgroundColor: colors.white,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    height: 25,
    width: 25,
  },
  countText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Kanit',
    color: colors.white,
    marginRight: 10,
  },
  labelWrapper: {
    maxWidth: deviceHeight * 0.13,
  },
  labelText: {
    ...appStyles.headline2,
    color: colors.white,
    textAlign: 'left',
  },
});
