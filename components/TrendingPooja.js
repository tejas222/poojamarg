import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { secondary, success } from '../utils/constants';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';

const TrendingPooja = () => {
  const navigation = useNavigation();
  const { pooja } = useUser();

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('SinglePooja', {
          pooja: item,
        })
      }
    >
      <View style={styles.tileContainer}>
        <Image
          source={require('../assets/navgrahashanti.jpg')}
          style={styles.image}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title} </Text>
          <Text style={styles.price}>रु {item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  return (
    <FlatList
      data={pooja}
      horizontal
      renderItem={renderItem}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.list}
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default TrendingPooja;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    marginLeft: 20,
    marginRight: 20,
  },

  tileContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 10,
  },
  image: {
    width: 250,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 20,
  },
  textContainer: {
    paddingTop: 5,
    alignItems: 'center',
    gap: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: secondary,
  },
  price: {
    fontSize: 18,
    color: success,
    fontWeight: 500,
  },
});
