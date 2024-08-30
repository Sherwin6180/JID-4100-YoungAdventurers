import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';

const CreateAccountScreen = ({ navigation }) => {
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState('student'); // 账户类型，默认是学生

  // 创建账户按键
  const handleCreateAccount = () => {
    if (username === '' || email === '' || password === '') {
      Alert.alert('Error', 'Please fill out all fields.');
    } else {
      // 此处添加实际的创建账户逻辑
      Alert.alert('Success', `Account created for ${username}`);
      navigation.goBack(); // 返回到登录页面
    }
  };

  return (
    <View style={styles.container}>
      {/* 创建账户界面标题 */}
      <Text style={styles.title}>Create Account</Text>

      {/* 用户名输入框 */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />

      {/* 电子邮件输入框 */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {/* 密码输入框 */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* 账户类型选择 */}
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

      {/* 创建账户按钮 */}
      <TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      {/* 返回按键 */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

// 样式定义
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