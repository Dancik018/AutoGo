import { getCars } from '@/services/carService';
import { imageMap } from '@/services/image-map';
import { Car } from '@/types/car';
import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function CarDetailsScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const [car, setCar] = useState<Car | null>(null);

  useEffect(() => {
    const cars = getCars();
    const selectedCar = cars.find((c) => c.id.toString() === id);
    setCar(selectedCar || null);
  }, [id]);

  useEffect(() => {
    if (car) {
      navigation.setOptions({
        title: 'Car Detail',
        headerTitleAlign: 'center',
      });
    }
  }, [car]);

  if (!car) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Car not found!</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ padding: 0, alignItems: 'center' }}>
      <View className="w-full items-center bg-white shadow-lg rounded-b-3xl mb-4" style={{ elevation: 8 }}>
        <Image
          source={imageMap[`${car.image_folder}/${car.images[0]}`]}
          style={{ width: '100%', height: 240, resizeMode: 'contain', backgroundColor: '#f5f5f5', borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}
        />
      </View>
      <View className="w-full px-6">
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
        <TouchableOpacity
          className="bg-[#23292B] rounded-full py-5 flex-row justify-center items-center mb-10"
          style={{ minHeight: 56 }}
          onPress={() => {
            router.push({ pathname: '/car/booking/[id]', params: { id: car.id.toString() } });
          }}
        >
          <Text className="text-white text-lg font-bold mr-2">Book Now</Text>
          <FontAwesome name="arrow-right" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}