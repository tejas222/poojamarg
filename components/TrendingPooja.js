import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { secondary } from '../utils/constants';
import { useNavigation } from '@react-navigation/native';

const TrendingPooja = () => {
  const navigation = useNavigation();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('SinglePooja', {
              title: 'नवग्रह शांती हवन',
            })
          }
        >
          <View style={styles.tileContainer}>
            <Image
              source={require('../assets/navgrahashanti.jpg')}
              style={styles.image}
            />
            <View style={styles.textContainer}>
              <Text style={styles.title}>नवग्रह शांती हवन </Text>
              <Text style={styles.price}>रु ५००१</Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.tileContainer}>
          <Image
            source={require('../assets/vastushanti.jpeg')}
            style={styles.image}
          />
          <View style={styles.textContainer}>
            <Text style={styles.title}>वास्तुशांति</Text>
            <Text style={styles.price}>रु ५००१</Text>
          </View>
        </View>

        <View style={styles.tileContainer}>
          <Image
            source={require('../assets/satyanarayan.webp')}
            style={styles.image}
          />
          <View style={styles.textContainer}>
            <Text style={styles.title}>सत्यनारायण पुजा</Text>
            <Text style={styles.price}>रु ५००१</Text>
          </View>
        </View>

        <View style={styles.tileContainer}>
          <Image
            source={require('../assets/udak_shanti.jpg')}
            style={styles.image}
          />
          <View style={styles.textContainer}>
            <Text style={styles.title}>उदक शांती </Text>
            <Text style={styles.price}>रु ५००१</Text>
          </View>
        </View>
      </View>
    </ScrollView>
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
  },
  image: {
    width: 250,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 20,
  },
  textContainer: {
    paddingTop: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: secondary,
  },
  price: {
    fontSize: 20,
  },
});
