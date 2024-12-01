import React, { useState, useContext } from 'react';
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  View,
  Alert,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { UserContext } from '../../UserContext';
import config from '../../config';

const server = config.apiUrl;

const AddAssignmentPage = () => {
  const navigation = useNavigation();
  const { courseID, semester, sectionID, setAssignmentID } = useContext(UserContext);

  const [newAssignmentName, setNewAssignmentName] = useState('');

  // 设置默认的日期时间为当天的 23:59:59
  const currentDate = new Date();
  currentDate.setHours(23, 59, 59, 999); // 设置小时、分钟、秒和毫秒为 23:59:59.999
  const [dueDateTime, setDueDateTime] = useState(currentDate);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date) => {
    date.setHours(23, 59, 59, 999); // 设置选择的日期时间为 23:59:59.999
    setDueDateTime(date);
    hideDatePicker();
  };

  const addAssignment = async () => {
    if (newAssignmentName.trim() === '') {
      Alert.alert('Error', 'Please provide a valid assignment name.');
      return;
    }

    try {
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
          dueDateTime: dueDateTime.toLocaleString(),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Assignment added successfully!');
        setAssignmentID(data.assignment.assignmentID); // 保存 assignmentID 到上下文
        navigation.navigate('TeacherEditAssignmentQuestion'); // 跳转到编辑问题页面
      } else {
        Alert.alert('Error', data.message || 'Failed to add assignment.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while adding the assignment.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
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

        {/* 右侧内容区域 */}
        <View style={styles.container}>
          <Text style={styles.title}>Add New Assignment</Text>

          {/* 作业名称输入框 */}
          <TextInput
            style={styles.input}
            placeholder="Enter Assignment Name"
            value={newAssignmentName}
            onChangeText={setNewAssignmentName}
          />

          {/* 日期选择器按钮 */}
          <TouchableOpacity style={styles.datePickerButton} onPress={showDatePicker}>
            <Text style={styles.buttonText}>Pick Due Date & Time</Text>
          </TouchableOpacity>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="datetime"
            date={dueDateTime} // 设置默认时间为 23:59:59
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />

          {/* 下一步按钮 */}
          <TouchableOpacity style={styles.addButton} onPress={addAssignment}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
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
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  datePickerButton: {
    padding: 15,
    backgroundColor: '#B3A369',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  addButton: {
    padding: 15,
    backgroundColor: '#B3A369',
    borderRadius: 5,
    alignItems: 'center',
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

export default AddAssignmentPage;
