import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../../UserContext';
import config from '../../config';

const server = config.apiUrl;

const AssignmentDetail = () => {
  const navigation = useNavigation();
  const [assignment, setAssignment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [status, setStatus] = useState('in_progress');
  const [lastSaved, setLastSaved] = useState('');
  const { assignmentID, username, submissionID } = useContext(UserContext);

  useEffect(() => {
    fetchAssignment();
  }, []);

  const fetchAssignment = async () => {
    try {
      const response = await fetch(`${server}/api/student/getStudentAnswers/${assignmentID}/${username}/${submissionID}`);
      const data = await response.json();

      if (response.ok) {
        if (data.questions && data.questions.length > 0) {
          setAssignment(data);
          const initialAnswers = data.questions.reduce((acc, question) => {
            acc[question.questionID] = question.studentAnswer || '';
            return acc;
          }, {});
          setAnswers(initialAnswers);
          setStatus(data.status);
          setLastSaved(new Date(data.lastSavedAt).toLocaleString());
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

  const handleMultipleChoiceAnswer = (questionID, answer) => {
    if (status === 'submitted') return;
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionID]: answer,
    }));
  };

  const handleRatingAnswer = (questionID, rating) => {
    if (status === 'submitted') return;
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionID]: rating,
    }));
  };

  const handleFreeResponseAnswer = (questionID, text) => {
    if (status === 'submitted') return;
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionID]: text,
    }));
  };

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

  // 处理显示 goal 类型问题
  const renderGoalQuestion = (question) => (
    <View key={question.questionID} style={styles.questionContainer}>
      <Text style={styles.questionText}>
        {question.questionText}
      </Text>
      <Text style={styles.goalText}>
        {question.goalText}
      </Text>
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

  const handleSaveAndExit = async () => {
    try {
      const response = await fetch(`${server}/api/student/saveStudentAnswers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          submissionID,
          answers,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Answers saved successfully.');
        navigation.goBack();
      } else {
        Alert.alert('Error', data.message || 'Failed to save answers.');
      }
    } catch (error) {
      console.error('Error saving answers:', error);
      Alert.alert('Error', 'An error occurred while saving the answers.');
    }
  };

  const allQuestionsAnswered = () => {
    return assignment.questions.every((question) => {
      const answer = answers[question.questionID];
      if (question.questionType === 'multiple_choice' || question.questionType === 'rating' || question.questionType === 'goal') {
        return answer !== '';
      } else if (question.questionType === 'free_response') {
        return answer && answer.trim() !== '';
      }
      return false;
    });
  };

  const handleSubmitAndExit = async () => {
    if (!allQuestionsAnswered()) {
      Alert.alert('Incomplete Submission', 'Please answer all questions before submitting.');
      return;
    }

    try {
      const response = await fetch(`${server}/api/student/submitStudentAnswers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          submissionID,
          answers,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Assignment submitted successfully.');
        navigation.goBack();
      } else {
        Alert.alert('Error', data.message || 'Failed to submit assignment.');
      }
    } catch (error) {
      console.error('Error submitting assignment:', error);
      Alert.alert('Error', 'An error occurred while submitting the assignment.');
    }
  };

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

        {assignment.questions.map((question) => {
          if (question.questionType === 'multiple_choice') {
            return renderMultipleChoiceQuestion(question);
          } else if (question.questionType === 'rating') {
            return renderRatingQuestion(question);
          } else if (question.questionType === 'free_response') {
            return renderFreeResponseQuestion(question);
          } else if (question.questionType === 'goal') {
            return renderGoalQuestion(question);
          }
          return null;
        })}

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