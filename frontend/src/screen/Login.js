import React, { useState, useContext } from 'react';
import { Alert, View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { UserContext } from '../../UserContext';
import config from '../../config';

const server = config.apiUrl;

const LoginScreen = ({ navigation }) => {
  const { setUsername } = useContext(UserContext); // 使用 context 来设置用户名

  const [usernameInput, setUsernameInput] = useState(''); // 用户名状态
  const [password, setPassword] = useState(''); // 密码状态
  const [role, setRole] = useState('student'); // 登录类型，默认为学生登录

  // 点击登录按钮后的处理函数
  const handleLogin = () => {
    // 检查用户名和密码是否为空
    if (usernameInput === '' || password === '') {
      Alert.alert('Error', 'Please enter both username and password.');
    } else {
      fetch(`${server}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: usernameInput,
          password,
          accountType: role,
        }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.message.startsWith('Login successful')) {
          // 全局设置用户名
          setUsername(usernameInput);

          // 如果角色是 teacher，则跳转到 TeacherDashboard 页面
          if (role === 'teacher') {
            navigation.navigate('TeacherDashboard');
          } 
          // 如果角色是 student，则跳转到 StudentDashboard 页面
          else if (role === 'student') {
            navigation.navigate('StudentDashboard');
          } 

          // 清空输入框
          setUsernameInput('');
          setPassword('');
        } else {
          Alert.alert('Error', 'Failed to login.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        Alert.alert('Error', 'Failed to login.');
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* 登录页面标题 */}
      <Text style={styles.title}>User Login</Text>

      {/* 学生和教师登录选项 */}
      <View style={styles.roleContainer}>
        {/* 学生登录按钮 */}
        <TouchableOpacity
          style={[styles.roleButton, role === 'student' && styles.selectedRoleButton]}
          onPress={() => setRole('student')}
        >
          <Text style={[styles.roleButtonText, role === 'student' && styles.selectedRoleButtonText]}>Student</Text>
        </TouchableOpacity>

        {/* 教师登录按钮 */}
        <TouchableOpacity
          style={[styles.roleButton, role === 'teacher' && styles.selectedRoleButton]}
          onPress={() => setRole('teacher')}
        >
          <Text style={[styles.roleButtonText, role === 'teacher' && styles.selectedRoleButtonText]}>Teacher</Text>
        </TouchableOpacity>
      </View>

      {/* 用户名输入框 */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={usernameInput}
        onChangeText={setUsernameInput}
      />

      {/* 密码输入框 */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry // 隐藏输入的密码
      />

      {/* 登录按钮 */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      {/* 创建账户 */}
      <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('CreateAccount')}>
        <Text style={styles.linkButtonText}>Create Account</Text>
      </TouchableOpacity>

      {/* 忘记/重置密码 */}
      <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('ResetPassword')}>
        <Text style={styles.linkButtonText}>Forgot/Reset Password</Text>
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
