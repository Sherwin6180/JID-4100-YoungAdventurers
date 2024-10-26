import React, { useState, useContext } from 'react';
import { SafeAreaView, StatusBar, View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Modal, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons'; 
import { UserContext } from '../../UserContext';

const TeacherGroupsEdit = () => {
  const navigation = useNavigation();
  const { courseID, semester, sectionID } = useContext(UserContext);

  // 假设的数据结构：初始化一些组和组员信息
  const [groups, setGroups] = useState([
    {
      id: '1',
      name: 'Group A',
      students: [
        { username: 'student1', firstName: 'John', lastName: 'Doe' },
        { username: 'student2', firstName: 'Jane', lastName: 'Smith' },
      ],
    },
    {
      id: '2',
      name: 'Group B',
      students: [
        { username: 'student3', firstName: 'Alice', lastName: 'Johnson' },
        { username: 'student4', firstName: 'Bob', lastName: 'Brown' },
      ],
    },
  ]); 
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // 添加新组
  const addGroup = () => {
    if (newGroupName.trim() === '') {
      Alert.alert('Error', 'Please provide a valid group name.');
      return;
    }

    const newGroup = {
      id: `${groups.length + 1}`, // 简单生成一个新ID
      name: newGroupName,
      students: [],
    };

    setGroups([...groups, newGroup]);
    setNewGroupName('');
    Alert.alert('Success', 'Group added successfully!');
  };

  // 查看组内学生详情
  const viewGroupDetails = (group) => {
    setSelectedGroup(group);
    setModalVisible(true);
  };

  // 从组中移除学生
  const removeStudent = (studentUsername) => {
    if (selectedGroup) {
      const updatedGroup = {
        ...selectedGroup,
        students: selectedGroup.students.filter((student) => student.username !== studentUsername),
      };

      setGroups(groups.map((group) => (group.id === updatedGroup.id ? updatedGroup : group)));
      setSelectedGroup(updatedGroup);
      Alert.alert('Success', 'Student removed from group successfully!');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" hidden={true} />

      <View style={styles.outerContainer}>
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
          <Text style={styles.title}>Edit Groups</Text>

          {/* 显示当前 section 下的所有组 */}
          <Text style={styles.subTitle}>Current Groups:</Text>
          {groups.length === 0 ? (
            <Text style={styles.noGroupsText}>No groups created for this section.</Text>
          ) : (
            groups.map((group) => (
              <View key={group.id} style={styles.groupCard}>
                <Text style={styles.groupName}>{group.name} - {group.students.length} students</Text>
                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() => viewGroupDetails(group)}
                >
                  <Text style={styles.viewButtonText}>View</Text>
                </TouchableOpacity>
              </View>
            ))
          )}

          <View style={styles.divider} />

          <TextInput
            style={styles.input}
            placeholder="Enter Group Name"
            value={newGroupName}
            onChangeText={setNewGroupName}
          />
          <TouchableOpacity style={styles.addButton} onPress={addGroup}>
            <Text style={styles.buttonText}>Add Group</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* 组员详情模态框 */}
      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <SafeAreaView style={styles.modalContainer}>
          {selectedGroup && (
            <>
              <Text style={styles.modalTitle}>{selectedGroup.name}</Text>
              <Text style={styles.modalSubtitle}>Members:</Text>
              
              {/* 组员列表 */}
              {selectedGroup.students.length > 0 ? (
                <FlatList
                  data={selectedGroup.students}
                  keyExtractor={(item) => item.username}
                  renderItem={({ item }) => (
                    <View style={styles.studentRow}>
                      <Text style={styles.studentName}>{item.firstName} {item.lastName}</Text>
                      <TouchableOpacity onPress={() => removeStudent(item.username)}>
                        <Text style={styles.removeButton}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                />
              ) : (
                <Text style={styles.noStudentsText}>No students in this group.</Text>
              )}
            </>
          )}

          {/* 关闭模态框按钮 */}
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

// 样式定义
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
  groupCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  groupName: {
    fontSize: 16,
  },
  viewButton: {
    padding: 10,
    backgroundColor: '#B3A369',
    borderRadius: 5,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: 20,
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
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalSubtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  studentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  studentName: {
    fontSize: 18,
  },
  removeButton: {
    color: 'red',
    fontSize: 16,
  },
  noStudentsText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  closeButton: {
    padding: 15,
    backgroundColor: '#B3A369',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TeacherGroupsEdit;
