import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useRef } from 'react';
import Services from '../components/Services';
import { accent1, accent2, secondary, text } from '../utils/constants';
import TrendingPooja from '../components/TrendingPooja';
import CardItem from '../components/CardItem';
import Banner from '../components/Banner';

export default function HomeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate the image fade-in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Banner />
        <View style={styles.section}>
          <Text style={styles.contentHeading}>आमच्या विविध सेवा </Text>
          <Services />
        </View>

        <View style={styles.trendingSection}>
          <Text style={styles.contentHeading2}>
            या महिन्यातील लोकप्रिय पुजा
          </Text>
          <TouchableOpacity>
            <Text>View All</Text>
          </TouchableOpacity>
        </View>
        <TrendingPooja />

        <View style={styles.howitworkssection}>
          <Text style={styles.howItWorksHeading}>How it Works?</Text>
          <Image
            source={require('../assets/howitworks.png')}
            style={styles.howItWorksImage}
          />
        </View>
        <View style={{ padding: 20 }}>
          <CardItem />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7E7',
  },
  scrollContainer: {},

  contentHeading: {
    fontSize: 24,
    textAlign: 'center',
    marginTop: 10,
    color: text,
    fontWeight: 600,
  },
  section: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  trendingSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
    margin: 20,
  },
  contentHeading2: {
    fontSize: 23,
    textAlign: 'left',
    marginTop: 10,
    color: text,
    fontWeight: 600,
  },
  howitworkssection: {
    margin: 20,
  },
  howItWorksImage: {
    width: '100%',
    resizeMode: 'contain',
    height: 200,
  },
  howItWorksHeading: {
    fontSize: 23,
    textAlign: 'center',
    marginTop: 10,
    color: text,
    fontWeight: 600,
  },
});
