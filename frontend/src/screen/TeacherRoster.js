import React, { useState } from 'react';
import { SafeAreaView, StatusBar, View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons'; 

const TeacherRosterEdit = () => {
  const navigation = useNavigation();

  // 假设已有学生的列表
  const [students, setStudents] = useState([
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Sam Johnson' },
  ]);

  // 添加学生的状态
  const [newStudentName, setNewStudentName] = useState('');

  // 添加学生
  const addStudent = () => {
    if (newStudentName.trim() === '') {
      Alert.alert('Error', 'Please provide a valid student name.');
      return;
    }

    const newStudent = {
      id: students.length + 1,  // 简单ID生成
      name: newStudentName,
    };

    setStudents([...students, newStudent]);
    setNewStudentName('');  // 清空输入框
  };

  // 移除学生
  const removeStudent = (id) => {
    setStudents(students.filter((student) => student.id !== id));
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

          {/* 学生列表 */}
          <Text style={styles.subTitle}>Current Students:</Text>
          {students.map((student) => (
            <View key={student.id} style={styles.studentCard}>
              <Text style={styles.studentName}>{student.name}</Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeStudent(student.id)}
              >
                <MaterialIcons name="delete" size={24} color="red" />
              </TouchableOpacity>
            </View>
          ))}

          {/* 添加学生 */}
          <TextInput
            style={styles.input}
            placeholder="New Student Name"
            value={newStudentName}
            onChangeText={setNewStudentName}
          />
          <TouchableOpacity style={styles.addButton} onPress={addStudent}>
            <Text style={styles.buttonText}>Add Student</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

// 样式定义
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