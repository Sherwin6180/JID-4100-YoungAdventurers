import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';

const SecurityQuestionsScreen = () => {
  const [question1, setQuestion1] = useState('');
  const [answer1, setAnswer1] = useState('');
  const [question2, setQuestion2] = useState('');
  const [answer2, setAnswer2] = useState('');

  const handleSaveQuestions = () => {
    if (question1 === '' || answer1 === '' || question2 === '' || answer2 === '') {
      Alert.alert('Error', 'Please answer all questions.');
    } else {
      Alert.alert('Success', 'Security questions saved! Transfer to dashboard page.');
      // send question and answer to database and save
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Security Questions</Text>

      <TextInput
        style={styles.input}
        placeholder="Security Question 1"
        value={question1}
        onChangeText={setQuestion1}
      />
      <TextInput
        style={styles.input}
        placeholder="Answer 1"
        value={answer1}
        onChangeText={setAnswer1}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Security Question 2"
        value={question2}
        onChangeText={setQuestion2}
      />
      <TextInput
        style={styles.input}
        placeholder="Answer 2"
        value={answer2}
        onChangeText={setAnswer2}
      />

      <TouchableOpacity style={styles.button} onPress={handleSaveQuestions}>
        <Text style={styles.buttonText}>Save Questions</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#B3A369',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SecurityQuestionsScreen;
