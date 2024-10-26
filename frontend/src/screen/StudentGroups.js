import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// 假设数据结构，包含一些已有的组和组员
const initialGroupsData = [
  {
    id: 'group1',
    name: 'Project Team A',
    members: [{ username: 'alice', firstName: 'Alice', lastName: 'Johnson' }],
  },
  {
    id: 'group2',
    name: 'Research Group B',
    members: [
      { username: 'bob', firstName: 'Bob', lastName: 'Brown' },
      { username: 'carol', firstName: 'Carol', lastName: 'Davis' },
    ],
  },
];

const MyGroup = () => {
  const navigation = useNavigation();
  const [groups, setGroups] = useState(initialGroupsData);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [user] = useState({ username: 'student1', firstName: 'John', lastName: 'Doe' });
  const [joinedGroupId, setJoinedGroupId] = useState(null); // 记录用户已加入的组ID

  // 选择组并查看组员，或关闭展开的组
  const handleSelectGroup = (group) => {
    // 如果再次点击已展开的组，则关闭它
    if (selectedGroup && selectedGroup.id === group.id) {
      setSelectedGroup(null);
    } else {
      setSelectedGroup(group);
    }
  };

  // 增加用户到当前组
  const handleJoinGroup = () => {
    if (selectedGroup.members.find((member) => member.username === user.username)) {
      Alert.alert('Error', 'You are already a member of this group.');
      return;
    }

    const updatedGroups = groups.map((group) => {
      if (group.id === selectedGroup.id) {
        return {
          ...group,
          members: [...group.members, user],
        };
      }
      return group;
    });

    setGroups(updatedGroups);
    setSelectedGroup({
      ...selectedGroup,
      members: [...selectedGroup.members, user],
    });
    setJoinedGroupId(selectedGroup.id); // 设置已加入的组ID
  };

  // 从当前组删除用户
  const handleLeaveGroup = () => {
    if (!selectedGroup.members.find((member) => member.username === user.username)) {
      Alert.alert('Error', 'You are not a member of this group.');
      return;
    }

    const updatedGroups = groups.map((group) => {
      if (group.id === selectedGroup.id) {
        return {
          ...group,
          members: group.members.filter((member) => member.username !== user.username),
        };
      }
      return group;
    });

    setGroups(updatedGroups);
    setSelectedGroup({
      ...selectedGroup,
      members: selectedGroup.members.filter((member) => member.username !== user.username),
    });
    setJoinedGroupId(null); // 清空已加入的组ID
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
            {groups.map((group) => (
              <View key={group.id}>
                <TouchableOpacity
                  style={[
                    styles.groupButton,
                    selectedGroup && selectedGroup.id === group.id && styles.selectedGroupButton,
                    joinedGroupId === group.id && styles.joinedGroupButton, // 已加入的组使用不同颜色
                  ]}
                  onPress={() => handleSelectGroup(group)}
                >
                  <Text style={styles.groupButtonText}>{group.name}</Text>
                </TouchableOpacity>

                {/* 如果当前组是选定的组，则显示组员名单 */}
                {selectedGroup && selectedGroup.id === group.id && (
                  <View style={styles.groupDetail}>
                    <Text style={styles.groupDetailTitle}>Members of {selectedGroup.name}:</Text>
                    {selectedGroup.members.map((member) => (
                      <Text key={member.username} style={styles.memberText}>
                        {member.firstName} {member.lastName}
                      </Text>
                    ))}

                    {/* 右对齐显示的加入或退出按钮 */}
                    <View style={styles.buttonContainer}>
                      {joinedGroupId === group.id ? (
                        <TouchableOpacity style={styles.leaveButton} onPress={handleLeaveGroup}>
                          <Text style={styles.buttonText}>Leave</Text>
                        </TouchableOpacity>
                      ) : (
                        !joinedGroupId && (
                          <TouchableOpacity style={styles.joinButton} onPress={handleJoinGroup}>
                            <Text style={styles.buttonText}>Join</Text>
                          </TouchableOpacity>
                        )
                      )}
                    </View>
                  </View>
                )}
              </View>
            ))}
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
