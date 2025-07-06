import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import DropDownPicker from 'react-native-dropdown-picker';
import { accent2, background, primary } from '../utils/constants';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';

const BookPooja = () => {
  const { pooja } = useUser();
  const [open, setOpen] = useState(false);
  const [selectedPooja, setSelectedPooja] = useState(null);
  const [items, setItems] = useState([]);
  const [selectedDateFormatted, setSelectedDateFormatted] = useState('');
  const [selectedDateRaw, setSelectedDateRaw] = useState('');

  const today = new Date();
  const todayString = today.toISOString().split('T')[0];
  const navigation = useNavigation();

  const selectedPoojaDetails = pooja.find(p => p.id === selectedPooja);

  const checkoutData = {
    pooja: selectedPoojaDetails,
    selectedDate: selectedDateFormatted,
  };

  useEffect(() => {
    if (pooja && pooja.length > 0) {
      const formattedItems = pooja.map(item => ({
        label: item.title,
        value: item.id,
      }));
      setItems(formattedItems);
    }
  }, [pooja]);

  const formatAndSetDate = dateString => {
    setSelectedDateRaw(dateString);

    if (dateString) {
      const date = new Date(dateString);
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      };
      // Format to DD/MM/YYYY
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const formattedDatePart = `${day}/${month}/${year}`;

      // Get the day of the week
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });

      setSelectedDateFormatted(`${formattedDatePart}, ${dayOfWeek}`);
    } else {
      setSelectedDateFormatted('');
    }
  };

  const handleSubmit = () => {
    if (!selectedPooja) {
      Alert.alert('Validation', 'Please select a Pooja name.');
      return;
    }
    if (!selectedDateFormatted) {
      // Check the formatted date
      Alert.alert('Validation', 'Please select a date.');
      return;
    }
    navigation.navigate('UpdateDetails', { checkoutData });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Book Your Pooja</Text>
      <Text style={styles.title}>Select Pooja Name</Text>
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
      <Text style={styles.title}>Select Date</Text>
      <Calendar
        onDayPress={day => {
          formatAndSetDate(day.dateString); // Use the new formatting function
        }}
        minDate={todayString}
        markedDates={{
          [selectedDateRaw]: {
            // Use the raw date for marking
            selected: true,
            marked: true,
            selectedColor: 'orange',
          },
        }}
        style={styles.calendar}
        theme={{
          backgroundColor: '#ffffff',
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#b6c1cd',
          selectedDayBackgroundColor: '#00adf5',
          selectedDayTextColor: '#ffffff',
          todayTextColor: accent2,
          dayTextColor: '#2d4150',
          textDisabledColor: '#dd99ee',
        }}
      />
      {selectedDateFormatted ? (
        <Text style={styles.selectedDateDisplay}>
          Selected Date: {selectedDateFormatted}
        </Text>
      ) : null}

      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 18,
    fontWeight: '400',
    marginVertical: 5,
  },
  calendar: {
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedDateDisplay: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    textAlign: 'center',
    color: primary,
  },
  button: {
    backgroundColor: primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
