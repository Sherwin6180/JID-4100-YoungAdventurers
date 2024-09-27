import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; 
import { useNavigation, useRoute } from '@react-navigation/native';

const SectionDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { courseId, sectionId } = route.params;  // 获取传递过来的课程和章节ID

  return (
    <SafeAreaView style={styles.safeArea}>  
      <View style={styles.container}>
        {/* 左侧任务栏 */}
        <View style={styles.sidebar}>
          <View style={styles.iconContainer}>
            {/* 图标 1: 返回到课程章节 */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons name="arrow-back" size={30} color="black" />
            </TouchableOpacity>

            {/* 图标 2: 返回到教师仪表板 */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('TeacherDashboard')}
            >
              <MaterialIcons name="dashboard" size={30} color="black" />
            </TouchableOpacity>

            {/* 图标 3: 人员管理 */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('TeacherRoster', { courseId, sectionId })}  // 点击跳转到 TeacherRosterEdit 页面，并传递参数
            >
              <MaterialIcons name="person" size={30} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 章节详情内容 */}
        <View style={styles.content}>
          <Text style={styles.title}>Course ID: {courseId}</Text>
          <Text style={styles.subtitle}>Section ID: {sectionId}</Text>
          <Text style={styles.description}>This is the Section Detail Page.</Text>
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 10,
  },
  iconContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
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
  description: {
    fontSize: 16,
  },
});

export default SectionDetail;