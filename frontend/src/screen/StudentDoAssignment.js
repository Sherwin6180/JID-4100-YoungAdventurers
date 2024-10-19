import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AssignmentDetail = () => {
  const navigation = useNavigation();
  const [answers, setAnswers] = useState({}); // 存储学生的答案

  // 渲染选择题
  const renderMultipleChoiceQuestion = () => (
    <View style={styles.questionContainer}>
      <Text style={styles.questionText}>1+1=2?</Text>
      {['1', '2', '3', '4'].map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.optionButton,
            answers === option && styles.selectedOption,
          ]}
          onPress={() => setAnswers(option)}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* 在页面顶部显示 assignmentTitle */}
        <Text style={styles.title}>Test Assignment</Text>

        {/* 硬编码的 Last Modified 时间 */}
        <Text style={styles.lastModified}>
          Last modified: 2024-10-18 21:00:00
        </Text>

        {/* 动态渲染所有问题 */}
        {renderMultipleChoiceQuestion()}

        {/* 保存并退出按钮 */}
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save and Exit</Text>
        </TouchableOpacity>

        {/* 提交并退出按钮 */}
        <TouchableOpacity style={styles.submitButton}>
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
  lastModified: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20, // 添加 margin 以保持排版一致
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