import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../../UserContext';
import config from '../../config';

const server = config.apiUrl;

const AssignmentList = () => {
  const navigation = useNavigation();
  const [assignments, setAssignments] = useState([]);
  const [expandedAssignment, setExpandedAssignment] = useState(null); // 当前展开的 assignmentID
  const includeEvaluateGoal = true; // 测试用参数，判断是否启用 evaluate goal
  const otherGroups = [
    { id: 'group2', name: 'Research Group B' },
    { id: 'group3', name: 'Development Team C' },
  ]; // 假设数据结构，包含除了用户所在组之外的其他组

  const { courseID, semester, sectionID, username, setAssignmentID } = useContext(UserContext);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchAssignments();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchAssignments = async () => {
    try {
      const response = await fetch(`${server}/api/student/fetchAssignments/${username}/${courseID}/${semester}/${sectionID}`);
      const data = await response.json();

      if (response.ok) {
        setAssignments(data.assignments);
      } else {
        console.log('Failed to load assignments', data.message);
      }
    } catch (error) {
      console.error('An error occurred while fetching assignments:', error);
    }
  };

  // 点击 assignment 时展开或收起
  const handleAssignmentClick = (assignmentID, hasEvaluateGoal) => {
    if (expandedAssignment === assignmentID) {
      setExpandedAssignment(null); // 如果已展开则关闭
    } else if (hasEvaluateGoal) {
      setExpandedAssignment(assignmentID); // 如果有 evaluate goal 则展开
    } else {
      navigateToAssignment(assignmentID); // 否则直接导航
    }
  };

  // 跳转至 assignment 页面
  const navigateToAssignment = (assignmentID) => {
    setAssignmentID(assignmentID);
    navigation.navigate('StudentDoAssignment', { assignmentID });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.outerContainer}>
        <View style={styles.iconColumn}>
          <View>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('StudentDashboard')}
            >
              <MaterialIcons name="dashboard" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('Settings')}
            >
              <MaterialIcons name="settings" size={30} color="black" />
            </TouchableOpacity>
          </View>
          <View style={styles.bottomIcons}>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
              <MaterialIcons name="arrow-back" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => {
                Alert.alert(
                  "Confirm Logout",
                  "Are you sure you want to log out?",
                  [
                    { text: "Cancel", style: "cancel" },
                    { text: "OK", onPress: () => navigation.navigate('Login') },
                  ]
                );
              }}
            >
              <MaterialIcons name="logout" size={30} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 主要内容区域 */}
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Assignments</Text>
          {assignments.length === 0 ? (
            <Text>No assignments available.</Text>
          ) : (
            assignments.map((assignment) => (
              <View key={assignment.assignmentID}>
                <TouchableOpacity
                  style={styles.assignmentCard}
                  onPress={() => handleAssignmentClick(assignment.assignmentID, includeEvaluateGoal)}
                >
                  <Text style={styles.assignmentTitle}>{assignment.assignmentTitle}</Text>
                  <Text style={styles.assignmentDueDate}>
                    Due: {new Date(assignment.dueDateTime).toLocaleString()}
                  </Text>
                  <Text style={styles.assignmentStatus}>
                    Status: {assignment.status.replace("_", " ")}
                  </Text>
                </TouchableOpacity>

                {/* 展开时显示其他组 */}
                {expandedAssignment === assignment.assignmentID && includeEvaluateGoal && (
                  <View style={styles.groupList}>
                    {otherGroups.map((group) => (
                      <TouchableOpacity
                        key={group.id}
                        style={styles.groupButton}
                        onPress={() => navigateToAssignment(assignment.assignmentID)}
                      >
                        <Text style={styles.groupButtonText}>{group.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            ))
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('StudentSemesterGoals')}
          >
            <Text style={styles.buttonText}>My Semester Goals</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('StudentGroups')}
          >
            <Text style={styles.buttonText}>My Group</Text>
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
  iconButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'transparent',
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
  assignmentStatus: {
    fontSize: 14,
    marginTop: 5,
    color: '#666',
  },
  button: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#B3A369',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  groupList: {
    paddingLeft: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  groupButton: {
    padding: 10,
    backgroundColor: '#e6e6e6',
    borderRadius: 5,
    marginBottom: 5,
  },
  groupButtonText: {
    fontSize: 16,
    color: '#333',
  },
});

export default AssignmentList;
