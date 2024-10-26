import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../../UserContext';

const AssignmentDetail = () => {
  const navigation = useNavigation();
  const [assignment, setAssignment] = useState(null); // 作业数据
  const [answers, setAnswers] = useState({}); // 存储学生的答案
  const [status, setStatus] = useState('in_progress'); // 存储作业状态
  const [lastSaved, setLastSaved] = useState(''); // 存储最后保存时间
  const { assignmentID, username } = useContext(UserContext); // 从 context 中获取 assignmentID 和 username

  // 模拟组成员数据和学生评分数据结构
  const [groupMembers, setGroupMembers] = useState([
    { username: 'member1', firstName: 'Alice', lastName: 'Johnson', goal: 'Complete project design' },
    { username: 'member2', firstName: 'Bob', lastName: 'Brown', goal: 'Implement core features' },
    { username: 'member3', firstName: 'Carol', lastName: 'Davis', goal: 'Test and debug' }
  ]);
  const [memberRatings, setMemberRatings] = useState({}); // 存储对每个成员的评分

  useEffect(() => {
    fetchAssignment();
  }, []);

  // 获取作业数据
  const fetchAssignment = async () => {
    const simulatedAssignment = {
      assignmentID,
      assignmentTitle: "Group Project Evaluation",
      status: "in_progress",
      lastSavedAt: Date.now(),
      questions: [
        {
          questionID: "q1",
          questionText: "How well was the project structured?",
          questionType: "rating",
        },
        {
          questionID: "q2",
          questionText: "Did the team communicate effectively?",
          questionType: "multiple_choice",
          questionOptions: ["Yes", "No"]
        },
        {
          questionID: "q3",
          questionText: "Describe any challenges faced by the team.",
          questionType: "free_response",
        }
      ],
      includeEvaluateGoal: true,  // 是否启用evaluate goal
      evaluateStage: 1            // 当前目标阶段
    };
    setAssignment(simulatedAssignment);
    setStatus(simulatedAssignment.status);
    setLastSaved(new Date(simulatedAssignment.lastSavedAt).toLocaleString());
  };

  // 处理保存操作
  const handleSaveAndExit = () => {
    setLastSaved(new Date().toLocaleString());
    Alert.alert("Saved", "Your answers have been saved.");
    navigation.goBack();
  };

  // 处理提交操作
  const handleSubmitAndExit = () => {
    // 检查所有问题是否都有答案
    const allQuestionsAnswered = assignment.questions.every((question) => {
      const answer = answers[question.questionID];
      return question.questionType !== "free_response" ? answer : answer?.trim() !== '';
    });
    
    if (!allQuestionsAnswered) {
      Alert.alert("Incomplete", "Please answer all questions before submitting.");
      return;
    }

    setStatus('submitted');
    Alert.alert("Submitted", "Your assignment has been submitted.");
    navigation.goBack();
  };

  // 处理组成员目标的评分
  const handleMemberRating = (username, rating) => {
    if (status === 'submitted') return;
    setMemberRatings((prevRatings) => ({
      ...prevRatings,
      [username]: rating,
    }));
  };

  // 处理打分题答案
  const handleRatingAnswer = (questionID, rating) => {
    if (status === 'submitted') return;
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionID]: rating,
    }));
  };

  // 处理选择题答案
  const handleMultipleChoiceAnswer = (questionID, answer) => {
    if (status === 'submitted') return;
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionID]: answer,
    }));
  };

  // 处理自由回答答案
  const handleFreeResponseAnswer = (questionID, text) => {
    if (status === 'submitted') return;
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionID]: text,
    }));
  };

  // 渲染组成员目标评价
  const renderGroupGoals = () => (
    <View style={styles.groupContainer}>
      <Text style={styles.sectionTitle}>Evaluate Group Goals (Stage {assignment.evaluateStage})</Text>
      {groupMembers.map((member) => (
        <View key={member.username} style={styles.memberContainer}>
          <Text style={styles.memberName}>
            {member.firstName} {member.lastName} - Goal: {member.goal}
          </Text>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((score) => (
              <TouchableOpacity
                key={`${member.username}-${score}`}
                style={[
                  styles.ratingButton,
                  memberRatings[member.username] === score && styles.selectedRating
                ]}
                onPress={() => handleMemberRating(member.username, score)}
                disabled={status === 'submitted'}
              >
                <Text style={styles.ratingText}>{score}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
    </View>
  );

  // 渲染选择题
  const renderMultipleChoiceQuestion = (question) => (
    <View key={question.questionID} style={styles.questionContainer}>
      <Text style={styles.questionText}>{question.questionText}</Text>
      {question.questionOptions.map((option, index) => (
        <TouchableOpacity
          key={`${question.questionID}-${index}`}
          style={[styles.optionButton, answers[question.questionID] === option && styles.selectedOption]}
          onPress={() => handleMultipleChoiceAnswer(question.questionID, option)}
          disabled={status === 'submitted'}
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
            key={`${question.questionID}-${score}`}
            style={[styles.ratingButton, answers[question.questionID] === score && styles.selectedRating]}
            onPress={() => handleRatingAnswer(question.questionID, score)}
            disabled={status === 'submitted'}
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
        editable={status !== 'submitted'}
      />
    </View>
  );

  if (!assignment) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>{assignment.assignmentTitle}</Text>
        {status === 'submitted' ? (
          <Text style={styles.lastModified}>Submitted at: {new Date(assignment.submittedAt).toLocaleString()}</Text>
        ) : (
          <Text style={styles.lastModified}>Last saved: {lastSaved}</Text>
        )}

        {/* 渲染组成员目标评价 */}
        {assignment.includeEvaluateGoal && renderGroupGoals()}

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

        {/* 保存并退出按钮, 提交并退出按钮 */}
        {status === 'in_progress' ? (
          <>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveAndExit}>
              <Text style={styles.saveButtonText}>Save and Exit</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmitAndExit}>
              <Text style={styles.submitButtonText}>Submit and Exit</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.returnButton} onPress={() => navigation.goBack()}>
            <Text style={styles.returnButtonText}>Return</Text>
          </TouchableOpacity>
        )}
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
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  groupContainer: {
    marginBottom: 20,
  },
  memberContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderColor: '#B3A369',
    borderWidth: 1,
    borderRadius: 5,
  },
  memberName: {
    fontSize: 16,
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
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
    backgroundColor: '#FFCC00',
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
  returnButton: {
    padding: 15,
    backgroundColor: '#B3A369',
    borderRadius: 5,
    alignItems: 'center',
  },
  returnButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AssignmentDetail;
