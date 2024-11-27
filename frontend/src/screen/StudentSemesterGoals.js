import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../../UserContext';
import config from '../../config';

const server = config.apiUrl;

const StudentSemesterGoals = () => {
  const navigation = useNavigation();
  const [goals, setGoals] = useState([]);
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [editedGoalText, setEditedGoalText] = useState('');
  const { courseID, sectionID, semester, username } = useContext(UserContext);

  useEffect(() => {
    fetchGoalsForSection();
  }, []);

  // Fetch the list of goals for the current section
  const fetchGoalsForSection = async () => {
    try {
      const response = await fetch(`${server}/api/student/getGoalsForSection/${courseID}/${sectionID}/${semester}/${username}`);
      const data = await response.json();

      if (response.ok) {
        // Filter out goals with empty text
        const filteredGoals = data.goals.filter(goal => goal.goalText && goal.goalText.trim() !== '');
        setGoals(filteredGoals);
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch goals.');
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
      Alert.alert('Error', 'An error occurred while fetching goals.');
    }
  };

  // Begin editing a goal
  const handleEditGoal = (goal) => {
    setEditingGoalId(goal.assignmentID);
    setEditedGoalText(goal.goalText);
  };

  // Save the updated goal text to the server
  const handleSaveGoal = async (assignmentID) => {
    try {
      const response = await fetch(`${server}/api/student/updateGoal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assignmentID,
          studentUsername: username,
          goalText: editedGoalText,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        // Update the goal list with the edited goal text
        setGoals(goals.map(goal => 
          goal.assignmentID === assignmentID ? { ...goal, goalText: editedGoalText } : goal
        ));
        setEditingGoalId(null);
        Alert.alert('Success', 'Goal updated successfully.');
      } else {
        Alert.alert('Error', data.message || 'Failed to update goal.');
      }
    } catch (error) {
      console.error('Error updating goal:', error);
      Alert.alert('Error', 'An error occurred while updating the goal.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.outerContainer}>
        {/* Sidebar with icons */}
        <View style={styles.iconColumn}>
          <View>
            {/* Dashboard icon */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('StudentDashboard')}
            >
              <MaterialIcons name="dashboard" size={30} color="black" />
            </TouchableOpacity>

            {/* Settings icon */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('setting')}
            >
              <MaterialIcons name="settings" size={30} color="black" />
            </TouchableOpacity>
          </View>

          {/* Bottom icons: Back and Logout */}
          <View style={styles.bottomIcons}>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
              <MaterialIcons name="arrow-back" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => {
                Alert.alert("Confirm Logout", "Are you sure you want to log out?", [
                  { text: "Cancel", style: "cancel" },
                  { text: "OK", onPress: () => navigation.navigate('Login') },
                ]);
              }}
            >
              <MaterialIcons name="logout" size={30} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Main content area */}
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>My Semester Goals</Text>

          {/* Display goals */}
          {goals.length === 0 ? (
            <Text style={styles.noGoalsText}>No goals added yet.</Text>
          ) : (
            goals.map((goal) => (
              <View key={goal.assignmentID} style={styles.goalCard}>
                <Text style={styles.assignmentTitle}>{goal.assignmentTitle}</Text>

                {/* Goal text input for editing */}
                {editingGoalId === goal.assignmentID ? (
                  <TextInput
                    style={styles.goalInput}
                    value={editedGoalText}
                    onChangeText={setEditedGoalText}
                    multiline
                  />
                ) : (
                  <Text style={styles.goalText}>{goal.goalText}</Text>
                )}

                {/* Edit and Save buttons */}
                {editingGoalId === goal.assignmentID ? (
                  <TouchableOpacity style={styles.saveButton} onPress={() => handleSaveGoal(goal.assignmentID)}>
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.editButton} onPress={() => handleEditGoal(goal)}>
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

// Styles
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
    paddingVertical: 10,
    paddingTop: 30,
    flexDirection: 'column',
  },
  iconButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  bottomIcons: {
    marginTop: 'auto',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  goalCard: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderColor: '#B3A369',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  assignmentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  goalText: {
    fontSize: 16,
    color: '#333',
  },
  goalInput: {
    fontSize: 16,
    color: '#333',
    minHeight: 80,
    backgroundColor: '#f9f9f9',
    borderColor: '#B3A369',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  editButton: {
    padding: 10,
    backgroundColor: '#FFA500',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    padding: 10,
    backgroundColor: '#6ca06c',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noGoalsText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default StudentSemesterGoals;
