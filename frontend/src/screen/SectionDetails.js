import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Alert, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../../UserContext';
import config from '../../config';

const server = config.apiUrl;

const SectionDetail = () => {
  const navigation = useNavigation();
  const { courseID, semester, sectionID } = useContext(UserContext);
  const [courseDescription, setCourseDescription] = useState('');
  const [sectionDescription, setSectionDescription] = useState('');
  const [allowGroupChange, setAllowGroupChange] = useState(false);

  useEffect(() => {
    fetchSectionDetails();
    fetchAllowGroupChangeStatus();
  }, []);

  const fetchSectionDetails = async () => {
    try {
      const response = await fetch(`${server}/api/class/getSectionDetails/${courseID}/${semester}/${sectionID}`);
      const data = await response.json();

      if (response.ok) {
        setCourseDescription(data.courseDescription);
        setSectionDescription(data.sectionDescription);
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch section details');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while fetching section details.');
    }
  };

  const fetchAllowGroupChangeStatus = async () => {
    try {
      const response = await fetch(`${server}/api/teacher/getAllowGroupChangeStatus/${courseID}/${sectionID}/${semester}`);
      const data = await response.json();

      if (response.ok) {
        setAllowGroupChange(data.allowGroupChange);
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch group change status');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while fetching group change status.');
    }
  };

  const toggleAllowGroupChange = async () => {
    const newValue = !allowGroupChange;
    setAllowGroupChange(newValue);

    try {
      const response = await fetch(`${server}/api/teacher/setAllowGroupChange`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseID,
          sectionID,
          semester,
          allowGroupChange: newValue,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Failed to update group change setting.');
        setAllowGroupChange(!newValue); // 如果失败，恢复原状态
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while updating the group change setting.');
      setAllowGroupChange(!newValue); // 如果失败，恢复原状态
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 左侧侧边栏 */}
        <View style={styles.sidebar}>
          {/* 顶部图标 */}
          <View style={styles.topIcons}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('TeacherDashboard')}
            >
              <MaterialIcons name="dashboard" size={30} color="black" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('setting')}
            >
              <MaterialIcons name="settings" size={30} color="black" />
            </TouchableOpacity>
          </View>

          {/* 底部图标 */}
          <View style={styles.bottomIcons}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons name="arrow-back" size={30} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 主要内容 */}
        <View style={styles.content}>
          <Text style={styles.title}>Course ID: {courseID}</Text>
          <Text style={styles.subtitle}>Section ID: {sectionID}</Text>
          <Text style={styles.subtitle}>Semester: {semester}</Text>

          <Text style={styles.sectionHeader}>Course Description</Text>
          <Text style={styles.description}>{courseDescription}</Text>

          <Text style={styles.sectionHeader}>Section Description</Text>
          <Text style={styles.description}>{sectionDescription}</Text>

          {/* 将小组更改开关加入到页面中 */}
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>Allow Group Change:</Text>
            <Switch
              value={allowGroupChange == 1 ? true : false}
              onValueChange={toggleAllowGroupChange}
            />
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('TeacherRoster')}
          >
            <Text style={styles.addButtonText}>Student Roster</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('TeacherEditGroups')}
          >
            <Text style={styles.addButtonText}>Groups</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('TeacherAssignment')}
          >
            <Text style={styles.addButtonText}>Assignment</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

// 样式定义
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 60,
    backgroundColor: '#B3A369',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  topIcons: {
    alignItems: 'center',
  },
  bottomIcons: {
    alignItems: 'center',
    marginBottom: 45, // 返回键距离底部一个图标高度
  },
  iconButton: {
    paddingVertical: 15,
    alignItems: 'center',
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
    fontSize: 18,
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
  },
  addButton: {
    padding: 15,
    backgroundColor: '#B3A369',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  toggleLabel: {
    fontSize: 16,
    marginRight: 10,
  },
});

export default SectionDetail;
