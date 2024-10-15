import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // 引入 useNavigation

const EditAssignmentQuestion = () => {
  const navigation = useNavigation(); // 使用 navigation 来控制页面跳转
  const [assignmentTitle, setAssignmentTitle] = useState(''); // 作业标题
  const [questions, setQuestions] = useState([]); // 存储所有题目
  const [questionText, setQuestionText] = useState(''); // 当前题目的文本
  const [questionType, setQuestionType] = useState('multiple_choice'); // 当前题目的类型
  const [options, setOptions] = useState(['', '', '', '']); // 存储选择题的选项
  const [ratingRange, setRatingRange] = useState([0, 5]); // 打分题的范围

  // 添加题目到问题列表中
  const handleAddQuestion = () => {
    if (!questionText) {
      Alert.alert('Error', 'Please enter the question text.');
      return;
    }

    const newQuestion = {
      questionID: `Q${questions.length + 1}`,
      questionText: questionText,
      type: questionType,
    };

    if (questionType === 'multiple_choice') {
      newQuestion.options = [...options];
    } else if (questionType === 'rating') {
      newQuestion.range = ratingRange;
    }

    setQuestions([...questions, newQuestion]); // 将新问题添加到问题列表
    setQuestionText(''); // 清空当前输入
    setOptions(['', '', '', '']); // 重置选项
  };

  // 保存整个作业并返回
  const handleSaveAssignment = () => {
    const assignment = {
      title: assignmentTitle,
      questions: questions,
    };

    console.log('Assignment saved:', assignment);
    Alert.alert('Success', 'Assignment saved successfully!');

    // 保存成功后返回上一页
    navigation.goBack();
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

        {/* 作业标题 */}
        <TextInput
          style={styles.input}
          placeholder="Enter assignment title"
          value={assignmentTitle}
          onChangeText={setAssignmentTitle}
        />

        {/* 问题文本输入 */}
        <TextInput
          style={styles.input}
          placeholder="Enter question text"
          value={questionText}
          onChangeText={setQuestionText}
        />

        {/* 选择题目类型 */}
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[styles.typeButton, questionType === 'multiple_choice' && styles.selectedTypeButton]}
            onPress={() => setQuestionType('multiple_choice')}
          >
            <Text style={styles.typeButtonText}>Multiple Choice</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, questionType === 'rating' && styles.selectedTypeButton]}
            onPress={() => setQuestionType('rating')}
          >
            <Text style={styles.typeButtonText}>Rating</Text>
          </TouchableOpacity>
        </View>

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
              {question.type === 'multiple_choice' && (
                <Text>Options: {question.options.join(', ')}</Text>
              )}
              {question.type === 'rating' && (
                <Text>Rating Range: {question.range[0]} to {question.range[1]}</Text>
              )}
            </View>
          ))
        )}

        {/* 保存作业按钮 */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveAssignment}>
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
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderColor: '#B3A369',
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  selectedTypeButton: {
    backgroundColor: '#B3A369',
  },
  typeButtonText: {
    fontSize: 16,
    color: '#333',
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
