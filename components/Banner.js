import { StyleSheet, Text, View, Animated, Image } from "react-native";
import React, { useEffect, useRef } from "react";

const Banner = () => {
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
    <Animated.View style={{ ...styles.bannerContainer, opacity: fadeAnim }}>
      <Image
        source={require("../assets/poojamarg-banner.jpg")}
        style={styles.image}
      />
    </Animated.View>
  );
};

export default Banner;

const styles = StyleSheet.create({
  bannerContainer: {
    borderRadius: 12,
    overflow: "hidden",
    elevation: 4, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 20,
    margin: 20,
  },
  image: {
    width: "100%",
    aspectRatio: 2.6,
    resizeMode: "cover",
    height: 170,
  },
});
