import React, { useState, useContext } from 'react';
import { SafeAreaView, StatusBar, View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons'; // 使用 MaterialIcons 图标
import { Picker } from '@react-native-picker/picker'; // 使用 Picker 组件来选择学期
import { UserContext } from '../../UserContext';
import config from '../../config';

const server = config.apiUrl;

const TeacherEditScreen = () => {
  const navigation = useNavigation();
  
  const { username } = useContext(UserContext);  // Access username from UserContext

  // 状态管理
  const [courseTitle, setCourseTitle] = useState('');  // 课程标题
  const [courseID, setCourseID] = useState(''); // 课程ID
  const [courseDescription, setCourseDescription] = useState(''); // 课程描述
  const [semester, setSemester] = useState('Spring 2024'); // 学期，默认设置为Spring 2024
  const [sections, setSections] = useState([]);  // 章节列表
  const [sectionID, setsectionID] = useState('');  // 当前章节ID
  const [sectionDescription, setSectionDescription] = useState('');  // 当前章节描述

  // 添加章节
  const addSection = () => {
    if (sectionID.trim() === '' || sectionDescription.trim() === '') {
      Alert.alert('Error', 'Please fill out both section title and description.');
      return;
    }

    const newSection = {
      id: sections.length + 1,  // 简单的 ID 生成
      title: sectionID,
      description: sectionDescription,
    };
    setSections([...sections, newSection]);
    setsectionID('');  // 清空输入框
    setSectionDescription('');
  };

  // 创建课程
  const createCourse = async () => {
    if (courseTitle.trim() === '' || courseID.trim() === '' || courseDescription.trim() === '' || sections.length === 0) {
      Alert.alert('Error', 'Please fill all course fields and at least one section.');
      return;
    }

    // 获取当前年份和月份
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // JavaScript 的月份从 0 开始，所以需要加 1
    
    // 从 semester 提取年份和学期
    const [semesterTerm, semesterYear] = semester.split(' '); // 如 "Spring 2024" -> ["Spring", "2024"]

    // 判定 courseType
    let courseType = "current"; // 默认为 current
    
    if (parseInt(semesterYear) < currentYear) {
      courseType = "previous"; // 输入年份小于当前年份
    } else if (parseInt(semesterYear) === currentYear) {
      if (semesterTerm === "Spring" && currentMonth > 4) {
        courseType = "previous"; // 当前为夏季或秋季，而输入为春季
      } else if (semesterTerm === "Summer" && currentMonth > 7) {
        courseType = "previous"; // 当前为秋季，而输入为夏季
      }
      // 如果输入的学期是秋季，且当前是秋季或之前的月份，保持 courseType 为 current
    }

    // 准备发送给 API 的数据
    const courseData = {
      courseID,
      courseTitle,
      courseDescription,
      courseType,
      semester,
      teacherUsername: username,
      sections: sections.map(section => ({
        sectionID: section.title,
        sectionDescription: section.description
      }))
    };

    try {
      // 发送 API 请求
      const response = await fetch(`${server}/api/teacher/teachNewCourse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });

      if (response.ok) {
        Alert.alert('Success', 'Course created successfully!');
        navigation.goBack(); // Navigate back after success
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Failed to create the course.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while creating the course.');
    }
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" hidden={true} />

      <View style={styles.outerContainer}>
        {/* 左边的图标列 */}
        <View style={styles.iconColumn}>
          <View>
            {/* Dashboard 图标 */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('TeacherDashboard')}
            >
              <MaterialIcons name="dashboard" size={30} color="black" />
            </TouchableOpacity>

            {/* Setting 图标 */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('Settings')}
            >
              <MaterialIcons name="settings" size={30} color="black" />
            </TouchableOpacity>
          </View>

          {/* Back 和 Logout 图标，放置在底部 */}
          <View style={styles.bottomIcons}>
            {/* Back 图标 */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons name="arrow-back" size={30} color="black" />
            </TouchableOpacity>

            {/* Logout 图标 */}
            <TouchableOpacity style={styles.iconButton} onPress={() => { /* 登出逻辑 */ }}>
              <MaterialIcons name="logout" size={30} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 主要内容区域 */}
        <ScrollView contentContainerStyle={styles.container}>
          {/* 创建课程部分 */}
          <Text style={styles.courseName}>Create a Course</Text>

          <TextInput
            style={styles.input}
            placeholder="Course ID"
            value={courseID}
            onChangeText={setCourseID}
          />

          <TextInput
            style={styles.input}
            placeholder="Course Title"
            value={courseTitle}
            onChangeText={setCourseTitle}
          />

          <TextInput
            style={styles.input}
            placeholder="Course Description"
            value={courseDescription}
            onChangeText={setCourseDescription}
          />

          {/* 添加学期选择器 */}
          <Text style={styles.subTitle}>Select Semester</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={semester}
              onValueChange={(itemValue) => setSemester(itemValue)}
            >
              <Picker.Item label="Spring 2024" value="Spring 2024" />
              <Picker.Item label="Summer 2024" value="Summer 2024" />
              <Picker.Item label="Fall 2024" value="Fall 2024" />
              <Picker.Item label="Spring 2025" value="Spring 2025" />
              <Picker.Item label="Summer 2025" value="Summer 2025" />
              <Picker.Item label="Fall 2025" value="Fall 2025" />
              <Picker.Item label="Spring 2026" value="Spring 2026" />
              <Picker.Item label="Summer 2026" value="Summer 2026" />
              <Picker.Item label="Fall 2026" value="Fall 2026" />
              <Picker.Item label="Spring 2027" value="Spring 2027" />
              <Picker.Item label="Summer 2027" value="Summer 2027" />
              <Picker.Item label="Fall 2027" value="Fall 2027" />
              <Picker.Item label="Spring 2028" value="Spring 2028" />
              <Picker.Item label="Summer 2028" value="Summer 2028" />
              <Picker.Item label="Fall 2028" value="Fall 2028" />
              <Picker.Item label="Spring 2029" value="Spring 2029" />
              <Picker.Item label="Summer 2029" value="Summer 2029" />
              <Picker.Item label="Fall 2029" value="Fall 2029" />
              <Picker.Item label="Spring 2030" value="Spring 2030" />
              <Picker.Item label="Summer 2030" value="Summer 2030" />
              <Picker.Item label="Fall 2030" value="Fall 2030" />
            </Picker>
          </View>

          {/* 添加章节部分 */}
          <Text style={styles.subTitle}>Add Sections</Text>
          <TextInput
            style={styles.input}
            placeholder="Section Title"
            value={sectionID}
            onChangeText={setsectionID}
          />
          <TextInput
            style={styles.input}
            placeholder="Section Description"
            value={sectionDescription}
            onChangeText={setSectionDescription}
          />

          <TouchableOpacity style={styles.addButton} onPress={addSection}>
            <Text style={styles.buttonText}>Add Section</Text>
          </TouchableOpacity>

          {/* 显示已添加的章节 */}
          {sections.length > 0 && (
            <View style={styles.sectionList}>
              <Text style={styles.sectionID}>Added Sections:</Text>
              {sections.map((section) => (
                <View key={section.id} style={styles.sectionCard}>
                  <Text style={styles.sectionID}>{section.title}</Text>
                  <Text style={styles.sectionDescription}>{section.description}</Text>
                </View>
              ))}
            </View>
          )}

          {/* 创建课程按钮 */}
          <TouchableOpacity style={styles.createButton} onPress={createCourse}>
            <Text style={styles.buttonText}>Create Course</Text>
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
    backgroundColor: '#B3A369', // 左侧图标列的背景颜色
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingTop: 30, // 保持与 Dashboard 页面的间距一致
    flexDirection: 'column',
  },
  iconButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  bottomIcons: {
    marginTop: 'auto', // 将 Back 和 Logout 图标推到底部
  },
  container: {
    flexGrow: 1,
    padding: 10,
    paddingTop: 30,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  courseName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  pickerContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
  },
  addButton: {
    padding: 15,
    backgroundColor: '#B3A369',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  createButton: {
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
  sectionList: {
    marginBottom: 20,
  },
  sectionCard: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#B3A369',
    borderRadius: 5,
    marginBottom: 10,
  },
  sectionID: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});

export default TeacherEditScreen;
