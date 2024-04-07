import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function App() {
  const [question1] = useState('What is the color of the sky?');
  const [question2] = useState('what is the color of the grass?');
  const [inputText1, setInputText1] = useState('');
  const [inputText2, setInputText2] = useState('');
  const [storedText, setStoredText] = useState('');

  const handleButtonPress = () => {
    setStoredText(inputText1 + inputText2);
  };

  return (
    <View style={styles.container}>
      <Text>{question1}</Text>
      <TextInput
        style={{
          height: 40,
          width: '80%',
          borderColor: 'gray',
          borderWidth: 1,
          marginBottom: 10,
          paddingHorizontal: 10,
        }}
        onChangeText={setInputText1}
        value={inputText1}
        placeholder="Type here..."
      />

      <Text>{question2}</Text>
      <TextInput
        style={{
          height: 40,
          width: '80%',
          borderColor: 'gray',
          borderWidth: 1,
          marginBottom: 10,
          paddingHorizontal: 10,
        }}
        onChangeText={setInputText2}
        value={inputText2}
        placeholder="Type here..."
      />

      <Button
        title="Submit"
        onPress={handleButtonPress}
      />

      <Text>Stored Text: {storedText}</Text>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});