import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../../UserContext'; // 从 UserContext 获取信息
import config from '../../config'; // 假设后端 API 的 URL 配置在 config.js 中

const server = config.apiUrl; // 服务器地址

const AssignmentList = () => {
  const navigation = useNavigation();
  const [assignments, setAssignments] = useState([]); // 用于存储作业列表

  const { courseID, semester, sectionID } = useContext(UserContext); // 从 UserContext 中读取 courseID, semester, sectionID
  const { setAssignmentID } = useContext(UserContext);

  // 使用 useEffect 在组件加载时加载作业列表
  useEffect(() => {
    fetchAssignments(); // 获取作业列表
  }, []);

  // 从后端 API 获取作业列表
  const fetchAssignments = async () => {
    try {
      const response = await fetch(`${server}/api/assignment/fetchAssignments/${courseID}/${semester}/${sectionID}`); // 根据课程信息获取作业列表
      const data = await response.json();

      if (response.ok) {
        setAssignments(data.assignments); // 设置获取到的作业数据
      } else {
        console.log('Failed to load assignments', data.message);
      }
    } catch (error) {
      console.error('An error occurred while fetching assignments:', error);
    }
  };

  // 点击作业时跳转到作业页面
  const handleAssignmentClick = (assignmentID) => {
    setAssignmentID(assignmentID);
    navigation.navigate('StudentDoAssignment', { assignmentID }); // 传递 assignmentID
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
              onPress={() => navigation.navigate('StudentDashboard')}
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
        <View style={styles.content}>
          <Text style={styles.title}>Assignments</Text>
          {assignments.length === 0 ? (
            <Text>No assignments available.</Text>
          ) : (
            assignments.map((assignment) => (
              <TouchableOpacity
                key={assignment.assignmentID}
                style={styles.assignmentCard}
                onPress={() => handleAssignmentClick(assignment.assignmentID)}
              >
                <Text style={styles.assignmentTitle}>{assignment.assignmentTitle}</Text>
                <Text style={styles.assignmentDueDate}>Due: {new Date(assignment.dueDateTime).toLocaleString()}</Text>
              </TouchableOpacity>
            ))
          )}
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
  iconButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'transparent', // 默认透明背景
  },
  bottomIcons: {
    marginTop: 'auto', // 将 Back 和 Logout 图标推到底部
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
  assignmentCard: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderColor: '#B3A369',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  assignmentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  assignmentDueDate: {
    fontSize: 14,
    color: '#666',
  },
});

export default AssignmentList;
