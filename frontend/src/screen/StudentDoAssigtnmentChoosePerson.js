import React, { useContext, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { UserContext } from '../../UserContext';

const GroupMemberList = () => {
  const navigation = useNavigation();
  const { groupID, groupMembers } = useContext(UserContext);

  // 默认组员数据（如果上下文未提供）
  const members = groupMembers || [
    { username: 'member1', firstName: 'Alice', lastName: 'Johnson' },
    { username: 'member2', firstName: 'Bob', lastName: 'Brown' },
    { username: 'member3', firstName: 'Carol', lastName: 'Davis' },
  ];

  // 用于跟踪已完成的成员
  const [completedMembers, setCompletedMembers] = useState({});

  // 点击组员跳转至 StudentDoAssignment 页面
  const handleMemberClick = (member) => {
    navigation.navigate('StudentDoAssignment', {
      memberID: member.username,
      onComplete: () => handleCompleteForMember(member.username),
    });
  };

  // 更新完成的成员状态
  const handleCompleteForMember = (username) => {
    setCompletedMembers((prev) => ({ ...prev, [username]: true }));
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
          <Text style={styles.subtitle}>Students in Group: {groupID}</Text>

          {members.map((member) => (
            <TouchableOpacity
              key={member.username}
              style={styles.memberCard}
              onPress={() => handleMemberClick(member)}
            >
              <Text style={styles.memberName}>
                {member.firstName} {member.lastName} - {completedMembers[member.username] ? 'Complete' : 'Incomplete'}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Complete 按钮 */}
          <TouchableOpacity style={styles.completeButton} onPress={() => navigation.navigate('StudentCourseDetails')}>
            <Text style={styles.completeButtonText}>Complete</Text>
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