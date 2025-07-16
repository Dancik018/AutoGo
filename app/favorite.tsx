import { Text, View } from 'react-native';
export default function FavoriteScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#007AFF' }}>Favorite</Text>
      <Text style={{ marginTop: 12, color: '#888' }}>Aici vor apărea favoritele tale.</Text>
    </View>
  );
} 