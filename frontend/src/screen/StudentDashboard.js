import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, StatusBar, View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons'; // 使用 MaterialIcons 图标
import config from '../../config';
import { UserContext } from '../../UserContext';

// const server = config.apiUrl; // 注释掉 API URL

const StudentDashboard = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  // const { username } = useContext(UserContext); // 注释掉从 context 获取 username
  // const { setCourseID, setSemester } = useContext(UserContext); // 注释掉 setCourseID 和 setSemester

  // 当前课程列表和之前课程列表的状态
  // const [currentCourses, setCurrentCourses] = useState([]);
  // const [previousCourses, setPreviousCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // 将加载状态设置为 false

  useEffect(() => {
    if (isFocused) {
      // 这里我们注释掉 fetchCourses 函数的调用
      // fetchCourses(); // 每次页面聚焦时获取最新课程数据
    }
  }, [isFocused]); // 依赖 isFocused

  // 暂时注释掉这个函数
  // const fetchCourses = async () => {
  //   setIsLoading(true); // 开始加载
  //   try {
  //     const response = await fetch(`${server}/api/student/getCoursesByStudent/${username}`);
  //     const data = await response.json();

  //     if (response.ok) {
  //       const current = data.courses.filter(course => course.courseType === 'current');
  //       const previous = data.courses.filter(course => course.courseType === 'previous');
  //       setCurrentCourses(current);
  //       setPreviousCourses(previous);
  //     } else {
  //       Alert.alert('Error', data.message || 'Failed to fetch courses');
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     Alert.alert('Error', 'An error occurred while fetching courses.');
  //   } finally {
  //     setIsLoading(false); // 加载结束
  //   }
  // };

  // 使用模拟数据代替数据库数据
  const currentCourses = [
    { courseID: '001', courseTitle: 'Math 101', semester: 'Fall 2024' },
    { courseID: '002', courseTitle: 'History 202', semester: 'Fall 2024' },
  ];

  const previousCourses = [
    { courseID: '003', courseTitle: 'Science 101', semester: 'Spring 2024' },
    { courseID: '004', courseTitle: 'Art 101', semester: 'Spring 2024' },
  ];

  // 点击后跳转到课程详情页面，暂时不传递参数
  const handleCourseClick = () => {
    // 注释掉参数传递部分，只进行页面跳转
    // setCourseID(id);
    // setSemester(semester);
    navigation.navigate('StudentCourseDetails'); // 不传递参数
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
          {isLoading ? (
            <Text>Loading courses...</Text>
          ) : (
            <>
              {/* 显示当前课程部分 */}
              <Text style={styles.sectionTitle}>Current Courses</Text>
              {currentCourses.length === 0 ? (
                <Text>No current courses available.</Text>
              ) : (
                <View style={styles.courseContainer}>
                  {currentCourses.map((course) => (
                    <TouchableOpacity
                      key={course.courseID}
                      style={styles.courseCard}
                      onPress={() => handleCourseClick()} // 点击时跳转，但不传递参数
                    >
                      <Text style={styles.courseTitle}>{course.courseTitle}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* 显示之前课程部分 */}
              <Text style={styles.sectionTitle}>Previous Courses</Text>
              {previousCourses.length === 0 ? (
                <Text>No previous courses available.</Text>
              ) : (
                <View style={styles.courseContainer}>
                  {previousCourses.map((course) => (
                    <TouchableOpacity
                      key={course.courseID}
                      style={styles.courseCard}
                      onPress={() => handleCourseClick()} // 点击时跳转，但不传递参数
                    >
                      <Text style={styles.courseTitle}>{course.courseTitle}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </>
          )}
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
});

export default StudentDashboard;