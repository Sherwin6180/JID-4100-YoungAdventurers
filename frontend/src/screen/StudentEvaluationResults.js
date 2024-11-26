import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../../UserContext';
import config from '../../config';

const server = config.apiUrl;

const StudentEvaluationResults = () => {
  const navigation = useNavigation();
  const { courseID, sectionID, semester, username } = useContext(UserContext);
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    try {
      const response = await fetch(
        `${server}/api/student/getAverageGoalRatings/${username}/${courseID}/${sectionID}/${semester}`
      );
      const data = await response.json();

      if (response.ok) {
        setRatings(data.ratings);
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch ratings.');
      }
    } catch (error) {
      console.error('Error fetching ratings:', error);
      Alert.alert('Error', 'An error occurred while fetching ratings.');
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
              onPress={() => navigation.navigate('Settings')}
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
          <Text style={styles.title}>Goal Ratings</Text>
          {ratings.length === 0 ? (
            <Text>No ratings available.</Text>
          ) : (
            ratings.map((item) => (
              <View key={item.assignmentID} style={styles.card}>
                <Text style={styles.assignmentTitle}>{item.assignmentTitle}</Text>
                <Text style={styles.goalText}>Goal: {item.goalText}</Text>
                <Text style={styles.averageRating}>
                  Average Rating: {item.averageRating}
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
  card: {
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
    marginBottom: 5,
  },
  averageRating: {
    fontSize: 16,
    color: '#666',
  },
});

export default StudentEvaluationResults;
