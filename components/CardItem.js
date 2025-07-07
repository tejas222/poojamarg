import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { accent1, accent2, primary } from '../utils/constants';
import { useNavigation } from '@react-navigation/native';
// import { FontAwesome } from "@expo/vector-icons";

const CardItem = () => {
  const navigation = useNavigation();
  return (
    <View>
      <TouchableOpacity
        onPress={() => navigation.navigate('Astrology')}
        style={styles.container}
      >
        <View style={styles.textContainer}>
          <Text style={styles.heading}>
            आमच्या तज्ञ ज्योतिषांकडून भविष्य जाणून घ्या !
          </Text>
          <Text style={styles.subtext}>
            तुमच्या जन्मकाळापासून भविष्याचा वेध घेणारे अचूक कुंडली मार्गदर्शन
            मिळेल.
          </Text>

          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Text style={{ color: accent1 }}>आजच कुंडली बनवा</Text>
            {/* <FontAwesome name="arrow-right" size={15} color={accent1} /> */}
          </View>
        </View>
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/horoscope.webp')}
            style={styles.image}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CardItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: accent2,
    borderRadius: 20,
  },
  heading: {
    fontSize: 19,
    color: '#fff',
    fontWeight: 600,
  },
  subtext: {
    fontSize: 16,
    color: '#fff',
    paddingTop: 10,
    paddingBottom: 10,
  },
  image: {
    width: '100%',
    height: 190,
    resizeMode: 'cover',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  imageContainer: {
    width: '40%',
  },
  textContainer: {
    width: '60%',
    padding: 15,
  },
});
