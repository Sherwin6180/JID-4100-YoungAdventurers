import React, { useState, useEffect } from 'react';
import { Alert, View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import DropdownMenu from './components/DropdownMenu';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentScreen, setCurrentScreen] = useState('TasksList'); 
  const [selectedTask, setSelectedTask] = useState(null);
  const [answers, setAnswers] = useState({}); 
  const [refreshTasks, setRefreshTasks] = useState(false);


  
  const assignmentId = '1';
  const evaluatorId = '2'
  const ip_address = '10.0.0.30';

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`http:/${ip_address}:3000/api/assignments/1/tasks?evaluatorId=2`);
        const data = await response.json();
        console.log(data); 
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
  
    fetchTasks();
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`http://${ip_address}:3000/api/assignments/${assignmentId}/tasks?evaluatorId=${evaluatorId}`);
        const data = await response.json();
        console.log(data); 
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
  
    fetchTasks();
  }, [refreshTasks]);
  
  
  
  useEffect(() => {
    if (selectedTask) {
      const fetchQuestions = async () => {
        try {
          const response = await fetch(`http://${ip_address}:3000/api/assignments/1/questions`);
          const data = await response.json();
          setQuestions(data);
          
          const initialAnswers = data.reduce((acc, question) => {
            acc[question.question_id] = '';
            return acc;
          }, {});
          setAnswers(initialAnswers);
        } catch (error) {
          console.error('Error fetching questions:', error);
         
        }
      };
      fetchQuestions();
    }
  }, [selectedTask]);

  const TaskDetails = () => {
    const handleBackPress = () => {
      Alert.alert(
        "Warning",
        "Your response won't be saved. Continue?",
        [
          {
            text: "No",
            style: "cancel", 
          },
          {
            text: "Yes",
            onPress: () => setCurrentScreen('TasksList'), 
          },
        ],
        { cancelable: true } 
      );
    };
  
    return (
      <TouchableOpacity onPress={handleBackPress}>
        <Text style={styles.backButtonText}>Back to Tasks</Text>
      </TouchableOpacity>
    );
  };

  const renderTaskDetails = () => (
    <ScrollView contentContainerStyle={styles.screen}>
      <Text style={styles.taskDetailsTitle}>Instructions</Text>
      <Text>The instructions for the assignment will be written here</Text>
      <Text style={styles.taskDetailsTitle}>Section 1</Text>
      <Text style={styles.question}>This student speaks clearly</Text>
      <DropdownMenu/>
      {questions.map((question) => (
        <View key={question.question_id}>
          <Text style={styles.question}>{question.question_text}</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setAnswers({ ...answers, [question.question_id]: text })}
            value={answers[question.question_id]}
            placeholder="Enter your answer here"
          />
        </View>
      ))}
      <TouchableOpacity style={styles.submitButton} onPress={submitAnswers}>
        <Text style={styles.submitButtonText}>Submit Answers</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity onPress={() => setCurrentScreen('TasksList')}>
        <Text style={styles.backButtonText}>Back to Tasks</Text>
      </TouchableOpacity> */}
      <TaskDetails/>
    </ScrollView>
  );
  
  
  const renderTask = ({ item }) => (
    <View style={styles.taskContainer}>
      <Text style={styles.taskTitle}>{`Presenter: ${item.first_name} ${item.last_name}`}</Text>
      <Text style={styles.taskStatus}>{`Status: ${item.status}`}</Text>
      {item.status !== 'Completed' && (
        <TouchableOpacity onPress={() => {
          setSelectedTask(item); 
          setCurrentScreen('TaskDetails'); 
        }}>
          <Text style={styles.detailsButtonText}>Begin Assignment</Text>
        </TouchableOpacity>
      )}
    </View>
  );
  
  

  const submitAnswers = async () => {
    try {
      const promises = Object.keys(answers).map(async (questionId) => {
        const response = await fetch(`http://${ip_address}:3000/api/answers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            task_id: 1,
            question_id: questionId,
            evaluator_id: 2, 
            answer_text: answers[questionId],
          }),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response;
      });
  
      await Promise.all(promises);
      alert('All answers submitted successfully');
      
      setRefreshTasks(!refreshTasks);
      setCurrentScreen('TasksList');
    } catch (error) {
      console.error('Error submitting answers:', error);
      alert('There was an error submitting your answers');
    }
  };
  
  

  return (
    <View style={styles.container}>
      {currentScreen === 'TasksList' ? (
        <View>
          <Text style={styles.assignmentTitle}>Assignments</Text>
          <FlatList
            data={tasks}
            keyExtractor={item => item.task_id.toString()}
            renderItem={renderTask}
          />
        </View>
      ) : (
        renderTaskDetails()
      )}
    </View>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#fff',
    // justifyContent: 'center',
    paddingHorizontal: 20,
  },
  taskContainer: {
    padding: 20,
    marginHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    borderTopWidth: 1,
    borderTopColor: '#cccccc',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskStatus: {
    fontSize: 14,
    color: 'grey',
    marginTop: 5,
  },
  detailsButtonText: {
    fontSize: 14,
    color: '#007bff',
    marginTop: 10,
  },
  backButtonText: {
    fontSize: 14,
    color: '#007bff',
    marginTop: 10,
    textAlign: 'center',
  },
  question: {
    fontSize: 16,
    marginTop: 10,
  },
  taskDetailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  assignmentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginTop: 5,
    marginBottom: 20,
    borderRadius: 5,
    width: '100%',
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignSelf: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    textAlign: 'center',
  },
});


export default App;