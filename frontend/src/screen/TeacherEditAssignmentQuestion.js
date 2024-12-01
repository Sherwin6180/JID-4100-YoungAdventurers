import React, { useState, useContext, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../../UserContext';
import { MaterialIcons } from '@expo/vector-icons';
import config from '../../config';

const server = config.apiUrl;

const EditAssignmentQuestion = () => {
  const navigation = useNavigation();
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState('multiple_choice');
  const [options, setOptions] = useState(['', '', '', '']);
  const [isPublished, setIsPublished] = useState(false);
  const [ratingRange, setRatingRange] = useState([1, 5]);
  const [includeEvaluateGoal, setIncludeEvaluateGoal] = useState(false);
  const [gradesPublished, setGradesPublished] = useState(false);
  const { assignmentID } = useContext(UserContext);

  useEffect(() => {
    fetchAssignmentData();
    checkGradesPublished();
  }, []);

  const handleNavigateToGrades = () => {
    navigation.navigate('TeacherCheckGrades', { assignmentID });
  };

  const handlePublishGrades = async () => {
    try {
      const response = await fetch(`${server}/api/teacher/publishGrades`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assignmentID }),
      });
  
      if (response.ok) {
        setGradesPublished(true); // Mark grades as published
        Alert.alert('Success', 'Grades published successfully!');
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to publish grades');
      }
    } catch (error) {
      console.error('Error publishing grades:', error);
      Alert.alert('Error', 'An error occurred while publishing grades.');
    }
  };  

  const checkGradesPublished = async () => {
    try {
      const response = await fetch(`${server}/api/teacher/checkGradesPublished/${assignmentID}`);
      const data = await response.json();
  
      if (response.ok) {
        setGradesPublished(data.gradesPublished);
      } else {
        Alert.alert('Error', data.message || 'Failed to check grades publication status.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while checking grades publication status.');
    }
  };

  // Fetch questions and current evaluateGoals value
  const fetchAssignmentData = async () => {
    try {
      const response = await fetch(`${server}/api/assignment/fetchQuestions/${assignmentID}`);
      const data = await response.json();
  
      if (response.ok) {
        setQuestions(data.questions);
        setIncludeEvaluateGoal(data.evaluateGoals);
        setIsPublished(data.published == 1 ? true : false);
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch questions');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while fetching assignment data.');
    }
  };
  

  // Update evaluateGoals value on the server
  const updateEvaluateGoals = async (value) => {
    try {
      const response = await fetch(`${server}/api/assignment/updateEvaluateGoals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assignmentID,
          evaluateGoals: value,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update evaluate goals');
      }
    } catch (error) {
      console.error('Error updating evaluate goals:', error);
      Alert.alert('Error', 'An error occurred while updating evaluate goals.');
    }
  };

  const handleEvaluateGoalToggle = (value) => {
    if (isPublished) return; 
    setIncludeEvaluateGoal(value);
    updateEvaluateGoals(value);
  };

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
  
      // Add the new question to the questions list with the questionID from the backend
      setQuestions([...questions, { ...newQuestion, questionID: data.question.questionID }]);
      setQuestionText('');
      setOptions(['', '', '', '']);
      Alert.alert('Success', 'Question added successfully!');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while adding the question.');
    }
  };

  const handleDeleteQuestion = (questionID) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this question?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(`${server}/api/assignment/deleteQuestion`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ questionID }),
              });
  
              const data = await response.json();
  
              if (!response.ok) {
                Alert.alert('Error', data.message || 'Failed to delete question');
                return;
              }
  
              setQuestions(questions.filter((question) => question.questionID !== questionID));
              Alert.alert("Success", "Question deleted successfully!");
            } catch (error) {
              console.error("Error deleting question:", error);
              Alert.alert("Error", "An error occurred while deleting the question.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handlePublishAssignment = async () => {
    try {
      const response = await fetch(`${server}/api/assignment/publishAssignment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assignmentID }),
      });
  
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to publish assignment');
      }
  
      setIsPublished(true); // 设置发布状态为 true
      Alert.alert('Success', 'Assignment published successfully!');
    } catch (error) {
      console.error('Error publishing assignment:', error);
      Alert.alert('Error', 'An error occurred while publishing the assignment.');
    }
  };
  

  const handleOptionChange = (index, text) => {
    const newOptions = [...options];
    newOptions[index] = text;
    setOptions(newOptions);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Edit Assignment Questions</Text>

        {/* 是否包含 evaluate goal 类型的问题 */}
        <View style={styles.switchContainer}>
          <Text style={styles.sectionTitle}>Include Goal Evaluation?</Text>
          <Switch
            value={includeEvaluateGoal == 1 ? true : false}
            onValueChange={handleEvaluateGoalToggle}
            disabled={isPublished}
          />
        </View>

        {/* 更明显的分割线 */}
        <View style={styles.divider} />

        {!isPublished && (
          <>
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
              <Text style={styles.sectionTitle}>Rating Range: {ratingRange[0]} to {ratingRange[1]}</Text>
            )}

            {/* Free Response 不需要额外的输入框，仅显示文本框 */}
            {questionType === 'free_response' && (
              <Text style={styles.sectionTitle}>This is a free response question.</Text>
            )}

            {/* 添加问题按钮 */}
            <TouchableOpacity style={styles.addButton} onPress={handleAddQuestion}>
              <Text style={styles.addButtonText}>Add Question</Text>
            </TouchableOpacity>
          </>
        )}


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
          
              {!isPublished && (
                <TouchableOpacity
                  style={styles.deleteIcon}
                  onPress={() => handleDeleteQuestion(question.questionID)}
                >
                  <MaterialIcons name="delete" size={24} color="#FF6347" />
                </TouchableOpacity>
              )}
            </View>
          ))
        )}

        {/* 保存作业按钮 */}
        <TouchableOpacity style={styles.saveButton} onPress={() => navigation.navigate('TeacherAssignment')}>
          <Text style={styles.saveButtonText}>Return</Text>
        </TouchableOpacity>

        {!isPublished && (
          <TouchableOpacity style={styles.publishButton} onPress={handlePublishAssignment}>
            <Text style={styles.publishButtonText}>Publish Assignment</Text>
          </TouchableOpacity>
        )}

        {!gradesPublished && isPublished && (
          <TouchableOpacity
            style={styles.publishButton}
            onPress={handlePublishGrades}
          >
            <Text style={styles.publishButtonText}>Publish Grades</Text>
          </TouchableOpacity>
        )}

        {gradesPublished && (
          <TouchableOpacity style={styles.checkButton} onPress={handleNavigateToGrades}>
            <Text style={styles.checkButtonText}>Check Grades</Text>
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
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderColor: '#B3A369',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  divider: {
    height: 2,
    backgroundColor: '#444',
    marginVertical: 20,
    marginHorizontal: 10,
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
    backgroundColor: '#FFCC00',
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
  deleteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  publishButton: {
    padding: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  publishButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkButton: {
    padding: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  checkButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default EditAssignmentQuestion;
