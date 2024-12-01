import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../../UserContext';
import config from '../../config';

const server = config.apiUrl;

const MyGroup = () => {
  const navigation = useNavigation();
  const { courseID, semester, sectionID, username } = useContext(UserContext);

  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [joinedGroup, setJoinedGroup] = useState(null);

  // Fetch groups and determine if the user has joined a group
  const fetchGroups = async () => {
    try {
      const response = await fetch(`${server}/api/group/fetchGroups/${courseID}/${sectionID}/${semester}`);
      if (!response.ok) {
        throw new Error('Failed to fetch groups');
      }
      const data = await response.json();
      const joined = data.groups.find(group => group.students.some(student => student.username === username));
      
      setGroups(data.groups);
      setJoinedGroup(joined || null);
    } catch (error) {
      console.error('Error fetching groups:', error);
      Alert.alert('Error', 'Failed to load groups.');
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [courseID, sectionID, semester]);

  // Toggle group expansion to show or hide its members
  const handleSelectGroup = (group) => {
    if (selectedGroup && selectedGroup.groupID === group.groupID) {
      setSelectedGroup(null);
    } else {
      setSelectedGroup(group);
    }
  };

  // Handle joining a new group
  const handleJoinGroup = async () => {
    try {
      if (selectedGroup.students.find((member) => member.username === username)) {
        Alert.alert('Error', 'You are already a member of this group.');
        return;
      }
  
      const response = await fetch(`${server}/api/student/joinGroup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentUsername: username,
          groupID: selectedGroup.groupID,
          courseID,
          sectionID,
          semester,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to join the group');
      }
  
      Alert.alert('Success', 'Joined the group successfully!');
      await fetchGroups();
    } catch (error) {
      console.error('Error joining group:', error);
      Alert.alert('Error', 'Failed to join the group.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.outerContainer}>
        {/* Sidebar icons */}
        <View style={styles.iconColumn}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('StudentDashboard')}>
            <MaterialIcons name="dashboard" size={30} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('setting')}>
            <MaterialIcons name="settings" size={30} color="black" />
          </TouchableOpacity>
          <View style={styles.bottomIcons}>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
              <MaterialIcons name="arrow-back" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() =>
                Alert.alert("Confirm Logout", "Are you sure you want to log out?", [
                  { text: "Cancel", style: "cancel" },
                  { text: "OK", onPress: () => navigation.navigate('Login') },
                ])
              }
            >
              <MaterialIcons name="logout" size={30} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Main content */}
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>My Groups</Text>

          {/* Current Group Section */}
          {joinedGroup ? (
            <View style={styles.currentGroup}>
              <Text style={styles.currentGroupTitle}>Current Group: {joinedGroup.groupName}</Text>
              {joinedGroup.students.map((member) => (
                <Text key={member.username} style={styles.memberText}>
                  {member.firstName} {member.lastName}
                </Text>
              ))}
            </View>
          ) : (
            <Text style={styles.noGroupText}>You have not joined any group.</Text>
          )}

          {/* Other Groups */}
          <Text style={styles.subtitle}>Available Groups</Text>
          {Array.isArray(groups) && groups.length > 0 ? (
            groups
              .filter(group => !joinedGroup || group.groupID !== joinedGroup.groupID)
              .map((group) => (
                <View key={group.groupID}>
                  <TouchableOpacity
                    style={[
                      styles.groupButton,
                      selectedGroup && selectedGroup.groupID === group.groupID && styles.selectedGroupButton,
                    ]}
                    onPress={() => handleSelectGroup(group)}
                  >
                    <Text style={styles.groupButtonText}>{group.groupName}</Text>
                  </TouchableOpacity>

                  {selectedGroup && selectedGroup.groupID === group.groupID && (
                    <View style={styles.groupDetail}>
                      <Text style={styles.groupDetailTitle}>Members:</Text>
                      {selectedGroup.students.map((member) => (
                        <Text key={member.username} style={styles.memberText}>
                          {member.firstName} {member.lastName}
                        </Text>
                      ))}

                      <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.joinButton} onPress={handleJoinGroup}>
                          <Text style={styles.buttonText}>Join</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              ))
          ) : (
            <Text>No groups available.</Text>
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
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  currentGroup: {
    padding: 15,
    backgroundColor: '#DFF2D8', // Light green background for current group
    borderColor: '#B3A369',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  currentGroupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  noGroupText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  groupButton: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderColor: '#B3A369',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  selectedGroupButton: {
    backgroundColor: '#B3A369',
  },
  groupButtonText: {
    fontSize: 18,
    color: '#333',
  },
  groupDetail: {
    padding: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 20,
  },
  groupDetailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  memberText: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  joinButton: {
    padding: 10,
    backgroundColor: '#87CEEB', // Light blue color for Join button
    borderRadius: 5,
    alignItems: 'center',
    width: 80,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default MyGroup;
