import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  SafeAreaView,
} from 'react-native';
import React, { useState } from 'react';
import { background, primary } from '../utils/constants';
import CardItem from '../components/CardItem';
import DatePicker from 'react-native-date-picker';
import { useNavigation, useRoute } from '@react-navigation/native';

const Kundali = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const isCustomized = route.params?.isCustomized || false;

  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState(null);
  const [birthTime, setBirthTime] = useState(null);
  const [openDate, setOpenDate] = useState(false);
  const [openTime, setOpenTime] = useState(false);
  const [birthPlace, setBirthPlace] = useState('');
  const [question, setQuestion] = useState('');

  const formatDate = date => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = time => {
    return new Date(time).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSubmit = () => {
    if (!name || !birthDate || !birthTime || !birthPlace) {
      Alert.alert('Validation', 'Please fill all fields.');
      return;
    }

    if (isCustomized && !question) {
      Alert.alert('Validation', 'Please enter your question.');
      return;
    }

    const birthDetails = {
      name,
      birthDate: formatDate(birthDate),
      birthTime: formatTime(birthTime),
      birthPlace,
      question,
    };
    navigation.navigate('KundaliPreview', {
      name,
      birthDate: formatDate(birthDate),
      birthTime: formatTime(birthTime),
      birthPlace,
      question,
      isCustomized,
    });
    setName('');
    setBirthDate('');
    setBirthTime('');
    setBirthPlace('');
    setQuestion('');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <CardItem />
            <View style={styles.detailsWrapper}>
              <Text style={styles.title}>Add Your Birth Details</Text>

              <TextInput
                style={styles.input}
                placeholder="तुमचे नाव प्रविष्ट करा"
                value={name}
                onChangeText={setName}
              />

              <TouchableOpacity onPress={() => setOpenDate(true)}>
                <TextInput
                  style={styles.input}
                  placeholder="तुमची जन्मतारीख प्रविष्ट करा"
                  editable={false}
                  value={birthDate ? formatDate(birthDate) : ''}
                />
              </TouchableOpacity>

              <DatePicker
                modal
                open={openDate}
                date={birthDate || new Date()}
                maximumDate={new Date()}
                mode="date"
                onConfirm={date => {
                  setOpenDate(false);
                  setBirthDate(date);
                }}
                onCancel={() => setOpenDate(false)}
              />

              <TouchableOpacity onPress={() => setOpenTime(true)}>
                <TextInput
                  style={styles.input}
                  placeholder="तुमची जन्म वेळ प्रविष्ट करा"
                  editable={false}
                  value={birthTime ? formatTime(birthTime) : ''}
                />
              </TouchableOpacity>

              <DatePicker
                modal
                open={openTime}
                date={birthTime || new Date()}
                mode="time"
                is24hourSource="locale"
                onConfirm={time => {
                  setOpenTime(false);
                  setBirthTime(time);
                }}
                onCancel={() => setOpenTime(false)}
              />

              <TextInput
                style={styles.input}
                placeholder="तुमचे जन्म ठिकाण प्रविष्ट करा "
                value={birthPlace}
                onChangeText={setBirthPlace}
              />
              {isCustomized && (
                <TextInput
                  style={styles.inputDesc}
                  placeholder="तुमचा प्रश्न विचारा"
                  value={question}
                  onChangeText={setQuestion}
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              )}

              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>View Kundali</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default Kundali;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: background,
    padding: 20,
  },
  detailsWrapper: {
    marginVertical: 15,
    gap: 10,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 15,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    height: 50,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  inputDesc: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    height: 150,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff',
  },
});
