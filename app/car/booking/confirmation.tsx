import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function BookingConfirmation() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: 'Payment Completed',
      headerTitleAlign: 'center',
    });
  }, [navigation]);

  return (
    <View className="flex-1 bg-white p-6 justify-center items-center">
      <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#111', textAlign: 'center', marginBottom: 16 }}>AutoGo</Text>
      <View className="items-center mb-6 mt-8">
        <View className="bg-green-100 rounded-full p-4 mb-2">
          <FontAwesome name="check" size={36} color="#22c55e" />
        </View>
        <Text className="text-xl font-bold text-green-700 mb-1">Payment successful</Text>
        <Text className="text-base text-gray-500 mb-4 text-center">Your car rent booking has been successfully completed.</Text>
      </View>
      <View className="bg-gray-100 rounded-xl p-5 w-full mb-8">
        <Text className="font-semibold mb-1">Car Model: <Text className="font-normal">{params.car}</Text></Text>
        <Text className="font-semibold mb-1">Name: <Text className="font-normal">{params.firstName} {params.lastName}</Text></Text>
        <Text className="font-semibold mb-1">Contact: <Text className="font-normal">{params.contact}</Text></Text>
        <Text className="font-semibold mb-1">Rental Period:</Text>
        <Text className="ml-2 mb-1">{new Date(params.start as string).toLocaleDateString()} - {new Date(params.end as string).toLocaleDateString()}</Text>
        <Text className="font-semibold mb-1">Total: <Text className="font-normal">${params.total}</Text></Text>
      </View>
      <TouchableOpacity
        className="bg-black rounded-full py-4 px-8 w-full"
        style={{ minHeight: 56 }}
        onPress={() => router.push('/home')}
      >
        <Text className="text-white text-lg font-bold text-center">Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
} 