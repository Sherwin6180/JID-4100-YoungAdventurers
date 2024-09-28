import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../../UserContext';
import config from '../../config';

const server = config.apiUrl;

const SectionDetail = () => {
  const navigation = useNavigation();
  const { courseID, semester, sectionID } = useContext(UserContext);  // 从 UserContext 获取 courseID, semester, sectionID
  const [courseDescription, setCourseDescription] = useState('');
  const [sectionDescription, setSectionDescription] = useState('');

  // 使用 useEffect 在组件加载时获取课程和章节描述
  useEffect(() => {
    fetchSectionDetails();
  }, []);

  // 通过 API 获取课程和章节描述
  const fetchSectionDetails = async () => {
    try {
      const response = await fetch(`${server}/api/class/getSectionDetails/${courseID}/${semester}/${sectionID}`);
      const data = await response.json();

      if (response.ok) {
        setCourseDescription(data.courseDescription);
        setSectionDescription(data.sectionDescription);
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch section details');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while fetching section details.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>  
      <View style={styles.container}>
        {/* 左侧任务栏 */}
        <View style={styles.sidebar}>
          <View style={styles.iconContainer}>
            {/* 图标 1: 返回到课程章节 */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons name="arrow-back" size={30} color="black" />
            </TouchableOpacity>

            {/* 图标 2: 返回到教师仪表板 */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('TeacherDashboard')}
            >
              <MaterialIcons name="dashboard" size={30} color="black" />
            </TouchableOpacity>

            {/* 图标 3: 人员管理 */}
            {/* <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('TeacherRoster', { courseID, sectionID })}  // 点击跳转到 TeacherRoster 页面，并传递参数
            >
              <MaterialIcons name="person" size={30} color="black" />
            </TouchableOpacity> */}
          </View>
        </View>

        {/* 章节详情内容 */}
        <View style={styles.content}>
          <Text style={styles.title}>Course ID: {courseID}</Text>
          <Text style={styles.subtitle}>Section ID: {sectionID}</Text>
          <Text style={styles.subtitle}>Semester: {semester}</Text>

          <Text style={styles.sectionHeader}>Course Description</Text>
          <Text style={styles.description}>{courseDescription}</Text>

          <Text style={styles.sectionHeader}>Section Description</Text>
          <Text style={styles.description}>{sectionDescription}</Text>

          {/* 添加导航到TeacherRosterEdit页面的按钮 */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('TeacherRoster')}
          >
            <Text style={styles.addButtonText}>Student Roster</Text>
          </TouchableOpacity>
        </View>
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
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 60,
    backgroundColor: '#B3A369',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 10,
  },
  iconContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  iconButton: {
    paddingVertical: 15,
    alignItems: 'center',
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
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
  },
  addButton: {
    padding: 15,
    backgroundColor: '#B3A369',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SectionDetail;
