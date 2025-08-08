import { getCars } from '@/services/carService';
import { addFavorite, checkDatabaseHealth, isFavorite, removeFavorite, resetDatabase } from '@/services/database';
import { imageMap } from '@/services/image-map';
import { useUser } from '@/services/userContext';
import { Car } from '@/types/car';
import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

export default function CarDetailsScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { currentUser } = useUser();
  const { id } = useLocalSearchParams();
  const [car, setCar] = useState<Car | null>(null);
  const [isCarFavorite, setIsCarFavorite] = useState(false);
  const [dbHealthy, setDbHealthy] = useState(true);

  useEffect(() => {
    const cars = getCars();
    const selectedCar = cars.find((c) => c.id.toString() === id);
    setCar(selectedCar || null);
    
    // Check database health
    const isHealthy = checkDatabaseHealth();
    setDbHealthy(isHealthy);
  }, [id]);

  useEffect(() => {
    if (car && currentUser) {
      // Check if car is in favorites
      isFavorite(currentUser.id, car.id, (favorite, error) => {
        if (error) {
          console.error('Error checking favorite status:', error);
        } else {
          setIsCarFavorite(favorite);
        }
      });
    } else {
      setIsCarFavorite(false);
    }
  }, [car, currentUser]);

  useEffect(() => {
    if (car) {
      navigation.setOptions({
        headerShown: false,
      });
    }
  }, [car]);

  const handleFavoriteToggle = () => {
    if (!currentUser || !car) {
      console.log('User not logged in or car not found');
      return;
    }

    if (isCarFavorite) {
      removeFavorite(currentUser.id, car.id, (success, error) => {
        if (error) {
          console.error('Error removing favorite:', error);
        } else if (success) {
          setIsCarFavorite(false);
        }
      });
    } else {
      addFavorite(currentUser.id, car.id, (success, error) => {
        if (error) {
          console.error('Error adding favorite:', error);
        } else if (success) {
          setIsCarFavorite(true);
        }
      });
    }
  };

  if (!car) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Car not found!</Text>
      </View>
    );
  }

  if (!currentUser) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-xl font-bold text-gray-600 mb-4">Please log in</Text>
        <Text className="text-gray-500 mb-6">You need to be logged in to view car details and add favorites.</Text>
        <TouchableOpacity
          className="bg-[#23292B] rounded-full px-8 py-3"
          onPress={() => router.push('/login')}
        >
          <Text className="text-white font-bold">Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!dbHealthy) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-xl font-bold text-gray-600 mb-4">Database Error</Text>
        <Text className="text-gray-500 mb-6">There's an issue with the database.</Text>
        <TouchableOpacity
          className="bg-red-500 rounded-full px-6 py-3 mt-4"
          onPress={() => {
            resetDatabase();
            // Reload the page
            router.push('/home');
          }}
        >
          <Text className="text-white font-bold">Reset Database</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="w-full items-center bg-white shadow-lg rounded-b-3xl mb-4" style={{ elevation: 8 }}>
        <View className="w-full px-6 pt-12 pb-4 bg-white">
          <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#111', textAlign: 'center' }}>AutoGo</Text>
        </View>
        <Image
          source={imageMap[`${car.image_folder}/${car.images[0]}`]}
          style={{ width: '100%', height: 240, resizeMode: 'contain', backgroundColor: '#f5f5f5', borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}
        />
      </View>
      <View className="w-full px-6 flex-1">
        <Text className="text-3xl font-extrabold mb-2 text-center">{car.make} {car.model}</Text>
        <Text className="text-base text-gray-500 mb-4 text-center">{car.description}</Text>
        <View className="flex-row justify-center items-center mb-6">
          <Text className="text-2xl font-bold text-[#23292B]">${car.price_per_day}</Text>
          <Text className="text-base text-gray-500 ml-2">/day</Text>
        </View>
        <View className="flex-row flex-wrap justify-between bg-gray-100 rounded-2xl p-5 mb-8 shadow-sm">
          <View className="w-1/2 mb-4 flex-row items-center">
            <FontAwesome name="users" size={22} color="#23292B" style={{ marginRight: 10 }} />
            <Text className="text-base font-medium">5 Seats</Text>
          </View>
          <View className="w-1/2 mb-4 flex-row items-center">
            <FontAwesome name="tachometer" size={22} color="#23292B" style={{ marginRight: 10 }} />
            <Text className="text-base font-medium">{car.engine_capacity}</Text>
          </View>
          <View className="w-1/2 mb-2 flex-row items-center">
            <FontAwesome name="road" size={22} color="#23292B" style={{ marginRight: 10 }} />
            <Text className="text-base font-medium">{car.fuel_type}</Text>
          </View>
          <View className="w-1/2 mb-2 flex-row items-center">
            <FontAwesome name="car" size={22} color="#23292B" style={{ marginRight: 10 }} />
            <Text className="text-base font-medium">{car.body_type}</Text>
          </View>
        </View>
        <View className="mb-8">
          <Text className="text-lg font-semibold mb-2">Features</Text>
          <View className="flex-row flex-wrap gap-2">
            {car.features.map((feature, idx) => (
              <View key={idx} className="bg-[#23292B] px-4 py-2 rounded-full mb-2 mr-2">
                <Text className="text-white text-sm font-medium">{feature}</Text>
              </View>
            ))}
          </View>
        </View>
        <View className="flex-row items-center justify-between mb-10">
          <TouchableOpacity
            className="bg-[#23292B] rounded-full py-5 flex-row justify-center items-center flex-1 mr-3"
            style={{ minHeight: 56 }}
            onPress={() => {
              router.push({ pathname: '/car/booking/[id]', params: { id: car.id.toString() } });
            }}
          >
            <Text className="text-white text-lg font-bold mr-2">Book Now</Text>
            <FontAwesome name="arrow-right" size={20} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity
            className={`rounded-full p-4 justify-center items-center ${isCarFavorite ? 'bg-red-500' : 'bg-gray-200'}`}
            style={{ minHeight: 56, minWidth: 56 }}
            onPress={handleFavoriteToggle}
          >
            <FontAwesome 
              name="heart" 
              size={24} 
              color={isCarFavorite ? "#fff" : "#666"} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}