import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../../UserContext';
import config from '../../config';

const server = config.apiUrl;

const StudentSetGoal = () => {
  const navigation = useNavigation();
  const [existingGoals, setExistingGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [newGoalText, setNewGoalText] = useState('');
  const { courseID, sectionID, semester, assignmentID, username } = useContext(UserContext);

  useEffect(() => {
    fetchExistingGoals();
  }, []);

  // 获取当前 section 中学生为其他 assignment 设置的 goals
  const fetchExistingGoals = async () => {
    try {
      const response = await fetch(`${server}/api/student/getGoalsForSection/${courseID}/${sectionID}/${semester}/${username}`);
      const data = await response.json();

      if (response.ok) {
        // 过滤掉空的目标和当前任务的 assignmentID
        const filteredGoals = data.goals.filter(goal => 
          goal.goalText && goal.goalText.trim() !== '' && goal.assignmentID !== assignmentID
        );
        setExistingGoals(filteredGoals);
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch existing goals.');
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
      Alert.alert('Error', 'An error occurred while fetching existing goals.');
    }
  };

  // 提交当前选择的目标或新输入的目标
  const handleSetGoal = async () => {
    const goalText = selectedGoal ? selectedGoal.goalText : newGoalText;

    if (!goalText) {
      Alert.alert('Error', 'Please enter or select a goal to set for this assignment.');
      return;
    }

    try {
      const response = await fetch(`${server}/api/student/setGoal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assignmentID,
          studentUsername: username,
          goalText,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Goal set successfully for this assignment.');
        navigation.goBack();
      } else {
        Alert.alert('Error', data.message || 'Failed to set goal.');
      }
    } catch (error) {
      console.error('Error setting goal:', error);
      Alert.alert('Error', 'An error occurred while setting the goal.');
    }
  };

  // 选择现有目标
  const handleSelectGoal = (goal) => {
    setSelectedGoal(goal);
    setNewGoalText(''); // 清空新目标文本框
  };

  // 输入新目标时，取消选择的现有目标
  const handleNewGoalChange = (text) => {
    setNewGoalText(text);
    setSelectedGoal(null); // 清空选择的现有目标
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Set Your Goal for Assignment</Text>

        <Text style={styles.subtitle}>Select a goal from other assignments</Text>
        {existingGoals.map((goal) => (
          <TouchableOpacity
            key={goal.assignmentID}
            style={[styles.goalCard, selectedGoal?.assignmentID === goal.assignmentID && styles.selectedGoal]}
            onPress={() => handleSelectGoal(goal)}
          >
            <Text style={styles.goalAssignmentTitle}>{goal.assignmentTitle}</Text>
            <Text style={styles.goalText}>{goal.goalText}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.subtitle}>Or enter a new goal</Text>
        <TextInput
          style={styles.goalInput}
          multiline
          placeholder="Enter your new goal here..."
          value={newGoalText}
          onChangeText={handleNewGoalChange} // 使用新的输入处理器
        />

        <TouchableOpacity style={styles.setGoalButton} onPress={handleSetGoal}>
          <Text style={styles.setGoalButtonText}>Set Goal</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// 样式定义
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  goalCard: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderColor: '#B3A369',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedGoal: {
    backgroundColor: '#B3A369',
  },
  goalAssignmentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  goalText: {
    fontSize: 16,
    color: '#333',
  },
  goalInput: {
    padding: 15,
    borderColor: '#B3A369',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  setGoalButton: {
    padding: 15,
    backgroundColor: '#6ca06c',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  setGoalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default StudentSetGoal;
