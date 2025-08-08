import { useRouter, usePathname } from 'expo-router';
import { TouchableOpacity, Text, View, Image, Animated } from 'react-native';
import { useEffect, useRef } from 'react';

const navItems = [
  { key: 'home', label: 'Home', icon: require('@/assets/images/home-ico.png'), route: '/home' as const },
  { key: 'favorite', label: 'Favorite', icon: require('@/assets/images/favorite-ico.png'), route: '/favorite' as const },
  { key: 'notificari', label: 'Notificări', icon: require('@/assets/images/notification-ico.png'), route: '/notificari' as const },
  { key: 'profile', label: 'Profile', icon: require('@/assets/images/profile-ico.png'), route: '/profile' as const },
];

export default function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = (route: string) => {
    // Animație simplă de scalare
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigare cu tranziție smooth
    router.push({ pathname: route });
  };

  return (
    <View style={{ 
      position: 'absolute', 
      left: 0, 
      right: 0, 
      bottom: 0, 
      height: 64, 
      backgroundColor: '#fff', 
      flexDirection: 'row', 
      justifyContent: 'space-around', 
      alignItems: 'center', 
      borderTopWidth: 1, 
      borderTopColor: '#eee', 
      zIndex: 100 
    }}>
      {navItems.map(item => {
        const active = pathname === item.route;
        return (
          <Animated.View key={item.key} style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity 
              style={{ 
                alignItems: 'center', 
                flex: 1, 
                justifyContent: 'center',
                paddingHorizontal: 8,
                paddingVertical: 4,
              }} 
              onPress={() => handlePress(item.route)}
              activeOpacity={0.7}
            >
              <Image 
                source={item.icon} 
                style={{ 
                  width: 26, 
                  height: 26, 
                  marginBottom: 2, 
                  tintColor: active ? '#007AFF' : '#888' 
                }} 
              />
              <Text style={{ 
                fontSize: 12, 
                color: active ? '#007AFF' : '#888', 
                fontWeight: active ? 'bold' : 'normal' 
              }}>
                {item.label}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </View>
  );
} 