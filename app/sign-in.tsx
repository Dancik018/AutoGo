import AuthCard from '@/components/AuthCard';
import { addUser, findUserByEmail, findUserByName } from '@/services/database';
import * as Crypto from 'expo-crypto';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function SignInScreen() {
  const router = useRouter();
  const [isFlipped, setIsFlipped] = useState(true);

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    return new Promise((resolve) => {
      findUserByEmail(email, async (user, error) => {
        if (error || !user) {
          resolve(false);
          return;
        }
        const hashedPassword = await Crypto.digestStringAsync(
          Crypto.CryptoDigestAlgorithm.SHA256,
          password
        );
        if (user.password === hashedPassword) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  };

  const handleSignUp = async (name: string, email: string, password: string): Promise<boolean> => {
    return new Promise((resolve) => {
      findUserByName(name, (existingUserByName) => {
        findUserByEmail(email, async (existingUser) => {
          if (existingUserByName || existingUser) {
            resolve(false);
            return;
          }
          const hashedPassword = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            password
          );
          addUser(name, email, hashedPassword, (success) => {
            resolve(success);
          });
        });
      });
    });
  };

  return (
    <View className="flex-1 bg-white p-8 justify-center items-center">
      <TouchableOpacity onPress={() => router.back()} className="mb-8">
      </TouchableOpacity>
      
      <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#111', textAlign: 'center', marginBottom: 8 }}>AutoGo</Text>
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