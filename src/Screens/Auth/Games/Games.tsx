import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { colors } from '../../../styles/colors';
import appStyles from '../../../styles/styles';
import { fetchGameList, generateCode } from '../../../Api/baishun';
import { useAppContext } from '../../../Context/AppContext';

interface Props {
  navigation: any;
}

const Games: React.FC<Props> = ({ navigation }) => {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { userAuthInfo, tokenMemo } = useAppContext();
  const { user } = userAuthInfo;

  const handlePlay = async (game: any) => {
    try {
      const code = await generateCode(user.id);

      navigation.navigate('WebViewGame', {
        url: game.download_url,
        user: user,
        code: code,
      });
    } catch (err) {
      console.error('Failed to get code:', err);
      Alert.alert('Error', 'Unable to start game. Please try again.');
    }
  };

  useEffect(() => {
    const loadGames = async () => {
      try {
        const data = await fetchGameList(2537349530, 'emolive');
        setGames(data);
      } catch (error) {
        console.error('Failed to fetch games', error);
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, []);

  const renderGameItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => handlePlay(item)}
      style={styles.gameCard}>
      <Image
        source={{ uri: item.preview_url }}
        style={{ width: 150, height: 120, borderRadius: 10 }}
        resizeMode="cover"
      />
      <Text style={styles.gameName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator color="#fff" size="large" />
      ) : (
        <FlatList
          contentContainerStyle={{ padding: 10 }}
          data={games}
          keyExtractor={(item) => item.game_id.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          renderItem={renderGameItem}
        />
      )}
    </View>
  );
};

export default Games;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark_gradient,
  },
  gameCard: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.body_text,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    width: '48%',
  },
  gameName: {
    ...appStyles.paragraph1,
    color: colors.complimentary,
    marginTop: 10,
    textAlign: 'center',
  },
});
