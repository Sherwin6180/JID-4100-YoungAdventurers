import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';

const ResetPasswordScreen = ({ navigation }) => {
  
  const [email, setEmail] = useState('');

  // 找回密码按键
  const handleResetPassword = () => {
    if (email === '') {
      Alert.alert('Error', 'Please enter your email.');
    } else {
      // 此处添加实际的找回密码代码
      Alert.alert('Success', `Password reset link sent to ${email}`);
      navigation.goBack(); // 返回到登录页面
    }
  };

  return (
    <View style={styles.container}>
      {/* 找回密码界面标题 */}
      <Text style={styles.title}>Reset Password</Text>

      {/* 电子邮件输入框 */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {/* 发送验证邮件按键 */}
      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Send Verify Mail</Text>
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