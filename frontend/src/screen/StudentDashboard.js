import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, StatusBar, View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import config from '../../config';
import { UserContext } from '../../UserContext';

const server = config.apiUrl;

const StudentDashboard = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const { username, setCourseID, setSemester, setSectionID } = useContext(UserContext);

  // Current and previous course lists, and loading status
  const [currentCourses, setCurrentCourses] = useState([]);
  const [previousCourses, setPreviousCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isFocused) {
      fetchCourses(); // Fetch courses each time the page is focused
    }
  }, [isFocused]);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${server}/api/student/getSectionsByStudent/${username}`);
      const data = await response.json();

      if (response.ok) {
        const current = data.sections.filter(section => section.courseType === 'current');
        const previous = data.sections.filter(section => section.courseType === 'previous');
        setCurrentCourses(current);
        setPreviousCourses(previous);
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch sections');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      Alert.alert('Error', 'An error occurred while fetching sections.');
    } finally {
      setIsLoading(false);
    }
  };

  // Check if the student is in a group for the course and navigate accordingly
  const handleCourseClick = async (courseID, sectionID, semester) => {
    setCourseID(courseID);
    setSemester(semester);
    setSectionID(sectionID);

    try {
      const response = await fetch(`${server}/api/student/checkGroupMembership/${username}/${courseID}/${sectionID}/${semester}`);
      const data = await response.json();

      if (response.ok) {
        if (data.isMember) {
          navigation.navigate('StudentCourseDetails'); // If in group, go to course details
        } else {
          Alert.alert('Notice', 'Please join a group first.', [
            { text: 'OK', onPress: () => navigation.navigate('StudentGroups') },
          ]);
        }
      } else {
        Alert.alert('Error', data.message || 'Failed to check group membership');
      }
    } catch (error) {
      console.error('Error checking group membership:', error);
      Alert.alert('Error', 'An error occurred while checking group membership.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" hidden={true} />

      <View style={styles.outerContainer}>
        {/* Left icons column */}
        <View style={styles.iconColumn}>
          <View>
            {/* Dashboard icon */}
            <TouchableOpacity style={[styles.iconButton, styles.activeIconButton]} disabled={true}>
              <MaterialIcons name="dashboard" size={30} color="gray" />
            </TouchableOpacity>

            {/* Settings icon */}
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('setting')}>
              <MaterialIcons name="settings" size={30} color="black" />
            </TouchableOpacity>
          </View>

          {/* Back and Logout icons, positioned at the bottom */}
          <View style={styles.bottomIcons}>
            <TouchableOpacity style={styles.iconButton} disabled={true}>
              <MaterialIcons name="arrow-back" size={30} color="gray" />
            </TouchableOpacity>

            {/* Logout icon */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => {
                Alert.alert(
                  "Confirm Logout",
                  "Are you sure you want to log out?",
                  [
                    { text: "Cancel", style: "cancel" },
                    { text: "OK", onPress: () => navigation.navigate('Login') },
                  ]
                );
              }}
            >
              <MaterialIcons name="logout" size={30} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Main content area */}
        <ScrollView contentContainerStyle={styles.container}>
          {isLoading ? (
            <Text>Loading courses...</Text>
          ) : (
            <>
              {/* Display current courses */}
              <Text style={styles.sectionTitle}>Current Courses</Text>
              {currentCourses.length === 0 ? (
                <Text>No current courses available.</Text>
              ) : (
                <View style={styles.courseContainer}>
                  {currentCourses.map((course) => (
                    <TouchableOpacity
                      key={course.courseID + '-' + course.sectionID}
                      style={styles.courseCard}
                      onPress={() => handleCourseClick(course.courseID, course.sectionID, course.semester)}
                    >
                      <Text style={styles.courseTitle}>{`${course.courseID}-${course.sectionID}`}</Text>
                      <Text style={styles.courseDescription}>{course.courseTitle}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Display previous courses */}
              <Text style={styles.sectionTitle}>Previous Courses</Text>
              {previousCourses.length === 0 ? (
                <Text>No previous courses available.</Text>
              ) : (
                <View style={styles.courseContainer}>
                  {previousCourses.map((course) => (
                    <TouchableOpacity
                      key={course.courseID + '-' + course.sectionID}
                      style={styles.courseCard}
                      onPress={() => handleCourseClick(course.courseID, course.sectionID, course.semester)}
                    >
                      <Text style={styles.courseTitle}>{`${course.courseID}-${course.sectionID}`}</Text>
                      <Text style={styles.courseDescription}>{course.courseTitle}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

// Styles remain unchanged
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
  activeIconButton: {
    backgroundColor: '#f9f9f9',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    width: '100%',
  },
  bottomIcons: {
    marginTop: 'auto',
  },
  container: {
    flexGrow: 1,
    padding: 10,
    paddingTop: 30,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  courseCard: {
    padding: 20,
    borderWidth: 1,
    borderColor: '#B3A369',
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    width: '45%',
    marginHorizontal: '2.5%',
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  courseDescription: {
    fontSize: 16,
    color: '#666',
  },
  courseContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

export default StudentDashboard;
