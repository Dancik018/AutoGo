import BottomNavigation from '@/components/BottomNavigation';
import { FontAwesome } from '@expo/vector-icons';
import { ScrollView, Text, View } from 'react-native';

export default function NotificariScreen() {

  return (
    <View className="flex-1 bg-white">
      <View className="px-6 pt-12 pb-6 bg-white">
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#111', textAlign: 'center', marginBottom: 8 }}></Text>
        <Text className="text-3xl font-bold text-[#23292B] text-center mb-2">Notifications</Text>
        <Text className="text-gray-500 text-center">Stay updated with your bookings</Text>
      </View>

      <ScrollView className="flex-1 px-6" style={{ paddingBottom: 80 }}>
        <View className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-4">
          <View className="flex-row items-start">
            <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-4 mt-1">
              <FontAwesome name="bell" size={16} color="#3b82f6" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-[#23292B] mb-1">Welcome to AutoGo!</Text>
              <Text className="text-gray-600 mb-2">Thank you for joining our car rental platform. Start exploring our vehicles and find your perfect ride.</Text>
              <Text className="text-xs text-gray-400">2 hours ago</Text>
            </View>
          </View>
        </View>

        <View className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-4">
          <View className="flex-row items-start">
            <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-4 mt-1">
              <FontAwesome name="check-circle" size={16} color="#10b981" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-[#23292B] mb-1">Account Created</Text>
              <Text className="text-gray-600 mb-2">Your account has been successfully created. You can now book cars and save your favorites.</Text>
              <Text className="text-xs text-gray-400">1 day ago</Text>
            </View>
          </View>
        </View>

        <View className="items-center py-8">
          <FontAwesome name="bell-slash" size={48} color="#ddd" />
          <Text className="text-lg font-semibold text-gray-400 mt-4">No more notifications</Text>
          <Text className="text-gray-400 mt-2">You're all caught up!</Text>
        </View>
      </ScrollView>
      
      <BottomNavigation />
    </View>
  );
} 