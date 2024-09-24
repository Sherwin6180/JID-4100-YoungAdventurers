import React, { useState } from 'react';
import { SafeAreaView, StatusBar, View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons'; // 使用 MaterialIcons 图标

const TeacherEditScreen = () => {
  const navigation = useNavigation();

  // 状态管理
  const [courseTitle, setCourseTitle] = useState('');  // 课程标题
  const [sections, setSections] = useState([]);  // 章节列表
  const [sectionTitle, setSectionTitle] = useState('');  // 当前章节标题
  const [sectionDescription, setSectionDescription] = useState('');  // 当前章节描述

  // 添加章节
  const addSection = () => {
    if (sectionTitle.trim() === '' || sectionDescription.trim() === '') {
      Alert.alert('Error', 'Please fill out both section title and description.');
      return;
    }

    const newSection = {
      id: sections.length + 1,  // 简单的 ID 生成
      title: sectionTitle,
      description: sectionDescription,
    };
    setSections([...sections, newSection]);
    setSectionTitle('');  // 清空输入框
    setSectionDescription('');
  };

  // 创建课程
  const createCourse = () => {
    if (courseTitle.trim() === '' || sections.length === 0) {
      Alert.alert('Error', 'Please provide a course title and at least one section.');
      return;
    }
    Alert.alert('Success', 'Course created successfully!');
    navigation.goBack();
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
            placeholder="Course Title"
            value={courseTitle}
            onChangeText={setCourseTitle}
          />

          {/* 添加章节部分 */}
          <Text style={styles.subTitle}>Add Sections</Text>
          <TextInput
            style={styles.input}
            placeholder="Section Title"
            value={sectionTitle}
            onChangeText={setSectionTitle}
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
              <Text style={styles.sectionTitle}>Added Sections:</Text>
              {sections.map((section) => (
                <View key={section.id} style={styles.sectionCard}>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
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
  sectionTitle: {
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