import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { background } from '../utils/constants';
import CardItem from '../components/CardItem';
import { useNavigation } from '@react-navigation/native';

const Astology = () => {
  const navigation = useNavigation();

  const handlePress = (isCustomized = false) => {
    navigation.navigate('Kundali', { isCustomized });
  };

  return (
    <View style={styles.container}>
      <CardItem />
      <View style={styles.contentWrapper}>
        <TouchableOpacity style={styles.card} onPress={() => handlePress(true)}>
          <Image
            source={{
              uri: 'https://res.cloudinary.com/dkkgikjzr/image/upload/v1751868520/110360892_jwmjni.webp',
            }}
            style={styles.image}
          />
          <Text style={styles.title}>वैयक्तिक मार्गदर्शन</Text>
          <Text style={styles.price}>₹ 500</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => handlePress(false)}
        >
          <Image
            source={{
              uri: 'https://res.cloudinary.com/dkkgikjzr/image/upload/v1751868047/kundli-1719469778_bpknhm.jpg',
            }}
            style={styles.image}
          />
          <Text style={styles.title}>कुंडली पहा </Text>
          <Text style={styles.price}>₹ 150 </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Astology;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: background,
    padding: 20,
  },
  contentWrapper: {
    marginVertical: 20,
    flexDirection: 'row',
  },
  card: {
    width: '48%', // Fixes width issue in two-column layout
    marginBottom: 15,
    marginHorizontal: '1%',
    borderRadius: 12,
    backgroundColor: '#fff',
    padding: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    resizeMode: 'cover',
    marginBottom: 8,
  },
  title: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
  },
  price: {
    color: 'green',
    fontWeight: '500',
  },
});
