import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screen/Login'; // login screen
import CreateAccountScreen from './src/screen/CreateAccount'; // Create Account Screen
import ResetPasswordScreen from './src/screen/ResetPassword'; // Retrieve password screen
import SecurityQuestionsScreen from './src/screen/setVarifyQuestion'; // set security question screen
import TeacherDashboardScreen from './src/screen/TeacherDashboard'; // teacherDashboard screen
import CourseSectionsScreen from './src/screen/CourseSections'; // course section screen

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      {/* Initial screen: Login */}
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          animation: 'none',  // 禁用页面跳转动画
          headerShown: false  // 不显示顶部导航栏
        }}
      >

        {/* login screen */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
        />

        {/* Create Account Screen */}
        <Stack.Screen 
          name="CreateAccount"
          component={CreateAccountScreen}
        />

        {/* Retrieve password screen */}
        <Stack.Screen
          name="ResetPassword"
          component={ResetPasswordScreen}
        />

        {/* Security Questions Screen */}
        <Stack.Screen
          name="SecurityQuestions"
          component={SecurityQuestionsScreen}
        />

        {/* Teacher user Dashboard screen */}
        <Stack.Screen
          name="TeacherDashboard"
          component={TeacherDashboardScreen}
        />

        {/* Course Sections screen */}
        <Stack.Screen 
          name="CourseSections" 
          component={CourseSectionsScreen}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
