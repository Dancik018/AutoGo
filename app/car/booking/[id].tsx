import { getCars } from '@/services/carService';
import { Car } from '@/types/car';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function BookingForm() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();
  const [car, setCar] = useState<Car | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contact, setContact] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [days, setDays] = useState(1);

  useEffect(() => {
    const cars = getCars();
    const selectedCar = cars.find((c) => c.id.toString() === id);
    setCar(selectedCar || null);
  }, [id]);

  useEffect(() => {
    const diff = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    setDays(diff);
  }, [startDate, endDate]);

  useEffect(() => {
    navigation.setOptions({
      title: 'Booking Details',
      headerTitleAlign: 'center',
    });
  }, [navigation]);

  if (!car) {
    return <View className="flex-1 justify-center items-center"><Text>Car not found!</Text></View>;
  }

  const total = car.price_per_day * days;
  const isFormValid = firstName.trim() && lastName.trim() && contact.trim();

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }} keyboardShouldPersistTaps="handled">
        <Text className="text-2xl font-bold mb-6 text-center">Booking for {car.make} {car.model}</Text>
        <TextInput
          className="border border-gray-300 rounded-xl p-4 mb-4 text-base bg-gray-50"
          placeholder="First Name*"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          className="border border-gray-300 rounded-xl p-4 mb-4 text-base bg-gray-50"
          placeholder="Last Name*"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          className="border border-gray-300 rounded-xl p-4 mb-4 text-base bg-gray-50"
          placeholder="Contact*"
          value={contact}
          onChangeText={setContact}
          keyboardType="phone-pad"
        />
        <Text className="mb-1 font-semibold">Pick up Date</Text>
        <TouchableOpacity onPress={() => setShowStart(true)} className="border border-gray-300 rounded-xl p-4 mb-4 bg-gray-50">
          <Text className="text-base">{startDate.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showStart && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_: unknown, date?: Date) => {
              setShowStart(false);
              if (date) setStartDate(date);
            }}
          />
        )}
        <Text className="mb-1 font-semibold">Return Date</Text>
        <TouchableOpacity onPress={() => setShowEnd(true)} className="border border-gray-300 rounded-xl p-4 mb-4 bg-gray-50">
          <Text className="text-base">{endDate.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showEnd && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_: unknown, date?: Date) => {
              setShowEnd(false);
              if (date) setEndDate(date);
            }}
          />
        )}
        <View className="mt-8 mb-2">
          <TouchableOpacity
            className={`flex-row justify-center items-center rounded-full py-5 ${isFormValid ? 'bg-[#23292B]' : 'bg-gray-300'} `}
            style={{ minHeight: 56 }}
            disabled={!isFormValid}
            onPress={() => {
              router.push({
                pathname: '/car/booking/confirmation',
                params: {
                  car: `${car.make} ${car.model}`,
                  firstName,
                  lastName,
                  contact,
                  start: startDate.toISOString(),
                  end: endDate.toISOString(),
                  total: total.toString(),
                },
              });
            }}
          >
            <Text className="text-white text-lg font-bold mr-2">${total}</Text>
            <Text className="text-white text-lg font-bold">Pay Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
} 