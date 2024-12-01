import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../../UserContext';
import config from '../../config';

const server = config.apiUrl;

const TeacherCheckGrades = () => {
  const navigation = useNavigation();
  const { assignmentID } = useContext(UserContext);
  const [grades, setGrades] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${server}/api/teacher/getGrades/${assignmentID}`);
      const data = await response.json();

      if (response.ok) {
        setGrades(data.ratings);
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch grades.');
      }
    } catch (error) {
      console.error('Error fetching grades:', error);
      Alert.alert('Error', 'An error occurred while fetching grades.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.outerContainer}>
        {/* Sidebar */}
        <View style={styles.iconColumn}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={30} color="black" />
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Grades for Assignment</Text>
          {isLoading ? (
            <Text style={styles.loadingText}>Loading grades...</Text>
          ) : grades.length === 0 ? (
            <Text style={styles.noGradesText}>No grades available.</Text>
          ) : (
            grades.map((grade, index) => (
              <View key={index} style={styles.gradeCard}>
                <Text style={styles.studentName}>{grade.studentName}</Text>
                <Text style={styles.studentUsername}>({grade.studentUsername})</Text>
                <Text style={styles.grade}>
                  <Text style={styles.gradeLabel}>Score: </Text>
                  {grade.score}
                </Text>
                <Text style={styles.goal}>
                  <Text style={styles.goalLabel}>Goal: </Text>
                  {grade.goal}
                </Text>
              </View>
            ))
          )}
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 10,
    paddingTop: 30,
  },
  iconButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  content: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  noGradesText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  gradeCard: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderColor: '#B3A369',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  studentUsername: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  grade: {
    fontSize: 16,
    marginBottom: 5,
  },
  gradeLabel: {
    fontWeight: 'bold',
    color: '#444',
  },
  goal: {
    fontSize: 16,
  },
  goalLabel: {
    fontWeight: 'bold',
    color: '#444',
  },
});

export default TeacherCheckGrades;
