import BottomNavigation from '@/components/BottomNavigation';
import { getCars } from '@/services/carService';
import { imageMap } from '@/services/image-map';
import { Car } from '@/types/car';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const CATEGORIES = [
  { key: 'all', label: 'ALL' },
  { key: 'econom', label: 'Econom' },
  { key: 'comfort', label: 'Comfort' },
  { key: 'premium', label: 'VIP' },
];

export default function HomeScreen() {
  const [cars, setCars] = useState<Car[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const router = useRouter();

  useEffect(() => {
    setCars(getCars());
  }, []);

  const filteredCars = cars.filter(car => {
    const matchesCategory = category === 'all' || car.class === category;
    const matchesSearch = `${car.make} ${car.model}`.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const recommendedCars = filteredCars.slice(0, 4);
  const otherCars = filteredCars.slice(4);

  const renderRecommendedCar = ({ item }: { item: Car }) => (
    <TouchableOpacity
      onPress={() => router.push({ pathname: '/car/[id]', params: { id: item.id.toString() } })}
      style={{
        width: 140,
        marginRight: 12,
        backgroundColor: '#fff',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 1,
      }}
    >
      <Image
        source={imageMap[`${item.image_folder}/${item.images[0]}`]}
        style={{ width: '100%', height: 90, borderTopLeftRadius: 16, borderTopRightRadius: 16, resizeMode: 'contain', backgroundColor: '#f4f4f4' }}
      />
      <View style={{ padding: 8 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 13 }}>{item.make} {item.model}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 2 }}>
          <Text style={{ color: '#FFA500', fontWeight: 'bold', marginRight: 2 }}>★</Text>
          <Text style={{ color: '#333', fontSize: 12 }}>{item.rating ? item.rating.toFixed(1) : '5.0'}</Text>
        </View>
        <Text style={{ color: '#222', fontWeight: 'bold', fontSize: 13 }}>${item.price_per_day}/day</Text>
        <Text style={{ color: '#007AFF', fontWeight: 'bold', fontSize: 11, marginTop: 2 }}>{item.class === 'premium' ? 'VIP' : item.class.charAt(0).toUpperCase() + item.class.slice(1)}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCar = ({ item }: { item: Car }) => (
    <TouchableOpacity
      onPress={() => router.push({ pathname: '/car/[id]', params: { id: item.id.toString() } })}
      style={{
        width: 170,
        height: 240,
        flexBasis: 170,
        margin: 8,
        backgroundColor: '#fff',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
        alignSelf: 'flex-start',
        overflow: 'hidden',
      }}
    >
      <Image
        source={imageMap[`${item.image_folder}/${item.images[0]}`]}
        style={{ width: '100%', height: 90, borderTopLeftRadius: 16, borderTopRightRadius: 16, resizeMode: 'contain', backgroundColor: '#f4f4f4' }}
      />
      <View style={{ padding: 12, flex: 1, justifyContent: 'center' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.make} {item.model}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 4 }}>
          <Text style={{ color: '#FFA500', fontWeight: 'bold', marginRight: 4 }}>★</Text>
          <Text style={{ color: '#333', fontSize: 14 }}>{item.rating ? item.rating.toFixed(1) : '5.0'}</Text>
        </View>
        <Text style={{ color: '#222', fontWeight: 'bold', fontSize: 15 }}>${item.price_per_day}/day</Text>
        <Text style={{ color: '#007AFF', fontWeight: 'bold', fontSize: 13, marginTop: 2 }}>{item.class === 'premium' ? 'VIP' : item.class.charAt(0).toUpperCase() + item.class.slice(1)}</Text>
      </View>
    </TouchableOpacity>
  );



  return (
    <View style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 80 }}>
        
        <View style={{ paddingHorizontal:20, paddingTop: 50, paddingBottom: 15 }}>
          <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#111' }}>AutoGo</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', margin: 16, backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6, elevation: 1 }}>
          <Image source={require('@/assets/images/search.png')} style={{ width: 22, height: 22, marginRight: 8, tintColor: '#888' }} />
          <TextInput
            placeholder="Search your dream car...."
            value={search}
            onChangeText={setSearch}
            style={{ flex: 1, fontSize: 16, padding: 6 }}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginLeft: 16, marginBottom: 8 }} contentContainerStyle={{ alignItems: 'center', height: 44 }}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.key}
              onPress={() => setCategory(cat.key)}
              style={{
                backgroundColor: category === cat.key ? '#222' : '#fff',
                borderRadius: 22,
                paddingHorizontal: 22,
                paddingVertical: 10,
                marginRight: 12,
                borderWidth: 1.5,
                borderColor: category === cat.key ? '#222' : '#eee',
                minWidth: 70,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: category === cat.key ? '#000' : undefined,
                shadowOpacity: category === cat.key ? 0.08 : 0,
                shadowRadius: category === cat.key ? 4 : 0,
                elevation: category === cat.key ? 2 : 0,
              }}
            >
              <Text style={{ color: category === cat.key ? '#fff' : '#222', fontWeight: 'bold', fontSize: 15, textAlign: 'center' }}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {category === 'all' && recommendedCars.length > 0 && (
          <>
            <View style={{ marginTop: 8, marginBottom: 4, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Recommended For You</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 8, paddingRight: 8, alignItems: 'center' }}
              style={{ minHeight: 150 }}
            >
              {recommendedCars.map((item) => (
                <React.Fragment key={item.id}>
                  {renderRecommendedCar({ item })}
                </React.Fragment>
              ))}
            </ScrollView>
          </>

        )}
        <View style={{ marginTop: 16, marginBottom: 4, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{category === 'all' ? 'Other Cars' : 'Cars'}</Text>
        </View>
        <FlatList
          data={category === 'all' ? otherCars : filteredCars}
          renderItem={renderCar}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      </ScrollView>
      <BottomNavigation />
    </View>
  );
}