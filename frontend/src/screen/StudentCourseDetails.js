import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const AssignmentList = () => {
  const navigation = useNavigation();
  const [assignments, setAssignments] = useState([]); // 用于存储作业列表

  // 使用 useEffect 在组件加载时加载作业列表
  useEffect(() => {
    loadMockAssignments(); // 使用模拟数据
  }, []);

  // 使用模拟数据
  const loadMockAssignments = () => {
    const mockData = [
      { assignmentID: 'A101', title: 'Assignment 1: Intro to React', dueDate: '2024-10-15' },
      { assignmentID: 'A102', title: 'Assignment 2: State and Props', dueDate: '2024-10-22' },
      { assignmentID: 'A103', title: 'Assignment 3: Hooks', dueDate: '2024-10-29' },
    ];
    setAssignments(mockData); // 将模拟数据加载到 state 中
  };

  // 点击作业时显示一个 Alert
  const handleAssignmentClick = (assignmentID) => {
    navigation.navigate('StudentDoAssignment'); // 不传递参数
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
                <Text style={styles.assignmentTitle}>{assignment.title}</Text>
                <Text style={styles.assignmentDueDate}>Due: {assignment.dueDate}</Text>
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
