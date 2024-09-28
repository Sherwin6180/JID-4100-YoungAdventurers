import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import config from '../../config';
const server = config.apiUrl;

const CreateAccountScreen = ({ navigation }) => {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [accountType, setAccountType] = useState('student'); // account type, default as a student
  const [securityQuestion1, setSecurityQuestion1] = useState(''); // security question 1
  const [securityAnswer1, setSecurityAnswer1] = useState(''); // answer for security question 1
  const [securityQuestion2, setSecurityQuestion2] = useState(''); // security question 2
  const [securityAnswer2, setSecurityAnswer2] = useState(''); // answer for security question 2

  // create account button
  const handleCreateAccount = () => {
    if (username === '' || email === '' || password === '' || firstName === '' || lastName ==='' || securityQuestion1 === '' || securityAnswer1 === '' || securityQuestion2 === '' || securityAnswer2 === '') {
      Alert.alert('Error', 'Please fill out all fields.');
    } else {
      fetch(`${server}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          firstName,
          lastName,
          accountType,
          securityQuestion1,
          securityAnswer1,
          securityQuestion2,
          securityAnswer2,
        }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'Account created successfully!') {
          Alert.alert('Success', `Account created for ${username}`);
          navigation.goBack();
        } else {
          Alert.alert('Error', 'Failed to create account.');
        }
      })
      .catch(error => {
        console.error(error);
        Alert.alert('Error', 'Failed to create account.');
      });
      Alert.alert('Success', `Account created for ${username}`);
      // navigation.navigate('SecurityQuestions'); // move to security question page
    }
  };

  return (
    <View style={styles.container}>
      {/* create account page title */}
      <Text style={styles.title}>Create Account</Text>

      {/* username input box */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />

      {/* email input box */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {/* password input box */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* firstName input box */}
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />

      {/* lastName input box */}
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />

      {/* security question 1 input box */}
      <TextInput
        style={styles.input}
        placeholder="Security Question 1"
        value={securityQuestion1}
        onChangeText={setSecurityQuestion1}
      />

      {/* security answer 1 input box */}
      <TextInput
        style={styles.input}
        placeholder="Answer for Question 1"
        value={securityAnswer1}
        onChangeText={setSecurityAnswer1}
      />

      {/* security question 2 input box */}
      <TextInput
        style={styles.input}
        placeholder="Security Question 2"
        value={securityQuestion2}
        onChangeText={setSecurityQuestion2}
      />

      {/* security answer 2 input box */}
      <TextInput
        style={styles.input}
        placeholder="Answer for Question 2"
        value={securityAnswer2}
        onChangeText={setSecurityAnswer2}
      />

      {/* choose account type */}
      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[styles.roleButton, accountType === 'student' && styles.selectedRoleButton]}
          onPress={() => setAccountType('student')}
        >
          <Text style={[styles.roleButtonText, accountType === 'student' && styles.selectedRoleButtonText]}>
            Student
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.roleButton, accountType === 'teacher' && styles.selectedRoleButton]}
          onPress={() => setAccountType('teacher')}
        >
          <Text style={[styles.roleButtonText, accountType === 'teacher' && styles.selectedRoleButtonText]}>
            Teacher
          </Text>
        </TouchableOpacity>
      </View>

      {/* create account button */}
      <TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      {/* return button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
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
    roleContainer: {
      flexDirection: 'row',
      marginBottom: 20,
    },
    roleButton: {
      flex: 1,
      padding: 10,
      marginHorizontal: 5,
      borderWidth: 1,
      borderColor: '#B3A369',
      borderRadius: 5,
      alignItems: 'center',
      backgroundColor: 'white',
    },
    selectedRoleButton: {
      backgroundColor: '#B3A369',
    },
    roleButtonText: {
      color: '#B3A369',
    },
    selectedRoleButtonText: {
      color: 'white',
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
    backButton: {
      marginTop: 20,
    },
    backButtonText: {
      color: '#B3A369',
      fontSize: 16,
      textDecorationLine: 'underline',
    },
  });
  
  export default CreateAccountScreen;
  // This is a test message 2
  // add test message here