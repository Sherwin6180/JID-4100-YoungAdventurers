import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const StudentSemesterGoals = () => {
  const navigation = useNavigation();
  
  // 本地管理学期目标的阶段
  const [goalStages, setGoalStages] = useState([]);
  const [newGoalText, setNewGoalText] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // 添加新阶段的确认弹窗
  const handleAddGoal = () => {
    if (newGoalText.trim() === '') {
      Alert.alert('Error', 'Please enter a goal.');
      return;
    }

    Alert.alert(
      "Confirm Save",
      "Are you sure you want to save this goal as a new stage?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Save",
          onPress: () => {
            const newGoalStage = {
              id: goalStages.length + 1,
              text: newGoalText,
            };
            setGoalStages([...goalStages, newGoalStage]);
            setNewGoalText('');
            setIsAdding(false);
          },
        },
      ]
    );
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
              onPress={() => navigation.navigate('StudentDashboard')}
            >
              <MaterialIcons name="dashboard" size={30} color="black" />
            </TouchableOpacity>

            {/* Setting 图标 */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('Settings')}
            >
              <MaterialIcons name="settings" size={30} color="black" />
            </TouchableOpacity>
          </View>

          {/* Back 和 Logout 图标，放置在底部 */}
          <View style={styles.bottomIcons}>
            {/* Back 图标 */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons name="arrow-back" size={30} color="black" />
            </TouchableOpacity>

            {/* Logout 图标 */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => {
                Alert.alert(
                  "Confirm Logout",
                  "Are you sure you want to log out?",
                  [
                    {
                      text: "Cancel",
                      style: "cancel"
                    },
                    { 
                      text: "OK", 
                      onPress: () => navigation.navigate('Login') 
                    }
                  ]
                );
              }}
            >
              <MaterialIcons name="logout" size={30} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 主要内容区域 */}
        <View style={styles.content}>
          <Text style={styles.title}>My Semester Goals</Text>

          {/* 目标阶段列表 */}
          <ScrollView contentContainerStyle={styles.goalListContainer}>
            {goalStages.length === 0 ? (
              <Text style={styles.noGoalsText}>No goals added yet.</Text>
            ) : (
              goalStages.map((item) => (
                <View key={item.id}>
                  <View style={styles.goalStage}>
                    <Text style={styles.goalStageText}>Stage {item.id}: {item.text}</Text>
                  </View>
                  {/* 分割线 */}
                  <View style={styles.divider} />
                </View>
              ))
            )}

            {/* 新目标输入框和保存按钮（动态移动至最后一个阶段下方） */}
            {isAdding ? (
              <View style={styles.goalInputContainer}>
                <TextInput
                  style={styles.goalInput}
                  multiline
                  value={newGoalText}
                  onChangeText={setNewGoalText}
                  placeholder="Enter your goals for this stage"
                />
                <TouchableOpacity style={styles.saveButton} onPress={handleAddGoal}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.addButton} onPress={() => setIsAdding(true)}>
                <Text style={styles.addButtonText}>Add New Stage Goal</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
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
  goalListContainer: {
    flexGrow: 1,
  },
  goalStage: {
    backgroundColor: '#f9f9f9',
    borderColor: '#B3A369',
    borderWidth: 1,
    borderRadius: 5,
    padding: 15,
  },
  goalStageText: {
    fontSize: 18,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#B3A369',
    marginVertical: 10,
  },
  goalInputContainer: {
    marginTop: 20,
  },
  goalInput: {
    fontSize: 18,
    color: '#333',
    minHeight: 80,
    backgroundColor: '#f9f9f9',
    borderColor: '#B3A369',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  saveButton: {
    padding: 10,
    backgroundColor: '#B3A369',
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  addButton: {
    padding: 15,
    backgroundColor: '#B3A369',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  noGoalsText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default StudentSemesterGoals;
