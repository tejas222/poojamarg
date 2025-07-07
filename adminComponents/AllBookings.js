import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigation } from '@react-navigation/native';
import { background, primary, secondary, success } from '../utils/constants';

const AllBookings = () => {
  const navigation = useNavigation();
  const {
    loading,
    allPoojaBookings,
    allMuhurtBookings,
    refreshAllPoojaBookings,
    refreshAllMuhurtRequest,
    allKundaliBookings,
  } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  const allBookings = [
    ...allPoojaBookings,
    ...allMuhurtBookings,
    ...allKundaliBookings,
  ];

  useEffect(() => {
    refreshAllPoojaBookings();
    refreshAllMuhurtRequest();
  }, []);

  const onRefresh = useCallback(() => {
    refreshAllPoojaBookings();
    refreshAllMuhurtRequest();
  }, [refreshAllPoojaBookings, refreshAllMuhurtRequest]);

  const handlePress = id => {
    const selectedBooking = allBookings.find(pid => pid.id == id);
    const bookingType = getBookingType(selectedBooking);
    console.log('bookingType', bookingType);
    navigation.navigate('SingleBooking', {
      selectedBooking: selectedBooking,
      bookingType,
    });
  };

  const getBookingType = item => {
    if (item.poojaName) return 'pooja';
    if (item.muhurtName) return 'muhurt';
    return 'kundali';
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handlePress(item.id)}>
      <View style={styles.bookingContainer}>
        <View>
          <Text style={styles.title}>
            {item.poojaName || item.muhurtName || item.type}
          </Text>
          <Text style={styles.text}>{item.poojaDate || item.month}</Text>
        </View>
        <View>
          <Text style={{ color: success, fontWeight: '500' }}>
            {item.poojaName
              ? 'Pooja Booking'
              : item.muhurtName
              ? 'Muhurt Request'
              : 'Kundali Request'}
          </Text>
          {item.reply && (
            <Text style={{ color: secondary, fontWeight: '500' }}>
              Already Replied
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.wrapper}>
      <Text style={styles.heading}>All Bookings</Text>
      <FlatList
        data={allBookings}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            colors={[primary]}
            tintColor={primary}
            title="Refreshing bookings..."
            titleColor={primary}
          />
        }
        ListEmptyComponent={
          !loading && allBookings.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No bookings found.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default AllBookings;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: background,
    padding: 10,
  },
  container: {
    padding: 10,
    gap: 12,
    backgroundColor: background,
    flex: 1,
  },
  tileContainer: {
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  bookingContainer: {
    backgroundColor: '#fff',
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 3.84,
    borderRadius: 8, // Apply border radius here for the card
    borderWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  heading: {
    fontSize: 24,
    color: primary,
    lineHeight: 35,
    fontWeight: 'bold', // Make title more prominent
    textAlign: 'center',
    marginVertical: 10,
  },
  title: {
    fontSize: 20,
    color: primary,
    lineHeight: 35,
    fontWeight: 'bold', // Make title more prominent
  },
  text: {
    color: 'gray',
    fontSize: 16, // Slightly larger text
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: 'gray',
  },
});
