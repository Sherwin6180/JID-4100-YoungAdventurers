import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../../UserContext'; // 引入 UserContext 用于获取用户信息
import config from '../../config';

const server = config.apiUrl;
const MyGroup = () => {
  const navigation = useNavigation();
  const { courseID, semester, sectionID, username, firstName, lastName } = useContext(UserContext); // 获取用户上下文信息

  const [groups, setGroups] = useState([]); // 用于存储从后端获取的组信息
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [joinedGroupId, setJoinedGroupId] = useState(null); // 记录用户已加入的组ID

  // 在组件加载时调用 fetchGroups API
  const fetchGroups = async () => {
    try {
      const response = await fetch(`${server}/api/group/fetchGroups/${courseID}/${sectionID}/${semester}`);
      if (!response.ok) {
        throw new Error('Failed to fetch groups');
      }
      const data = await response.json();
      setGroups(data.groups); // 更新组数据
    } catch (error) {
      console.error('Error fetching groups:', error);
      Alert.alert('Error', 'Failed to load groups.');
    }
  };

  useEffect(() => {
    fetchGroups(); // 调用函数获取组信息
  }, [courseID, sectionID, semester]);

  // 选择组并查看组员，或关闭展开的组
  const handleSelectGroup = (group) => {
    if (selectedGroup && selectedGroup.groupID === group.groupID) {
      setSelectedGroup(null);
    } else {
      setSelectedGroup(group);
    }
  };

  // 增加用户到当前组
  const handleJoinGroup = async () => {
    try {
      if (selectedGroup.students.find((member) => member.username === username)) {
        Alert.alert('Error', 'You are already a member of this group.');
        return;
      }
  
      // 调用 joinGroup API
      const response = await fetch(`${server}/api/student/joinGroup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
  
      // 重新获取最新的组信息并更新状态
      await fetchGroups();
  
      // 更新本地状态
      setJoinedGroupId(selectedGroup.groupID);
    } catch (error) {
      console.error('Error joining group:', error);
      Alert.alert('Error', 'Failed to join the group.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.outerContainer}>
        {/* 左边的图标列 */}
        <View style={styles.iconColumn}>
          <View>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('StudentDashboard')}>
              <MaterialIcons name="dashboard" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Settings')}>
              <MaterialIcons name="settings" size={30} color="black" />
            </TouchableOpacity>
          </View>
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

        {/* 主页面内容区域 */}
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>My Groups</Text>

          {/* 组列表 */}
          <View style={styles.groupList}>
            {Array.isArray(groups) && groups.length > 0 ? (
              groups.map((group) => (
                <View key={group.groupID}>
                  <TouchableOpacity
                    style={[
                      styles.groupButton,
                      selectedGroup && selectedGroup.groupID === group.groupID && styles.selectedGroupButton,
                      joinedGroupId === group.groupID && styles.joinedGroupButton,
                    ]}
                    onPress={() => handleSelectGroup(group)}
                  >
                    <Text style={styles.groupButtonText}>{group.groupName}</Text>
                  </TouchableOpacity>

                  {selectedGroup && selectedGroup.groupID === group.groupID && (
                    <View style={styles.groupDetail}>
                      <Text style={styles.groupDetailTitle}>Members of {selectedGroup.groupName}:</Text>
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
          </View>
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
  groupList: {
    marginBottom: 20,
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
  joinedGroupButton: {
    backgroundColor: '#DFF2D8', // 柔和的浅绿色背景
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
    backgroundColor: '#87CEEB', // 柔和的蓝色
    borderRadius: 5,
    alignItems: 'center',
    width: 80,
  },
  leaveButton: {
    padding: 10,
    backgroundColor: '#FFA07A', // 柔和的橙色
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
