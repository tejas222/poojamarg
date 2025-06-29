import React, { useEffect, useState } from 'react';
import {
  FlatList,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Banner from '../components/Banner';
import { background } from '../utils/constants';

const CategoryScreen = ({ route, navigation }) => {
  const { category } = route.params;
  const [poojas, setPoojas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPoojas = async () => {
      try {
        const snapshot = await firestore()
          .collection('pooja')
          .where('categoryId', '==', category.id)
          .orderBy('createdAt', 'desc') // Ensure index exists
          .get();

        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPoojas(data);
      } catch (error) {
        console.log('Error fetching poojas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPoojas();
  }, [category.id]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('SinglePooja', { pooja: item })}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.price}>₹{item.price}</Text>
    </TouchableOpacity>
  );

  if (loading) return <ActivityIndicator size="large" color="#000" />;

  return (
    <View style={{ backgroundColor: background, flex: 1 }}>
      <Banner />
      <FlatList
        data={poojas}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 10,
    paddingTop: 10,
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
