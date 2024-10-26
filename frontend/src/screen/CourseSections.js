import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, StatusBar, View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons'; // 使用 MaterialIcons 图标
import config from '../../config';
import { UserContext } from '../../UserContext';
const server = config.apiUrl;

const ViewSections = ({ route }) => {
  const navigation = useNavigation();
  
  // 从 UserContext 获取 courseID 和 semester
  const { courseID, semester } = useContext(UserContext);
  const { setSectionID } = useContext(UserContext);

  // 从路由参数获取课程名称
  const { courseTitle } = route.params;

  // State to hold fetched sections
  const [sections, setSections] = useState([]);

  // API 获取 section 信息
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await fetch(`${server}/api/class/getSectionsByCourse/${courseID}/${semester}`);
        const data = await response.json();

        if (response.ok) {
          setSections(data.sections);
        } else {
          Alert.alert('Error', data.message || 'Failed to fetch sections');
        }
      } catch (error) {
        Alert.alert('Error', 'An error occurred while fetching sections.');
      }
    };

    fetchSections(); // 调用 API 获取 section 信息
  }, [courseID, semester]);

  // 点击某个 section 后跳转到 section 详情页面
  const handleSectionClick = (id) => {
    setSectionID(id);
    navigation.navigate('SectionDetail', { sectionId: id });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" hidden={true} />

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
        <ScrollView contentContainerStyle={styles.container}>
          {/* 当前课程名称 */}
          <Text style={styles.courseName}>{courseTitle}</Text>

          {/* 分割线 */}
          <View style={styles.divider} />

          {/* 显示所有 Section */}
          <View style={styles.sectionContainer}>
            {sections.map((section) => (
              <TouchableOpacity
                key={section.sectionID}
                style={styles.sectionCard}
                onPress={() => handleSectionClick(section.sectionID)}
              >
                <Text style={styles.sectionTitle}>{section.sectionID}</Text>
                <Text style={styles.sectionDescription}>{section.sectionDescription}</Text>
              </TouchableOpacity>
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
    backgroundColor: '#B3A369', // 左侧图标列的背景颜色
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingTop: 30, // 保持与 Dashboard 页面的间距一致
    flexDirection: 'column',
  },
  iconButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'transparent', // 保持原始样式
  },
  bottomIcons: {
    marginTop: 'auto', // 将 Back 和 Logout 图标推到底部
  },
  container: {
    flexGrow: 1,
    padding: 10,
    paddingTop: 30,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  courseName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  divider: {
    borderBottomColor: '#B3A369', // 分割线颜色
    borderBottomWidth: 2, // 分割线宽度
    marginBottom: 20, // 与下面内容的间距
  },
  sectionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sectionCard: {
    padding: 20,
    borderWidth: 1,
    borderColor: '#B3A369',
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    width: '45%',
    marginHorizontal: '2.5%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
});

export default ViewSections;
