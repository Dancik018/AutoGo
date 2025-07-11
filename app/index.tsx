import { useRouter } from 'expo-router';
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native';


export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require('@/assets/images/background.png')}
      className="flex-1">
      <View className="flex-1 justify-between items-start p-8 bg-black/50 ">
        
        <View className="w-full items-start mt-[60px]">
          <Text className="text-white text-6xl font-bold">Welcome to</Text>
          <Text className="text-white text-6xl font-bold">AutoGo</Text>
        </View>

        <TouchableOpacity
          className="bg-gray-800 w-full p-4 rounded-full mb-[50px]"
          onPress={() => router.push('/login')}
        >
          <Text className="text-white text-center text-lg">Get Started</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
