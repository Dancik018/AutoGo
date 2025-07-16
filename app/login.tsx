import AuthCard from '@/components/AuthCard';
import { addUser, findUserByEmail, findUserByName } from '@/services/database';
import * as Crypto from 'expo-crypto';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [isFlipped, setIsFlipped] = useState(false);

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const user = findUserByEmail(email);
      if (!user) {
        return false;
      }
      const hashedPassword = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        password
      );
      if (user.password === hashedPassword) {
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const handleSignUp = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const existingUserByName = findUserByName(name);
      if (existingUserByName) {
        return false;
      }
      const existingUser = findUserByEmail(email);
      if (existingUser) {
        return false;
      }
      const hashedPassword = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        password
      );
      addUser(name, email, hashedPassword);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  return (
    <View className="flex-1 bg-white p-8 justify-center items-center">
      <TouchableOpacity onPress={() => router.back()} className="mb-8">
      </TouchableOpacity>
      
      {isFlipped ? (
        <>
          <Text className="text-3xl font-bold">Create Account</Text>
          <Text className="text-lg text-gray-500 mb-8">Let's get you started.</Text>
        </>
      ) : (
        <>
          <Text className="text-3xl font-bold">Welcome Back</Text>
          <Text className="text-lg text-gray-500 mb-8">Ready to hit the road.</Text>
        </>
      )}

      <AuthCard onLogin={handleLogin} onSignUp={handleSignUp} isFlipped={isFlipped} onFlip={() => setIsFlipped(!isFlipped)} />
    </View>
  );
}