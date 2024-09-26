import React, { useState } from 'react';
import { SafeAreaView, StatusBar, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons'; // 使用 MaterialIcons 图标

const TeacherDashboard = () => {
  const navigation = useNavigation();

  // 当前课程列表 (示例数据，实际通过 API 获取)
  const [currentCourses] = useState([
    { id: 1, title: 'Math 101', description: 'Introduction to Algebra' },
    { id: 2, title: 'Physics 201', description: 'Basic Mechanics' },
  ]);

  // 之前课程列表 (示例数据，实际通过 API 获取)
  const [previousCourses] = useState([
    { id: 3, title: 'History 101', description: 'World History Overview' },
    { id: 4, title: 'Chemistry 101', description: 'Introduction to Chemistry' },
  ]);

  // 点击后跳转到课程详情页面，传递课程 ID 和课程标题作为参数
  const handleCourseClick = (id, title) => {
    navigation.navigate('CourseSections', { courseId: id, courseTitle: title }); // 传递 courseId 和 courseTitle
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" hidden={true} />

      <View style={styles.outerContainer}>
        {/* 左边的图标列 */}
        <View style={styles.iconColumn}>
          <View>
            {/* Dashboard 图标 (无缝衔接右边内容) */}
            <TouchableOpacity
              style={[styles.iconButton, styles.activeIconButton]} // 这里设置无缝衔接的背景色
              disabled={true} // 在 Dashboard 页面禁用 Dashboard 图标
            >
              <MaterialIcons name="dashboard" size={30} color="gray" />
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
              disabled={true} // 在 Dashboard 页面禁用 Back 图标
            >
              <MaterialIcons name="arrow-back" size={30} color="gray" />
            </TouchableOpacity>

            {/* Logout 图标 */}
            <TouchableOpacity style={styles.iconButton} onPress={() => { /* 登出逻辑 */ }}>
              <MaterialIcons name="logout" size={30} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 主要内容区域 */}
        <ScrollView contentContainerStyle={styles.container}>
          {/* 显示当前课程部分 */}
          <Text style={styles.sectionTitle}>Current Courses</Text>
          <View style={styles.courseContainer}>
            {currentCourses.map((course) => (
              <TouchableOpacity
                key={course.id}
                style={styles.courseCard}
                onPress={() => handleCourseClick(course.id, course.title)} // 点击时传递课程 ID 和标题
              >
                <Text style={styles.courseTitle}>{course.title}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* 显示之前课程部分 */}
          <Text style={styles.sectionTitle}>Previous Courses</Text>
          <View style={styles.courseContainer}>
            {previousCourses.map((course) => (
              <TouchableOpacity
                key={course.id}
                style={styles.courseCard}
                onPress={() => handleCourseClick(course.id, course.title)} // 点击时传递课程 ID 和标题
              >
                <Text style={styles.courseTitle}>{course.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* "Add Courses" 按钮 */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('TeacherEdit')}  // 跳转到课程创建页面 
          >
            <Text style={styles.addButtonText}>Add Courses</Text>
          </TouchableOpacity>
          {/* 添加导航到TeacherRosterEdit页面的按钮 */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('TeacherRoster')}
          >
            <Text style={styles.addButtonText}>Student Roster</Text>
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
    paddingTop: 30,
    flexDirection: 'column',
  },
  iconButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'transparent', // 默认透明背景
  },
  activeIconButton: {
    backgroundColor: '#f9f9f9', // Dashboard 图标无缝衔接右侧区域的背景色
    borderTopLeftRadius: 8, // 保持左侧的圆角
    borderBottomLeftRadius: 8, // 保持左侧的圆角
    borderTopRightRadius: 0, // 右上角改为直角
    borderBottomRightRadius: 0, // 右下角改为直角
    width: '100%', // 确保图标占据整个列宽，实现无缝连接
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  courseCard: {
    padding: 20,
    borderWidth: 1,
    borderColor: '#B3A369',
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#f9f9f9', // 与左侧保持一致
    width: '45%',
    marginHorizontal: '2.5%',
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  courseContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
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

export default TeacherDashboard;