import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import config from '../../config';
const server = config.apiUrl;

const ResetPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState(''); // Add email state
  const [question1, setQuestion1] = useState('');
  const [question2, setQuestion2] = useState('');
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isVerified, setIsVerified] = useState(false); // Track if the answers are verified
  const [isQuestionsFetched, setIsQuestionsFetched] = useState(false); // Track if security questions are fetched

  // Fetch security questions based on email
  const fetchSecurityQuestions = () => {
    if (email === '') {
      Alert.alert('Error', 'Please enter your email.');
      return;
    }

    fetch(`${server}/api/auth/getSecurityQuestions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
      }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        setQuestion1(data.question1);
        setQuestion2(data.question2);
        setIsQuestionsFetched(true);
      } else {
        Alert.alert('Error', 'Email not found or invalid.');
      }
    })
    .catch(error => {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch security questions.');
    });
  };

  // Verify security answers
  const handleVerifyAnswers = () => {
    if (answer1 === '' || answer2 === '') {
      Alert.alert('Error', 'Please answer both questions.');
      return;
    }

    fetch(`${server}/api/auth/verifySecurityAnswers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        answer1,
        answer2,
      }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        setIsVerified(true);
        Alert.alert('Verified', 'Security answers match. Please enter your new password.');
      } else {
        Alert.alert('Error', 'Security answers do not match.');
      }
    })
    .catch(error => {
      console.error(error);
      Alert.alert('Error', 'Verification failed.');
    });
  };

  // Handle password reset
  const handlePasswordReset = () => {
    if (newPassword === '') {
      Alert.alert('Error', 'Please enter a new password.');
      return;
    }

    fetch(`${server}/api/auth/resetPassword`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        newPassword,
      }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        Alert.alert('Success', 'Password has been reset successfully.');
        navigation.goBack(); // Navigate back to the login page
      } else {
        Alert.alert('Error', 'Failed to reset password.');
      }
    })
    .catch(error => {
      console.error(error);
      Alert.alert('Error', 'Failed to reset password.');
    });
  };

  return (
    <View style={styles.container}>
      {/* Reset Password Screen Title */}
      <Text style={styles.title}>Reset Password</Text>

      {/* Email input box (shown if security questions are not fetched) */}
      {!isQuestionsFetched && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TouchableOpacity style={styles.button} onPress={fetchSecurityQuestions}>
            <Text style={styles.buttonText}>Fetch Security Questions</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Security Questions (shown if questions are fetched) */}
      {isQuestionsFetched && !isVerified && (
        <>
          <Text style={styles.question}>{question1}</Text>
          <TextInput
            style={styles.input}
            placeholder="Your Answer"
            value={answer1}
            onChangeText={setAnswer1}
          />

          <Text style={styles.question}>{question2}</Text>
          <TextInput
            style={styles.input}
            placeholder="Your Answer"
            value={answer2}
            onChangeText={setAnswer2}
          />

          {/* Verify Answers Button */}
          <TouchableOpacity style={styles.button} onPress={handleVerifyAnswers}>
            <Text style={styles.buttonText}>Verify Answers</Text>
          </TouchableOpacity>
        </>
      )}

      {/* New Password Input (only show after answers are verified) */}
      {isVerified && (
        <>
          <Text style={styles.question}>Enter New Password</Text>
          <TextInput
            style={styles.input}
            placeholder="New Password"
            value={newPassword}
            secureTextEntry={true}
            onChangeText={setNewPassword}
          />

          {/* Reset Password Button */}
          <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles
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
  question: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
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

export default ResetPasswordScreen;
