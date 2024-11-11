import React, { useContext, useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../../UserContext';
import config from '../../config';

const server = config.apiUrl;

const GroupMemberList = () => {
  const navigation = useNavigation();
  const { groupID, assignmentID, username, setSubmissionID } = useContext(UserContext); // 从上下文中获取groupID, assignmentID和用户名
  const [groupMembers, setGroupMembers] = useState([]); // 存储组员数据
  const [groupName, setGroupName] = useState(''); // 存储组的名字

  useEffect(() => {
    fetchGroupMembers(); // 组件加载时调用API获取组员数据
  }, []);

  // 从API获取组员数据
  const fetchGroupMembers = async () => {
    try {
      const response = await fetch(`${server}/api/student/fetchGroupMembersAssignments/${username}/${groupID}/${assignmentID}`);
      const data = await response.json();

      if (response.ok) {
        setGroupMembers(data.evaluations); // 设置组员数据
        setGroupName(data.groupName); // 设置组名
      } else {
        console.log('Failed to load group members', data.message);
      }
    } catch (error) {
      console.error('An error occurred while fetching group members:', error);
    }
  };

  // 点击组员跳转至 StudentDoAssignment 页面
  const handleMemberClick = (member) => {
    setSubmissionID(member.submissionID); // 设置 submissionID
    navigation.navigate('StudentDoAssignment');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.outerContainer}>
        <View style={styles.iconColumn}>
          <View>
            {/* 禁用 Dashboard 和 Back 按钮 */}
            <TouchableOpacity style={styles.iconButton} disabled>
              <MaterialIcons name="dashboard" size={30} color="gray" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} disabled>
              <MaterialIcons name="settings" size={30} color="gray" />
            </TouchableOpacity>
          </View>
          <View style={styles.bottomIcons}>
            <TouchableOpacity style={styles.iconButton} disabled>
              <MaterialIcons name="arrow-back" size={30} color="gray" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Group Members</Text>
          <Text style={styles.subtitle}>Students in {groupName}</Text>

          {groupMembers.length === 0 ? (
            <Text>No group members available.</Text> // 如果没有组员数据
          ) : (
            groupMembers.map((member) => (
              <TouchableOpacity
                key={member.submissionID} // 使用 submissionID 作为 key
                style={styles.memberCard}
                onPress={() => handleMemberClick(member)}
              >
                <Text style={styles.memberName}>
                  {member.fullName} - {member.status === 'in_progress' ? 'Incomplete' : 'Complete'}
                </Text>
              </TouchableOpacity>
            ))
          )}

          {/* Complete 按钮 */}
          <TouchableOpacity style={styles.completeButton} onPress={() => navigation.navigate('StudentCourseDetails')}>
            <Text style={styles.completeButtonText}>Return</Text>
          </TouchableOpacity>
        </ScrollView>
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
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  memberCard: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderColor: '#B3A369',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  memberName: {
    fontSize: 18,
  },
  completeButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#6ca06c',
    borderRadius: 8,
    alignItems: 'center',
  },
  completeButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default GroupMemberList;