import BottomNavigation from '@/components/BottomNavigation';
import { getAllUsers } from '@/services/database';
import { useUser } from '@/services/userContext';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const { currentUser, logout } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Debug: Check all users in database
    getAllUsers((users) => {
      console.log('Current users in database:', users);
    });
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!currentUser) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-xl font-bold text-gray-600 mb-4">Please log in</Text>
        <Text className="text-gray-500">You need to be logged in to view your profile.</Text>
        <TouchableOpacity
          className="bg-[#23292B] rounded-full px-8 py-3 mt-6"
          onPress={() => router.push('/login')}
        >
          <Text className="text-white font-bold">Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1" style={{ paddingBottom: 80 }}>
        <View className="px-6 pt-12 pb-6 bg-white">
          <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#111', textAlign: 'center', marginBottom: 8 }}></Text>
          <Text className="text-3xl font-bold text-[#23292B] text-center mb-2">Profile</Text>
          <Text className="text-gray-500 text-center">Your personal information</Text>
        </View>

        <View className="px-6">
          <View className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
            <View className="flex-row items-center mb-4">
              <View className="w-16 h-16 bg-[#23292B] rounded-full items-center justify-center mr-4">
                <FontAwesome name="user" size={24} color="#fff" />
              </View>
              <View>
                <Text className="text-xl font-bold text-[#23292B]">{currentUser.name}</Text>
                <Text className="text-gray-500">{currentUser.email}</Text>
              </View>
            </View>
          </View>

          <View className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
            <Text className="text-lg font-semibold text-[#23292B] mb-4">Account Information</Text>
            
            <View className="mb-4">
              <Text className="text-sm text-gray-500 mb-1">Full Name</Text>
              <Text className="text-base font-medium text-[#23292B]">{currentUser.name}</Text>
            </View>
            
            <View className="mb-4">
              <Text className="text-sm text-gray-500 mb-1">Email Address</Text>
              <Text className="text-base font-medium text-[#23292B]">{currentUser.email}</Text>
            </View>
            
            <View>
              <Text className="text-sm text-gray-500 mb-1">User ID</Text>
              <Text className="text-base font-medium text-[#23292B]">{currentUser.id}</Text>
            </View>
          </View>

          <TouchableOpacity
            className="bg-red-500 rounded-full py-4 flex-row justify-center items-center mb-8"
            onPress={handleLogout}
          >
            <FontAwesome name="sign-out" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text className="text-white text-lg font-bold">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomNavigation />
    </View>
  );
} 