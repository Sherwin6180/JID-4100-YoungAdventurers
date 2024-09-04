import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';

const ResetPasswordScreen = ({ navigation }) => {
  const [question1, setQuestion1] = useState('');
  const [question2, setQuestion2] = useState('');
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isVerified, setIsVerified] = useState(false); // Track if the answers are verified

  // Simulating fetching user security questions and answers from a server or database
  useEffect(() => {
    setQuestion1("What is your mother's maiden name?");
    setQuestion2("What was the name of your first pet?");
  }, []);

  // Simulated correct answers (in a real application, you'd fetch these from a database)
  const correctAnswer1 = 'Smith';
  const correctAnswer2 = 'Fluffy';

  // Reset password button
  const handleResetPassword = () => {
    if (answer1 === '' || answer2 === '') {
      Alert.alert('Error', 'Please answer both questions.');
    } else if (answer1 !== correctAnswer1 || answer2 !== correctAnswer2) {
      // If answers don't match
      Alert.alert('Error', 'Security answers do not match. Reset password failed.');
    } else {
      // If answers match, allow user to reset password
      setIsVerified(true);
      Alert.alert('Verified', 'Security answers match. Please enter your new password.');
    }
  };

  // Handle the new password reset
  const handlePasswordReset = () => {
    if (newPassword === '') {
      Alert.alert('Error', 'Please enter a new password.');
    } else {
      Alert.alert('Success', 'Password has been reset successfully.');
      navigation.goBack(); // Navigate back to the login page
    }
  };

  return (
    <View style={styles.container}>
      {/* Reset Password Screen Title */}
      <Text style={styles.title}>Reset Password</Text>

      {/* Security Question 1 */}
      <Text style={styles.question}>{question1}</Text>
      <TextInput
        style={styles.input}
        placeholder="Your Answer"
        value={answer1}
        onChangeText={setAnswer1}
        editable={!isVerified} // Disable editing if verified
      />

      {/* Security Question 2 */}
      <Text style={styles.question}>{question2}</Text>
      <TextInput
        style={styles.input}
        placeholder="Your Answer"
        value={answer2}
        onChangeText={setAnswer2}
        editable={!isVerified} // Disable editing if verified
      />

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
        </>
      )}

      {/* Reset Password Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={isVerified ? handlePasswordReset : handleResetPassword}
      >
        <Text style={styles.buttonText}>
          {isVerified ? 'Reset Password' : 'Verify Answers'}
        </Text>
      </TouchableOpacity>

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
