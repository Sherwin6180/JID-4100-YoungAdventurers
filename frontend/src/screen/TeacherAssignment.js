import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, StatusBar, View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { UserContext } from '../../UserContext';
import config from '../../config';

const server = config.apiUrl;

const TeacherAssignment = () => {
  const navigation = useNavigation();
  const { courseID, semester, sectionID } = useContext(UserContext);
  const { setAssignmentID } = useContext(UserContext);

  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await fetch(`${server}/api/assignment/fetchAssignments/${courseID}/${semester}/${sectionID}`);
      const data = await response.json();

      if (response.ok) {
        setAssignments(data.assignments);
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch assignments');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while fetching assignments.');
    }
  };

  const removeAssignment = async (assignmentID) => {
    try {
      const response = await fetch(`${server}/api/assignment/removeAssignment`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assignmentID,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Assignment removed successfully!');
        setAssignments(assignments.filter((assignment) => assignment.assignmentID !== assignmentID));
      } else {
        Alert.alert('Error', data.message || 'Failed to remove assignment.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while removing the assignment.');
    }
  };

  const handleEditAssignment = (assignmentID) => {
    setAssignmentID(assignmentID);
    navigation.navigate('TeacherEditAssignmentQuestion');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" hidden={true} />

      <View style={styles.outerContainer}>
        {/* 左边的图标列 */}
        <View style={styles.iconColumn}>
          <View>
            {/* Dashboard 图标 */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('TeacherDashboard')}
            >
              <MaterialIcons name="dashboard" size={30} color="black" />
            </TouchableOpacity>

            {/* Setting 图标 */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('setting')}
            >
              <MaterialIcons name="settings" size={30} color="black" />
            </TouchableOpacity>
          </View>

          {/* Back 图标 */}
          <View style={styles.bottomIcons}>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
              <MaterialIcons name="arrow-back" size={30} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Edit Assignments</Text>

          {/* 显示当前 section 下所有作业 */}
          <Text style={styles.subTitle}>Current Assignments:</Text>
          {assignments.map((assignment) => (
            <TouchableOpacity
              key={assignment.assignmentID}
              style={styles.assignmentCard}
              onPress={() => handleEditAssignment(assignment.assignmentID)}
            >
              <Text style={styles.assignmentName}>{assignment.assignmentTitle}</Text>
              <Text style={styles.dueDate}>
                Due: {new Date(assignment.dueDateTime).toLocaleString()}
              </Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeAssignment(assignment.assignmentID)}
              >
                <MaterialIcons name="delete" size={24} color="red" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}

          {/* 跳转到添加作业页面 */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddAssignmentPage')}
          >
            <Text style={styles.buttonText}>Add Assignment</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  outerContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  iconColumn: {
    width: 60,
    backgroundColor: '#B3A369',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    flexDirection: 'column',
  },
  bottomIcons: {
    marginTop: 'auto',
    marginBottom: 30,
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  assignmentCard: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  assignmentName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  dueDate: {
    fontSize: 14,
    color: 'gray',
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
  },
  input: {
    width: '100%',
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  addButton: {
    padding: 15,
    backgroundColor: '#B3A369',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  datePickerButton: {
    padding: 15,
    backgroundColor: '#B3A369',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  iconButton: {
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
});

export default TeacherAssignment;
