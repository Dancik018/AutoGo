import BottomNavigation from '@/components/BottomNavigation';
import { getCars } from '@/services/carService';
import { getFavorites, removeFavorite } from '@/services/database';
import { imageMap } from '@/services/image-map';
import { useUser } from '@/services/userContext';
import { Car } from '@/types/car';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function FavoriteScreen() {
  const router = useRouter();
  const { currentUser } = useUser();
  const [favoriteCars, setFavoriteCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      loadFavorites();
    }
  }, [currentUser]);

  const loadFavorites = () => {
    if (!currentUser) return;

    getFavorites(currentUser.id, (favorites, error) => {
      if (error) {
        console.error('Error loading favorites:', error);
        setLoading(false);
        return;
      }
      
      const cars = getCars();
      const favoriteCarIds = favorites.map(f => f.car_id);
      const favoriteCarsList = cars.filter(car => favoriteCarIds.includes(car.id));
      setFavoriteCars(favoriteCarsList);
      setLoading(false);
    });
  };

  const handleRemoveFavorite = (carId: number) => {
    if (!currentUser) return;

    removeFavorite(currentUser.id, carId, (success, error) => {
      if (error) {
        console.error('Error removing favorite:', error);
      } else if (success) {
        setFavoriteCars(prev => prev.filter(car => car.id !== carId));
      }
    });
  };

  const handleCarPress = (carId: number) => {
    router.push({ pathname: '/car/[id]', params: { id: carId.toString() } });
  };

  if (!currentUser) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-xl font-bold text-gray-600 mb-4">Please log in</Text>
        <Text className="text-gray-500">You need to be logged in to view your favorites.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg text-gray-600">Loading favorites...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="px-6 pt-12 pb-6 bg-white">
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#111', textAlign: 'center', marginBottom: 8 }}></Text>
        <Text className="text-3xl font-bold text-[#23292B] text-center mb-2">My Favorites</Text>
        <Text className="text-gray-500 text-center">Your saved cars</Text>
      </View>

      {favoriteCars.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <FontAwesome name="heart" size={64} color="#ddd" />
          <Text className="text-xl font-semibold text-gray-400 mt-4">No favorites yet</Text>
          <Text className="text-gray-400 mt-2">Start exploring cars and add them to your favorites!</Text>
        </View>
      ) : (
        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false} style={{ paddingBottom: 80 }}>
          {favoriteCars.map((car) => (
            <TouchableOpacity
              key={car.id}
              className="bg-white rounded-2xl mb-4 shadow-lg border border-gray-100"
              style={{ elevation: 4 }}
              onPress={() => handleCarPress(car.id)}
            >
              <View className="flex-row">
                <Image
                  source={imageMap[`${car.image_folder}/${car.images[0]}`]}
                  className="w-24 h-24 rounded-l-2xl"
                  style={{ resizeMode: 'cover' }}
                />
                <View className="flex-1 p-4">
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                      <Text className="text-lg font-bold text-[#23292B]">{car.make} {car.model}</Text>
                      <Text className="text-sm text-gray-500 mb-2">{car.year}</Text>
                      <Text className="text-lg font-bold text-[#23292B]">${car.price_per_day}/day</Text>
                    </View>
                    <TouchableOpacity
                      className="p-2 rounded-full bg-red-100"
                      onPress={() => handleRemoveFavorite(car.id)}
                    >
                      <FontAwesome name="heart" size={16} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      
      <BottomNavigation />
    </View>
  );
} 