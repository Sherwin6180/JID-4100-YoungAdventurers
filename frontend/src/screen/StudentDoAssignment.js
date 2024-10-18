import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../../UserContext'; // 引入 UserContext
import config from '../../config';

const server = config.apiUrl;

const AssignmentDetail = () => {
  const navigation = useNavigation();
  const [assignment, setAssignment] = useState(null); // 作业数据
  const [answers, setAnswers] = useState({}); // 存储学生的答案
  const { assignmentID, username } = useContext(UserContext); // 从 context 中获取 assignmentID 和 username

  // 使用 useEffect 获取作业题目
  useEffect(() => {
    fetchAssignment(); // 获取作业题目和现有的回答
  }, []);

  // 获取作业数据和学生的现有答案
  const fetchAssignment = async () => {
    try {
      const response = await fetch(`${server}/api/student/getStudentAnswers/${assignmentID}/${username}`);
      const data = await response.json();

      if (response.ok) {
        if (data.questions && data.questions.length > 0) {
          setAssignment(data); // 设置作业数据为返回的整个对象
          const initialAnswers = data.questions.reduce((acc, question) => {
            acc[question.questionID] = question.studentAnswer || ''; // 初始化每个问题的答案
            return acc;
          }, {});
          setAnswers(initialAnswers); // 设置现有的学生答案
        }
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch assignment.');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error fetching assignment:', error);
      Alert.alert('Error', 'An error occurred while fetching the assignment.');
    }
  };

  // 处理选择题答案
  const handleMultipleChoiceAnswer = (questionID, answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionID]: answer,
    }));
  };

  // 处理打分题答案
  const handleRatingAnswer = (questionID, rating) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionID]: rating,
    }));
  };

  // 处理自由回答答案
  const handleFreeResponseAnswer = (questionID, text) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionID]: text,
    }));
  };

  // 渲染选择题
  const renderMultipleChoiceQuestion = (question) => (
    <View key={question.questionID} style={styles.questionContainer}>
      <Text style={styles.questionText}>{question.questionText}</Text>
      {question.questionOptions.map((option, index) => (
        <TouchableOpacity
          key={`${question.questionID}-${index}`} // 确保 key 是唯一的
          style={[styles.optionButton, answers[question.questionID] === option && styles.selectedOption]}
          onPress={() => handleMultipleChoiceAnswer(question.questionID, option)}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // 渲染打分题
  const renderRatingQuestion = (question) => (
    <View key={question.questionID} style={styles.questionContainer}>
      <Text style={styles.questionText}>{question.questionText}</Text>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((score) => (
          <TouchableOpacity
            key={`${question.questionID}-${score}`} // 确保 key 是唯一的
            style={[styles.ratingButton, answers[question.questionID] === score && styles.selectedRating]}
            onPress={() => handleRatingAnswer(question.questionID, score)}
          >
            <Text style={styles.ratingText}>{score}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  // 渲染自由回答题
  const renderFreeResponseQuestion = (question) => (
    <View key={question.questionID} style={styles.questionContainer}>
      <Text style={styles.questionText}>{question.questionText}</Text>
      <TextInput
        style={styles.freeResponseInput}
        multiline
        value={answers[question.questionID] || ''}
        onChangeText={(text) => handleFreeResponseAnswer(question.questionID, text)}
      />
    </View>
  );

  // 保存答案
  const handleSaveAndExit = async () => {
    try {
      const response = await fetch(`${server}/api/student/saveStudentAnswers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assignmentID,
          studentUsername: username,
          answers,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Answers saved successfully.');
        navigation.goBack(); // 返回上一个页面
      } else {
        Alert.alert('Error', data.message || 'Failed to save answers.');
      }
    } catch (error) {
      console.error('Error saving answers:', error);
      Alert.alert('Error', 'An error occurred while saving the answers.');
    }
  };

  // 提交答案并返回
  const handleSubmitAndExit = async () => {
    try {
      const response = await fetch(`${server}/api/student/submitStudentAnswers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assignmentID,
          studentUsername: username,
          answers,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Assignment submitted successfully.');
        navigation.goBack(); // 返回上一个页面
      } else {
        Alert.alert('Error', data.message || 'Failed to submit assignment.');
      }
    } catch (error) {
      console.error('Error submitting assignment:', error);
      Alert.alert('Error', 'An error occurred while submitting the assignment.');
    }
  };


  if (!assignment) {
    return <Text></Text>; // 显示加载状态
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* 在页面顶部显示 assignmentTitle */}
        <Text style={styles.title}>{assignment.assignmentTitle}</Text> 

        {/* 动态渲染所有问题 */}
        {assignment.questions.map((question) => {
          if (question.questionType === 'multiple_choice') {
            return renderMultipleChoiceQuestion(question);
          } else if (question.questionType === 'rating') {
            return renderRatingQuestion(question);
          } else if (question.questionType === 'free_response') {
            return renderFreeResponseQuestion(question);
          }
          return null;
        })}

        {/* 保存并退出按钮 */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveAndExit}>
          <Text style={styles.saveButtonText}>Save and Exit</Text>
        </TouchableOpacity>

        {/* 提交并退出按钮 */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmitAndExit}>
          <Text style={styles.submitButtonText}>Submit and Exit</Text>
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
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  optionButton: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderColor: '#B3A369',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: '#B3A369',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  ratingContainer: {
    marginHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ratingButton: {
    padding: 10,
    borderColor: '#B3A369',
    borderWidth: 1,
    borderRadius: 5,
    width: 50,
    alignItems: 'center',
    marginRight: 5,
  },
  selectedRating: {
    backgroundColor: '#B3A369',
  },
  ratingText: {
    fontSize: 16,
  },
  freeResponseInput: {
    padding: 10,
    borderColor: '#B3A369',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  saveButton: {
    padding: 15,
    backgroundColor: '#FFCC00',  // 保存按钮颜色
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    padding: 15,
    backgroundColor: '#B3A369',
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AssignmentDetail;
