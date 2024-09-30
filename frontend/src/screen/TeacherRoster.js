import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, StatusBar, View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons'; 
import { UserContext } from '../../UserContext'; // 引入 UserContext
import config from '../../config';

const server = config.apiUrl;

const TeacherRosterEdit = () => {
  const navigation = useNavigation();
  const { courseID, semester, sectionID } = useContext(UserContext); // 从 UserContext 中获取 courseID, semester, sectionID

  const [students, setStudents] = useState([]);
  const [newStudentUsername, setNewStudentUsername] = useState(''); // 添加新学生用户名

  // 在组件加载时获取已 enroll 的学生
  useEffect(() => {
    fetchEnrolledStudents();
  }, []);

  // 获取当前 section 下所有已 enroll 的学生
  const fetchEnrolledStudents = async () => {
    try {
      const response = await fetch(`${server}/api/class/getEnrolledStudents/${courseID}/${semester}/${sectionID}`);
      const data = await response.json();

      if (response.ok) {
        setStudents(data.students); // 设置获取到的学生数据
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch students');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'An error occurred while fetching students.');
    }
  };

  // 添加新学生
  const addStudent = async () => {
    if (newStudentUsername.trim() === '') {
      Alert.alert('Error', 'Please provide a valid student username.');
      return;
    }

    try {
      const response = await fetch(`${server}/api/class/addEnrollment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseID,
          semester,
          sectionID,
          studentUsername: newStudentUsername,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Student added successfully!');
        setStudents([...students, data.student]); // 更新学生列表
        setNewStudentUsername(''); // 清空输入框
      } else {
        Alert.alert('Error', data.message || 'Failed to add student.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while adding the student.');
    }
  };

  // 移除学生
  const removeStudent = async (studentUsername) => {
    try {
      const response = await fetch(`${server}/api/class/removeEnrollment`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseID,
          semester,
          sectionID,
          studentUsername,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Student removed successfully!');
        setStudents(students.filter((student) => student.username !== studentUsername)); // 更新学生列表
      } else {
        Alert.alert('Error', data.message || 'Failed to remove student.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while removing the student.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" hidden={true} />

      <View style={styles.outerContainer}>
        {/* 左边的图标列 */}
        <View style={styles.iconColumn}>
          <View>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('TeacherDashboard')}
            >
              <MaterialIcons name="dashboard" size={30} color="black" />
            </TouchableOpacity>
          </View>

          <View style={styles.bottomIcons}>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
              <MaterialIcons name="arrow-back" size={30} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Edit Roster</Text>

          {/* 显示当前 section 下所有学生 */}
          <Text style={styles.subTitle}>Current Students:</Text>
          {students.map((student) => (
            student && student.firstName && student.lastName ? (
              <View key={student.username} style={styles.studentCard}>
                <Text style={styles.studentName}>{student.firstName} {student.lastName}</Text>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeStudent(student.username)} // 调用 removeStudent 函数
                >
                  <MaterialIcons name="delete" size={24} color="red" />
                </TouchableOpacity>
              </View>
            ) : null // If student data is incomplete, don't render
          ))}

          {/* 输入新学生的用户名并添加 */}
          <TextInput
            style={styles.input}
            placeholder="Enter Student Username"
            value={newStudentUsername}
            onChangeText={setNewStudentUsername}
          />
          <TouchableOpacity style={styles.addButton} onPress={addStudent}>
            <Text style={styles.buttonText}>Add Student</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

// 样式定义保持不变
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
    flexDirection: 'column',
  },
  bottomIcons: {
    marginTop: 'auto',
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  studentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  studentName: {
    fontSize: 16,
  },
  removeButton: {
    padding: 10,
  },
  input: {
    width: '100%',
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  addButton: {
    padding: 15,
    backgroundColor: '#B3A369',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TeacherRosterEdit;
