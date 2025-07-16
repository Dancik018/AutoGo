import { getCars } from '@/services/carService';
import { imageMap } from '@/services/image-map';
import { Car } from '@/types/car';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';

export default function CarDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [car, setCar] = useState<Car | null>(null);

  useEffect(() => {
    const cars = getCars();
    const selectedCar = cars.find((c) => c.id.toString() === id);
    setCar(selectedCar || null);
  }, [id]);

  if (!car) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Car not found!</Text>
      </View>
    );
  }


  return (
    <View className="flex-1 bg-white">
      
      <Image
        source={imageMap[`${car.image_folder}/${car.images[0]}`]}
        style={{ width: '100%', height: 250, resizeMode: 'contain' }}
      />
      <View className="p-4">
        <Text className="text-2xl font-bold">{car.make} {car.model}</Text>
        <Text className="text-xl">{car.year}</Text>
        <Text className="text-xl font-semibold">${car.price_per_day}/day</Text>
        <Text className="text-lg capitalize mt-2">{car.class}</Text>
        <Text className="text-lg mt-1">{car.fuel_type} - {car.engine_capacity}</Text>
        <Text className="text-lg mt-1">{car.body_type}</Text>
        <Text className="text-lg font-bold mt-4">Features:</Text>
        {car.features.map((feature, index) => (
          <Text key={index} className="text-lg">- {feature}</Text>
        ))}
      </View>
    </View>
  );
}