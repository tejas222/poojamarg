import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import DropDownPicker from 'react-native-dropdown-picker';
import { background, primary } from '../utils/constants';
import { Calendar, LocaleConfig } from 'react-native-calendars';

const BookPooja = () => {
  const { pooja } = useUser();
  const [open, setOpen] = useState(false);
  const [selectedPooja, setSelectedPooja] = useState(null);
  const [items, setItems] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  // Get today's date in 'YYYY-MM-DD' format
  const today = new Date();
  const todayString = today.toISOString().split('T')[0]; // Gets 'YYYY-MM-DD'

  useEffect(() => {
    if (pooja && pooja.length > 0) {
      const formattedItems = pooja.map(item => ({
        label: item.title,
        value: item.id,
      }));
      setItems(formattedItems);
    }
  }, [pooja]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Book Your Pooja</Text>
      <DropDownPicker
        open={open}
        value={selectedPooja}
        items={items}
        setOpen={setOpen}
        setValue={setSelectedPooja}
        setItems={setItems}
        placeholder="Select a Pooja"
        zIndex={1000}
        zIndexInverse={3000}
        style={{ marginBottom: open ? 50 : 20 }}
      />
      <Calendar
        onDayPress={day => {
          setSelectedDate(day.dateString);
        }}
        minDate={todayString}
        markedDates={{
          [selectedDate]: {
            selected: true,
            marked: true,
            selectedColor: 'orange',
          },
        }}
        // Optional: you can also set the initial visible month to today
      />
    </View>
  );
};

export default BookPooja;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: background,
    padding: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
    color: primary,
  },
});
