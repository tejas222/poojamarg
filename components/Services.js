import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';

const Services = () => {
  const navigation = useNavigation();
  const { categories, loadingCategories, refreshCategories } = useUser();
  console.log('categories', categories);
  useEffect(() => {
    refreshCategories();
  }, []);

  const handleNavigation = item => {
    item.title == 'कुंडली'
      ? navigation.navigate('Astrology')
      : navigation.navigate('Category', { category: item });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleNavigation(item)}
      style={styles.tileContainer}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.icon} />
      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
  );

  if (loadingCategories) return <ActivityIndicator size="large" />;

  return (
    <FlatList
      data={categories}
      horizontal
      keyExtractor={item => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.container}
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default Services;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 12,
  },
  tileContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    width: 100,
    elevation: 2,
    margin: 5,
  },
  icon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
