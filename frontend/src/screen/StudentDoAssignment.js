import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../../UserContext';

const includeEvaluateGoal = true; // 是否启用 evaluation goal

const AssignmentDetail = () => {
  const navigation = useNavigation();
  const [assignment, setAssignment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [status, setStatus] = useState('in_progress');
  const [lastSaved, setLastSaved] = useState('');
  const { assignmentID, username } = useContext(UserContext);

  const [selectedMember, setSelectedMember] = useState({
    username: 'member1',
    firstName: 'Alice',
    lastName: 'Johnson',
    goal: 'Complete project design'
  });

  const [memberRatings, setMemberRatings] = useState({});
  const [goalRatings, setGoalRatings] = useState({});
  const [localAssignmentResults, setLocalAssignmentResults] = useState({});

  useEffect(() => {
    fetchAssignment();
    loadSavedData();
  }, []);

  const fetchAssignment = async () => {
    const simulatedAssignment = {
      assignmentID,
      assignmentTitle: "Group Project Evaluation",
      status: "in_progress",
      lastSavedAt: Date.now(),
      questions: [
        { questionID: "q1", questionText: "How well was the project structured?", questionType: "rating" },
        { questionID: "q2", questionText: "Did the team communicate effectively?", questionType: "multiple_choice", questionOptions: ["Yes", "No"] },
        { questionID: "q3", questionText: "Describe any challenges faced by the team.", questionType: "free_response" }
      ],
      evaluateStage: 1
    };
    setAssignment(simulatedAssignment);
    setStatus(simulatedAssignment.status);
    setLastSaved(new Date(simulatedAssignment.lastSavedAt).toLocaleString());
  };

  const loadSavedData = () => {
    const savedData = localAssignmentResults[selectedMember.username] || {};
    setAnswers(savedData.answers || {});
    setMemberRatings({ [selectedMember.username]: savedData.ratings || null });
    setGoalRatings({ [selectedMember.username]: savedData.goalRating || null });
  };

  const handleSaveAndExit = () => {
    setLastSaved(new Date().toLocaleString());
    Alert.alert("Saved", "Your answers have been saved.");
    navigation.navigate(includeEvaluateGoal ? 'StudentDoAssignmentChoosePerson' : 'StudentCourseDetails');
  };

  const handleSubmitAndExit = () => {
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
    navigation.navigate(includeEvaluateGoal ? 'StudentDoAssignmentChoosePerson' : 'StudentCourseDetails');
  };

  const handleMemberRating = (username, rating) => {
    if (status === 'submitted') return;
    setMemberRatings((prevRatings) => ({
      ...prevRatings,
      [username]: rating,
    }));
  };

  const handleGoalRating = (username, rating) => {
    if (status === 'submitted') return;
    setGoalRatings((prevRatings) => ({
      ...prevRatings,
      [username]: rating,
    }));
  };

  const handleRatingAnswer = (questionID, rating) => {
    if (status === 'submitted') return;
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionID]: rating,
    }));
  };

  const handleMultipleChoiceAnswer = (questionID, answer) => {
    if (status === 'submitted') return;
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionID]: answer,
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

  const renderEvaluationGoal = () => (
    <View style={styles.evaluationGoalContainer}>
      <Text style={styles.evaluationGoalText}>Evaluate Goal: {selectedMember.goal}</Text>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((score) => (
          <TouchableOpacity
            key={`${selectedMember.username}-goal-${score}`}
            style={[styles.ratingButton, goalRatings[selectedMember.username] === score && styles.selectedRating]}
            onPress={() => handleGoalRating(selectedMember.username, score)}
            disabled={status === 'submitted'}
          >
            <Text style={styles.ratingText}>{score}</Text>
          </TouchableOpacity>
        ))}
      </View>
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

        {includeEvaluateGoal && renderEvaluationGoal()}

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
          <TouchableOpacity style={styles.returnButton} onPress={() => navigation.navigate('StudentDoAssignmentChoosePerson')}>
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
  freeResponseInput: {
    padding: 10,
    borderColor: '#B3A369',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  evaluationGoalContainer: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  evaluationGoalText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
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
