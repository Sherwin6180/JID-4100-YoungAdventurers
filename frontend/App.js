import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screen/Login'; // login screen
import CreateAccountScreen from './src/screen/CreateAccount'; // Create Account Screen
import ResetPasswordScreen from './src/screen/ResetPassword'; // Retrieve password screen
import SecurityQuestionsScreen from './src/screen/setVarifyQuestion'; // set security question screen
import TeacherDashboardScreen from './src/screen/TeacherDashboard'; // teacherDashboard screen
import CourseSectionsScreen from './src/screen/CourseSections'; // course section screen
import TeacherEditScreen from './src/screen/TeacherEdit';
import TeacherRosterScreen from './src/screen/TeacherRoster';
import SectionDetailScreen from './src/screen/SectionDetails';
import TeacherAssignmentScreen from './src/screen/TeacherAssignment';
import { UserContext, UserProvider } from './UserContext';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <UserProvider>

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
          
          {/* Teacher Edit Screen */}
          <Stack.Screen 
            name="TeacherEdit" 
            component={TeacherEditScreen}
          />

          {/* Teacher Roster Screen*/}
          <Stack.Screen 
            name="TeacherRoster" 
            component={TeacherRosterScreen}
          />
          
          {/* Section Detail Screen*/}
          <Stack.Screen 
            name="SectionDetail" 
            component={SectionDetailScreen} 
          /> 

          {/* Teacher Assignment Screen*/}
          <Stack.Screen 
            name="TeacherAssignment" 
            component={TeacherAssignmentScreen} 
          /> 
        </Stack.Navigator>
      </UserProvider>
    </NavigationContainer>
  );
};

export default App;
