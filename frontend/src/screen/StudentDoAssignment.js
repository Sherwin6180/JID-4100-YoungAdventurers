import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AssignmentDetail = () => {
  const navigation = useNavigation();  // 用于页面导航
  const [assignment, setAssignment] = useState(null);  // 作业数据
  const [answers, setAnswers] = useState({});  // 存储学生的答案

  // 模拟从数据库获取作业数据的过程
  useEffect(() => {
    fetchAssignment(); // 模拟获取作业
  }, []);

  // 模拟数据库调用获取作业数据
  const fetchAssignment = () => {
    // 假设从数据库获取的数据结构
    const fetchedAssignment = {
      assignmentID: 'A101',
      title: 'Assignment 1: React Basics',
      questions: [
        {
          questionID: 'Q1',
          questionText: 'What is the main purpose of React?',
          type: 'multiple_choice',
          options: ['State Management', 'Data Fetching', 'UI Building', 'Routing'],
        },
        {
          questionID: 'Q2',
          questionText: 'How would you rate your understanding of React components?',
          type: 'rating',
        },
        {
          questionID: 'Q3',
          questionText: 'Which of the following is a hook in React?',
          type: 'multiple_choice',
          options: ['useState', 'useEffect', 'useFetch', 'useRouter'],
        },
        {
          questionID: 'Q4',
          questionText: 'How confident are you in handling state in React?',
          type: 'rating',
        },
      ],
    };

    setAssignment(fetchedAssignment); // 设置模拟的作业数据
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

  // 渲染选择题
  const renderMultipleChoiceQuestion = (question) => (
    <View key={question.questionID} style={styles.questionContainer}>
      <Text style={styles.questionText}>{question.questionText}</Text>
      {question.options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.optionButton,
            answers[question.questionID] === option && styles.selectedOption,
          ]}
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
        {[0, 1, 2, 3, 4, 5].map((score) => (
          <TouchableOpacity
            key={score}
            style={[
              styles.ratingButton,
              answers[question.questionID] === score && styles.selectedRating,
            ]}
            onPress={() => handleRatingAnswer(question.questionID, score)}
          >
            <Text style={styles.ratingText}>{score}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  // 保存答案并返回
  const handleSaveAndExit = () => {
    console.log('Saved Answers:', answers);
    // 这里可以将保存的答案存入数据库或本地存储
    navigation.goBack(); // 返回上一个页面
  };

  // 提交答案并返回
  const handleSubmitAndExit = () => {
    console.log('Submitted Answers:', answers);
    // 在这里可以将答案发送到服务器，或进一步处理
    navigation.goBack(); // 返回上一个页面
  };

  if (!assignment) {
    return <Text>Loading assignment...</Text>;  // 如果没有作业数据，显示加载状态
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>{assignment.title}</Text>
        
        {/* 动态渲染所有问题 */}
        {assignment.questions.map((question) => {
          if (question.type === 'multiple_choice') {
            return renderMultipleChoiceQuestion(question);
          } else if (question.type === 'rating') {
            return renderRatingQuestion(question);
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
