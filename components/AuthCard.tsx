import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Animated, Image, Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';

interface StyledInputProps extends TextInputProps {
  placeholder: string;
  error?: string;
}

const StyledInput = ({ placeholder, error, ...props }: StyledInputProps) => (
  <View className="w-64 mb-2">
    <TextInput
      className={`h-12 border-2 rounded-md p-2 bg-white shadow-lg ${error ? 'border-red-500' : 'border-gray-800'}`}
      placeholder={placeholder}
      placeholderTextColor="#6b7280"
      {...props}
    />
    {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
  </View>
);

interface AuthCardProps {
  onLogin?: (email: string, password: string) => Promise<boolean>;
  onSignUp?: (name: string, email: string, password: string) => Promise<'success' | 'name' | 'email' | 'both' | 'error'>;
  isFlipped: boolean;
  onFlip: () => void;
}

export default function AuthCard({ onLogin, onSignUp, isFlipped, onFlip }: AuthCardProps) {
  const router = useRouter();
  
  const [loginEmailError, setLoginEmailError] = useState('');
  const [loginPasswordError, setLoginPasswordError] = useState('');
  const [signUpNameError, setSignUpNameError] = useState('');
  const [signUpEmailError, setSignUpEmailError] = useState('');
  const [signUpPasswordError, setSignUpPasswordError] = useState('');
  const [signUpConfirmPasswordError, setSignUpConfirmPasswordError] = useState('');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showSignUpConfirmPassword, setShowSignUpConfirmPassword] = useState(false);

  const flipAnimation = useRef(new Animated.Value(isFlipped ? 1 : 0)).current;

  React.useEffect(() => {
    const toValue = isFlipped ? 1 : 0;
    Animated.spring(flipAnimation, {
      toValue,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
  }, [isFlipped]);

  const handleFlip = () => {
    onFlip();
    setLoginEmailError('');
    setLoginPasswordError('');
    setSignUpNameError('');
    setSignUpEmailError('');
    setSignUpPasswordError('');
    setSignUpConfirmPasswordError('');
  };

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  const validateEmail = (email: string) => {
    return email.includes('@');
  };

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleLogin = async () => {
    let valid = true;
    setLoginEmailError('');
    setLoginPasswordError('');

    if (!validateEmail(loginEmail)) {
      setLoginEmailError("Please enter a valid email address.");
      valid = false;
    }
    if (!loginPassword) {
      setLoginPasswordError("Please enter a password.");
      valid = false;
    }

    if (!valid) return;

    if (onLogin) {
      const success = await onLogin(loginEmail, loginPassword);
      if (success) {
        router.push('/home');
      } else {
        setLoginEmailError("Invalid email or password.");
        setLoginPasswordError("Invalid email or password.");
      }
    }
  };

  const handleSignUp = async () => {
    let valid = true;
    setSignUpNameError('');
    setSignUpEmailError('');
    setSignUpPasswordError('');
    setSignUpConfirmPasswordError('');

    if (!signUpName) {
      setSignUpNameError("Please enter a name.");
      valid = false;
    }
    if (!validateEmail(signUpEmail)) {
      setSignUpEmailError("Please enter a valid email address.");
      valid = false;
    }
    if (!validatePassword(signUpPassword)) {
      setSignUpPasswordError("Password must be at least 8 characters long and include an uppercase letter, a number, and a special character.");
      valid = false;
    }
    if (signUpPassword !== signUpConfirmPassword) {
      setSignUpConfirmPasswordError("Passwords do not match.");
      valid = false;
    }

    if (!valid) return;

    if (onSignUp) {
      const result = await onSignUp(signUpName, signUpEmail, signUpPassword);
      if (result === 'success') {
        router.push('/home');
      } else if (result === 'both') {
        setSignUpNameError("This name is already in use.");
        setSignUpEmailError("This email is already in use.");
      } else if (result === 'name') {
        setSignUpNameError("This name is already in use.");
      } else if (result === 'email') {
        setSignUpEmailError("This email is already in use.");
      } else {
        setSignUpEmailError("An unknown error occurred. Please try again.");
      }
    }
  };

  return (
    <View className="items-center">
      <View className="w-[300px] h-[380px]">
        <Animated.View style={[frontAnimatedStyle, { backfaceVisibility: 'hidden' }]} className="absolute w-full h-full bg-gray-200 rounded-md border-2 border-gray-800 items-center justify-center p-5 shadow-lg" pointerEvents={isFlipped ? 'none' : 'auto'}>
          <Text className="text-2xl font-bold mb-4">Log in</Text>
          <View style={{ width: '100%', gap: 12, alignItems: 'center' }}>
            <View style={{ width: 220, position: 'relative', alignItems: 'center' }}>
              <StyledInput placeholder="Email" value={loginEmail} onChangeText={setLoginEmail} error={loginEmailError} style={{ width: 220 }} />
            </View>
            <View style={{ width: 220, position: 'relative', alignItems: 'center' }}>
              <StyledInput placeholder="Password" value={loginPassword} onChangeText={setLoginPassword} secureTextEntry={!showLoginPassword} error={loginPasswordError} style={{ width: 220 }} />
              <TouchableOpacity
                onPress={() => setShowLoginPassword(v => !v)}
                style={{ position: 'absolute', right: 12, top: 0, bottom: 0, height: 48, justifyContent: 'center', alignItems: 'center', zIndex: 2, padding: 8, borderRadius: 16, backgroundColor: 'transparent' }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Image
                  source={showLoginPassword ? require('../assets/images/eye_open.png') : require('../assets/images/eye_closed.png')}
                  style={{ width: 22, height: 22 }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity onPress={handleLogin} className="w-32 h-12 bg-white border-2 border-gray-800 rounded-md items-center justify-center shadow-md mt-2">
            <Text className="font-bold">Let's go!</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[backAnimatedStyle, { backfaceVisibility: 'hidden' }]} className="absolute w-full h-full bg-gray-200 rounded-md border-2 border-gray-800 items-center justify-center p-5 shadow-lg" pointerEvents={isFlipped ? 'auto' : 'none'}>
          <Text className="text-2xl font-bold mb-4">Sign up</Text>
          <View style={{ width: '100%', gap: 12, alignItems: 'center' }}>
            <View style={{ width: 220, position: 'relative', alignItems: 'center' }}>
              <StyledInput placeholder="Name" value={signUpName} onChangeText={setSignUpName} error={signUpNameError} style={{ width: 220 }} />
            </View>
            <View style={{ width: 220, position: 'relative', alignItems: 'center' }}>
              <StyledInput placeholder="Email" value={signUpEmail} onChangeText={setSignUpEmail} error={signUpEmailError} style={{ width: 220 }} />
            </View>
            <View style={{ width: 220, position: 'relative', alignItems: 'center' }}>
              <StyledInput placeholder="Password" value={signUpPassword} onChangeText={setSignUpPassword} secureTextEntry={!showSignUpPassword} error={signUpPasswordError} style={{ width: 220 }} />
              <TouchableOpacity
                onPress={() => setShowSignUpPassword(v => !v)}
                style={{ position: 'absolute', right: 12, top: 0, bottom: 0, height: 48, justifyContent: 'center', alignItems: 'center', zIndex: 2, padding: 8, borderRadius: 16, backgroundColor: 'transparent' }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Image
                  source={showSignUpPassword ? require('../assets/images/eye_open.png') : require('../assets/images/eye_closed.png')}
                  style={{ width: 22, height: 22 }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            <View style={{ width: 220, position: 'relative', alignItems: 'center' }}>
              <StyledInput placeholder="Confirm Password" value={signUpConfirmPassword} onChangeText={setSignUpConfirmPassword} secureTextEntry={!showSignUpConfirmPassword} error={signUpConfirmPasswordError} style={{ width: 220 }} />
              <TouchableOpacity
                onPress={() => setShowSignUpConfirmPassword(v => !v)}
                style={{ position: 'absolute', right: 12, top: 0, bottom: 0, height: 48, justifyContent: 'center', alignItems: 'center', zIndex: 2, padding: 8, borderRadius: 16, backgroundColor: 'transparent' }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Image
                  source={showSignUpConfirmPassword ? require('../assets/images/eye_open.png') : require('../assets/images/eye_closed.png')}
                  style={{ width: 22, height: 22 }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity onPress={handleSignUp} className="w-32 h-12 bg-white border-2 border-gray-800 rounded-md items-center justify-center shadow-md mt-2">
            <Text className="font-bold">Confirm!</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <View className="flex-row items-center mt-8">
        <Text className={`font-bold text-lg ${!isFlipped ? 'underline' : ''}`} onPress={!isFlipped ? undefined : handleFlip}>Log in</Text>
        <TouchableOpacity onPress={handleFlip} className="mx-4">
          <View className={`w-12 h-6 rounded-full p-1 ${isFlipped ? 'bg-blue-500' : 'bg-gray-300'}`}>
            <Animated.View className={`w-4 h-4 bg-white rounded-full`} style={{ transform: [{ translateX: flipAnimation.interpolate({ inputRange: [0, 1], outputRange: [0, 24] }) }] }} />
          </View>
        </TouchableOpacity>
        <Text className={`font-bold text-lg ${isFlipped ? 'underline' : ''}`} onPress={isFlipped ? undefined : handleFlip}>Sign up</Text>
      </View>
    </View>
  );
}