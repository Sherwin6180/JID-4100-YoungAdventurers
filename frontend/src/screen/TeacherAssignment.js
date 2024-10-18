import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, StatusBar, View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker'; // Import the modal picker
import { UserContext } from '../../UserContext'; // 引入 UserContext
import config from '../../config';

const server = config.apiUrl;

const TeacherAssignment = () => {
  const navigation = useNavigation();
  const { courseID, semester, sectionID } = useContext(UserContext); // 从 UserContext 中获取 courseID, semester, sectionID
  const { setAssignmentID } = useContext(UserContext);

  const [assignments, setAssignments] = useState([]);
  const [newAssignmentName, setNewAssignmentName] = useState(''); // 添加新作业名称
  const currentDate = new Date();
  const defaultDateTime = new Date(currentDate.setHours(23, 59, 59));
  const [dueDateTime, setDueDateTime] = useState(new Date()); // 选择截止日期时间
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false); // 控制日期选择器的显示

  // 在组件加载时获取当前课程的作业列表
  useEffect(() => {
    fetchAssignments();
  }, []);

  // 获取当前 section 下所有作业
  const fetchAssignments = async () => {
    try {
      const response = await fetch(`${server}/api/assignment/fetchAssignments/${courseID}/${semester}/${sectionID}`);
      const data = await response.json();

      if (response.ok) {
        setAssignments(data.assignments); // 设置获取到的作业数据
      } else {
        Alert.alert('Error', data.message || 'Failed to fetch assignments');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'An error occurred while fetching assignments.');
    }
  };

  // 添加新作业
  const addAssignment = async () => {
    if (newAssignmentName.trim() === '') {
      Alert.alert('Error', 'Please provide a valid assignment name.');
      return;
    }

    try {
      console.log(dueDateTime);
      const response = await fetch(`${server}/api/assignment/createAssignment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseID,
          semester,
          sectionID,
          assignmentTitle: newAssignmentName,
          dueDateTime: dueDateTime.toLocaleString(), // 发送截止日期和时间
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Assignment added successfully!');
        setAssignments([...assignments, data.assignment]); // 更新作业列表
        setNewAssignmentName(''); // 清空输入框
        setDueDateTime(new Date()); // 重置日期时间
      } else {
        Alert.alert('Error', data.message || 'Failed to add assignment.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while adding the assignment.');
    }
  };

  // 移除作业
  const removeAssignment = async (assignmentID) => {
    try {
      const response = await fetch(`${server}/api/assignment/removeAssignment`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assignmentID
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Assignment removed successfully!');
        setAssignments(assignments.filter((assignment) => assignment.assignmentID !== assignmentID)); // 更新作业列表
      } else {
        Alert.alert('Error', data.message || 'Failed to remove assignment.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while removing the assignment.');
    }
  };

  // 点击作业卡片跳转到作业编辑页面
  const handleEditAssignment = (assignmentID) => {
    setAssignmentID(assignmentID);
    navigation.navigate('TeacherEditAssignmentQuestion');
  };

  // 显示日期选择器
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  // 隐藏日期选择器
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  // 确认日期选择
  const handleConfirm = (date) => {
    setDueDateTime(date); // 设置日期时间
    hideDatePicker(); // 关闭选择器
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" hidden={true} />

      <View style={styles.outerContainer}>
        {/* 左边的图标列 */}
        <View style={styles.iconColumn}>
          <View>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('TeacherDashboard')}
            >
              <MaterialIcons name="dashboard" size={30} color="black" />
            </TouchableOpacity>
          </View>

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
            assignment && assignment.assignmentTitle ? (
              <TouchableOpacity
                key={assignment.assignmentID}
                style={styles.assignmentCard}
                onPress={() => handleEditAssignment(assignment.assignmentID)}
              >
                <Text style={styles.assignmentName}>{assignment.assignmentTitle}</Text>
                <Text style={styles.dueDate}>Due: {new Date(assignment.dueDateTime).toLocaleString()}</Text>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeAssignment(assignment.assignmentID)} // Call removeAssignment with correct title
                >
                  <MaterialIcons name="delete" size={24} color="red" />
                </TouchableOpacity>
              </TouchableOpacity>
            ) : null // If assignment data is incomplete, don't render
          ))}

          {/* 输入新作业的名称并添加 */}
          <TextInput
            style={styles.input}
            placeholder="Enter Assignment Name"
            value={newAssignmentName}
            onChangeText={setNewAssignmentName}
          />
          <TouchableOpacity style={styles.datePickerButton} onPress={showDatePicker}>
            <Text style={styles.buttonText}>Pick Due Date & Time</Text>
          </TouchableOpacity>

          {/* 日期时间选择器 */}
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="datetime"
            date={defaultDateTime}
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />

          <TouchableOpacity style={styles.addButton} onPress={addAssignment}>
            <Text style={styles.buttonText}>Add Assignment</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

// 样式定义保持不变
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
  bottomIcons: {
    marginTop: 'auto',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  assignmentName: {
    fontSize: 16,
    flex: 1, // 使文本占据剩余空间
  },
  dueDate: {
    fontSize: 14,
    color: 'gray',
  },
  removeButton: {
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
});

export default TeacherAssignment;
