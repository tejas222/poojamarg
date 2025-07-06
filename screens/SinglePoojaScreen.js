import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { useLayoutEffect } from 'react';
import { background, primary, success } from '../utils/constants';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useUser } from '../context/UserContext';

const SinglePoojaScreen = ({ route, navigation }) => {
  const navigations = useNavigation();
  const { user } = useUser();
  const { pooja } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: pooja.title,
      headerRight: () =>
        user?.role === 'admin' ? (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('EditPooja', { pooja });
            }}
            style={{ marginRight: 15 }}
          >
            <MaterialCommunityIcons name="pencil" color={primary} size={35} />
          </TouchableOpacity>
        ) : null,
    });
  }, [navigation, pooja.title]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollArea}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: pooja.imageUrl }} style={styles.image} />
        </View>
        <View style={styles.detailsContainer}>
          <View style={{ padding: 20 }}>
            <Text style={styles.heading}>{pooja.title}</Text>
            <Text style={styles.subHeading}>{pooja.description}</Text>

            <Text style={{ marginTop: 20, color: 'red' }}>
              टीप: ही शांती योग्य तिथी, मुहूर्त व पंडितांच्या मार्गदर्शनानेच
              करावी.
            </Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{pooja.price}</Text>
          </View>
        </View>
      </ScrollView>
      <View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigations.navigate('BookPooja')}
        >
          <Text style={styles.buttonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SinglePoojaScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: background,
  },
  scrollArea: {
    marginBottom: 70,
  },
  imageContainer: {},
  image: {
    resizeMode: 'cover',
    width: '100%',
    height: 320,
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
  },
  detailsContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 60,
    marginTop: '-60',
    borderRadius: 20,
    flex: 1,
    elevation: 4, // shadow on Android
    shadowColor: '#000', // shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  heading: {
    fontSize: 26,
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: 20,
    color: primary,
    borderBottomWidth: 2,
    paddingBottom: 10,
    borderBottomColor: '#f2f2f2',
  },
  subHeading: {
    fontSize: 20,
    fontWeight: 700,
    textAlign: 'left',
    marginTop: 20,
  },
  button: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#FF9900',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 4, // shadow on Android
    shadowColor: '#000', // shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    fontSize: 16,
  },
  priceContainer: {
    padding: 20,
    backgroundColor: success,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    alignItems: 'center',
  },
  price: {
    fontSize: 26,
    color: '#fff',
    fontWeight: 700,
  },
});
