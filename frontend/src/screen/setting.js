import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Settings = () => {
  const navigation = useNavigation();

  // 本地数据存储
  const [userData, setUserData] = useState({
    password: 'password123', // 初始密码
    verifyQuestion: 'Your pet\'s name?', // 初始验证问题
    verifyAnswer: 'Fluffy', // 初始验证答案
    accountType: 'student', // 账户类型，可能为 'student' 或 'teacher'
  });

  // 编辑状态
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isEditingVerify, setIsEditingVerify] = useState(false);

  // 修改密码
  const handlePasswordEditSave = () => {
    if (isEditingPassword) {
      Alert.alert('Success', 'Password has been updated.');
    } else {
      Alert.alert(
        'Confirm Edit',
        'Do you want to edit your password?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'OK', onPress: () => setIsEditingPassword(true) },
        ]
      );
    }
    if (isEditingPassword) setIsEditingPassword(false); // 保存后退出编辑模式
  };

  // 修改验证问题和答案
  const handleVerifyEditSave = () => {
    if (isEditingVerify) {
      Alert.alert('Success', 'Verification question and answer have been updated.');
    } else {
      Alert.alert(
        'Confirm Edit',
        'Do you want to edit your verification question and answer?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'OK', onPress: () => setIsEditingVerify(true) },
        ]
      );
    }
    if (isEditingVerify) setIsEditingVerify(false); // 保存后退出编辑模式
  };

  // 根据账户类型跳转 Dashboard
  const handleDashboardNavigation = () => {
    if (userData.accountType === 'student') {
      navigation.navigate('StudentDashboard');
    } else if (userData.accountType === 'teacher') {
      navigation.navigate('TeacherDashboard');
    } else {
      Alert.alert('Error', 'Unknown account type.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.outerContainer}>
        {/* 左边的图标列 */}
        <View style={styles.iconColumn}>
          <View>
            {/* Dashboard 图标 */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleDashboardNavigation}
            >
              <MaterialIcons name="dashboard" size={30} color="black" />
            </TouchableOpacity>

            {/* Settings 图标 */}
            <TouchableOpacity
              style={[styles.iconButton, styles.activeIconButton]}
              disabled={true}
            >
              <MaterialIcons name="settings" size={30} color="gray" />
            </TouchableOpacity>
          </View>

          {/* Back 和 Logout 图标 */}
          <View style={styles.bottomIcons}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons name="arrow-back" size={30} color="black" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => {
                Alert.alert(
                  'Confirm Logout',
                  'Are you sure you want to log out?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'OK', onPress: () => navigation.navigate('Login') },
                  ]
                );
              }}
            >
              <MaterialIcons name="logout" size={30} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 主要内容区域 */}
        <View style={styles.content}>
          <Text style={styles.title}>Settings</Text>

          {/* 密码部分 */}
          <View style={styles.settingContainer}>
            <Text style={styles.settingLabel}>Password:</Text>
            <TextInput
              style={styles.settingInput}
              value={userData.password}
              editable={isEditingPassword}
              secureTextEntry={!isEditingPassword} // 如果非编辑模式隐藏密码
              onChangeText={(text) =>
                setUserData((prev) => ({ ...prev, password: text }))
              }
            />
            <TouchableOpacity style={styles.editButton} onPress={handlePasswordEditSave}>
              <Text style={styles.editButtonText}>
                {isEditingPassword ? 'Save' : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* 验证问题部分 */}
          <View style={styles.settingContainer}>
            <Text style={styles.settingLabel}>Verification Question:</Text>
            <TextInput
              style={styles.settingInput}
              value={userData.verifyQuestion}
              editable={isEditingVerify}
              onChangeText={(text) =>
                setUserData((prev) => ({ ...prev, verifyQuestion: text }))
              }
            />
            <Text style={styles.settingLabel}>Answer:</Text>
            <TextInput
              style={styles.settingInput}
              value={userData.verifyAnswer}
              editable={isEditingVerify}
              onChangeText={(text) =>
                setUserData((prev) => ({ ...prev, verifyAnswer: text }))
              }
            />
            <TouchableOpacity style={styles.editButton} onPress={handleVerifyEditSave}>
              <Text style={styles.editButtonText}>
                {isEditingVerify ? 'Save' : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

// 样式
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  outerContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  iconColumn: {
    width: 60,
    backgroundColor: '#B3A369',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingTop: 30,
  },
  iconButton: {
    padding: 10,
    borderRadius: 8,
  },
  activeIconButton: {
    backgroundColor: '#f9f9f9',
    width: '100%',
  },
  bottomIcons: {
    marginTop: 'auto',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  settingContainer: {
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingInput: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#B3A369',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: '#B3A369',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Settings;
