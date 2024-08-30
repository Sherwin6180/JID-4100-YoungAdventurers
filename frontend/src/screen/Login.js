import React, { useState } from 'react';
import { Alert, View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

const LoginScreen = ({ navigation }) => {

  const [username, setUsername] = useState(''); // User Name Status
  const [password, setPassword] = useState(''); // Password Status
  const [role, setRole] = useState('student'); // Login type, default is student login

  // Click on the Login button
  const handleLogin = () => {
    // Check that the username and password are not empty
    if (username === '' || password === '') {
      Alert.alert('Error', 'Please enter both username and password.');
    } else {
      // Authenticate login, currently defaults to success
      Alert.alert('Success', `Logged in as ${role}: ${username}`);
      // Clear the input box
      setUsername('');
      setPassword('');
    }
  };

  return (
    <View style={styles.container}>
      {/* Login Page Title */}
      <Text style={styles.title}>User Login</Text>

      {/* Student and Teacher Login Options */}
      <View style={styles.roleContainer}>
        {/* Student Login Button */}
        <TouchableOpacity
          style={[styles.roleButton, role === 'student' && styles.selectedRoleButton]}
          // onPress={() => handleRoleChange('student')}
          onPress={() => setRole('student')}
        >
          <Text style={[styles.roleButtonText, role === 'student' && styles.selectedRoleButtonText]}>Student</Text>
        </TouchableOpacity>

        {/* Teacher Login Button */}
        <TouchableOpacity
          style={[styles.roleButton, role === 'teacher' && styles.selectedRoleButton]}
          // onPress={() => handleRoleChange('teacher')}
          onPress={() => setRole('teacher')}
        >
          <Text style={[styles.roleButtonText, role === 'teacher' && styles.selectedRoleButtonText]}>Teacher</Text>
        </TouchableOpacity>
      </View>

      {/* User name input box */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />

      {/* Password input box */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry // Hide the entered password
      />

      {/* Login button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      {/* Create an account */}
      <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('CreateAccount')}>
        <Text style={styles.linkButtonText}>Create Account</Text>
      </TouchableOpacity>

      {/* Retrieve password */}
      <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('ResetPassword')}>
        <Text style={styles.linkButtonText}>Forgot/Reset Password</Text>
      </TouchableOpacity>
    </View>
  );
};

// Style Definition
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
  input: {
    width: '100%',
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  loginButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#B3A369',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 10,
  },
  linkButtonText: {
    color: '#B3A369',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
