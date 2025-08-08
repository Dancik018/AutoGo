import AuthCard from '@/components/AuthCard';
import { addUser, findUserByEmail, findUserByName } from '@/services/database';
import { useUser } from '@/services/userContext';
import * as Crypto from 'expo-crypto';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const { setCurrentUser } = useUser();
  const [isFlipped, setIsFlipped] = useState(false);

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
          setCurrentUser({
            id: user.id,
            name: user.name,
            email: user.email
          });
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  };

  const handleSignUp = async (name: string, email: string, password: string): Promise<'success' | 'name' | 'email' | 'both' | 'error'> => {
    return new Promise((resolve) => {
      findUserByName(name, (existingUserByName) => {
        findUserByEmail(email, async (existingUser) => {
          if (existingUserByName && existingUser) {
            resolve('both');
            return;
          } else if (existingUserByName) {
            resolve('name');
            return;
          } else if (existingUser) {
            resolve('email');
            return;
          }
          const hashedPassword = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            password
          );
          addUser(name, email, hashedPassword, (success) => {
            if (success) {
              // Get the newly created user to set as current user
              findUserByEmail(email, (newUser) => {
                if (newUser) {
                  setCurrentUser({
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email
                  });
                }
              });
              resolve('success');
            } else {
              resolve('error');
            }
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