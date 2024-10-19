import React, { useState, useContext, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // 引入 Picker 组件
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../../UserContext'; // 引入 UserContext
import config from '../../config';

const server = config.apiUrl;

const EditAssignmentQuestion = () => {
  const navigation = useNavigation(); // 使用 navigation 来控制页面跳转
  const [questions, setQuestions] = useState([]); // 存储所有题目
  const [questionText, setQuestionText] = useState(''); // 当前题目的文本
  const [questionType, setQuestionType] = useState('multiple_choice'); // 当前题目的类型
  const [options, setOptions] = useState(['', '', '', '']); // 存储选择题的选项
  const [ratingRange, setRatingRange] = useState([1, 5]); // 打分题的范围
  const { assignmentID } = useContext(UserContext); // 从 context 中获取 assignmentID

  // Fetch questions from the server when the component loads
  useEffect(() => {
    fetchQuestions();
  }, []);

  // Fetch questions from the server
  const fetchQuestions = async () => {
    try {
      const response = await fetch(`${server}/api/assignment/fetchQuestions/${assignmentID}`);
      const data = await response.json();

      if (response.ok) {
        setQuestions(data.questions); // 将获取到的问题设置到 state 中
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch questions');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while fetching questions.');
    }
  };

  // 添加题目并将其发送到服务器
  const handleAddQuestion = async () => {
    if (!questionText) {
      Alert.alert('Error', 'Please enter the question text.');
      return;
    }

    const newQuestion = {
      questionText: questionText,
      questionType: questionType,
      questionOptions: questionType === 'multiple_choice' ? [...options] : null,
      ratingRange: questionType === 'rating' ? ratingRange : null,
    };

    // 构造要发送给 API 的 payload
    const payload = {
      assignmentID,
      questionText: newQuestion.questionText,
      questionType: newQuestion.questionType,
      questionOptions: newQuestion.questionType === 'multiple_choice' ? newQuestion.questionOptions : null,
      ratingRange: newQuestion.questionType === 'rating' ? newQuestion.ratingRange : null,
    };

    try {
      const response = await fetch(`${server}/api/assignment/addQuestion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert('Error', data.message || 'Failed to add question');
        return;
      }

      // 添加问题到列表并重置输入框
      setQuestions([...questions, newQuestion]);
      setQuestionText(''); // 清空输入框
      setOptions(['', '', '', '']); // 重置选项
      Alert.alert('Success', 'Question added successfully!');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while adding the question.');
    }
  };

  // 更新选择题的选项
  const handleOptionChange = (index, text) => {
    const newOptions = [...options];
    newOptions[index] = text;
    setOptions(newOptions);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Edit Assignment Questions</Text>

        {/* 问题文本输入 */}
        <TextInput
          style={styles.input}
          placeholder="Enter question text"
          value={questionText}
          onChangeText={setQuestionText}
        />

        {/* 选择题目类型 */}
        <Text style={styles.sectionTitle}>Select Question Type</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={questionType}
            style={styles.picker}
            onValueChange={(itemValue) => setQuestionType(itemValue)}
          >
            <Picker.Item label="Multiple Choice" value="multiple_choice" />
            <Picker.Item label="Rating" value="rating" />
            <Picker.Item label="Free Response" value="free_response" />
          </Picker>
        </View>
        {/* <View style={styles.dropdownContainer}>
        </View> */}

        {/* 如果是选择题，显示选项输入框 */}
        {questionType === 'multiple_choice' && (
          <>
            <Text style={styles.sectionTitle}>Enter Options</Text>
            {options.map((option, index) => (
              <TextInput
                key={index}
                style={styles.input}
                placeholder={`Option ${index + 1}`}
                value={option}
                onChangeText={(text) => handleOptionChange(index, text)}
              />
            ))}
          </>
        )}

        {/* 如果是打分题，显示打分范围 */}
        {questionType === 'rating' && (
          <>
            <Text style={styles.sectionTitle}>Rating Range: {ratingRange[0]} to {ratingRange[1]}</Text>
          </>
        )}

        {/* Free Response 不需要额外的输入框，仅显示文本框 */}
        {questionType === 'free_response' && (
          <Text style={styles.sectionTitle}>This is a free response question.</Text>
        )}

        {/* 添加问题按钮 */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddQuestion}>
          <Text style={styles.addButtonText}>Add Question</Text>
        </TouchableOpacity>

        {/* 显示添加的题目 */}
        <Text style={styles.sectionTitle}>Questions Added</Text>
        {questions.length === 0 ? (
          <Text>No questions added yet.</Text>
        ) : (
          questions.map((question, index) => (
            <View key={index} style={styles.questionCard}>
              <Text style={styles.questionText}>{index + 1}. {question.questionText}</Text>
              {question.questionType === 'multiple_choice' && (
                <Text>Options: {question.questionOptions.join(', ')}</Text>
              )}
            </View>
          ))
        )}

        {/* 保存作业按钮 */}
        <TouchableOpacity style={styles.saveButton} onPress={() => navigation.goBack()}>
          <Text style={styles.saveButtonText}>Save Assignment</Text>
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
  input: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderColor: '#B3A369',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  dropdownContainer: {
    marginBottom: 20,
  },
  pickerContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#B3A369',
    borderRadius: 5,
    overflow: 'hidden'
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  addButton: {
    padding: 15,
    backgroundColor: '#FFCC00', // 添加问题按钮的颜色
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  questionCard: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderColor: '#B3A369',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    padding: 15,
    backgroundColor: '#B3A369',
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditAssignmentQuestion;
