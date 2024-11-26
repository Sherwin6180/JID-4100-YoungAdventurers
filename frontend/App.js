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
import StudentDashboardScreen from './src/screen/StudentDashboard';
import StudentCourseDetailsScreen from './src/screen/StudentCourseDetails';
import StudentDoAssignmentScreen from './src/screen/StudentDoAssignment';
import TeacherEditAssignmentQuestionScreen from './src/screen/TeacherEditAssignmentQuestion';
import StudentSemesterGoalsScreen from './src/screen/StudentSemesterGoals';
import TeacherEditGroupsScreen from './src/screen/TeacherEditGroups';
import StudentGroupsScreen from './src/screen/StudentGroups';
import StudentDoAssignmentChoosePersonScreen from './src/screen/StudentDoAssigtnmentChoosePerson';
import StudentSetGoal from './src/screen/StudentSetGoal';
import StudentEvaluationResults from './src/screen/StudentEvaluationResults';
import TeacherCheckGrades from './src/screen/TeacherCheckGrades';
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

          {/* Student Dashboard Screen*/}
          <Stack.Screen 
            name="StudentDashboard" 
            component={StudentDashboardScreen} 
          /> 

          {/* Student Course Details Screen*/}
          <Stack.Screen 
            name="StudentCourseDetails" 
            component={StudentCourseDetailsScreen} 
          /> 

          {/* Student Do Assignment Screen*/}
          <Stack.Screen 
            name="StudentDoAssignment" 
            component={StudentDoAssignmentScreen} 
          /> 

          {/* Teacher Edit Assignment Question Screen*/}
          <Stack.Screen 
            name="TeacherEditAssignmentQuestion" 
            component={TeacherEditAssignmentQuestionScreen} 
          /> 

          {/* Student Edit Goals Screen*/}
          <Stack.Screen 
            name="StudentSemesterGoals" 
            component={StudentSemesterGoalsScreen} 
          /> 

          {/* Teacher Edit Groups Screen*/}
          <Stack.Screen 
            name="TeacherEditGroups" 
            component={TeacherEditGroupsScreen} 
          /> 

          {/* Student Select Groups Screen*/}
          <Stack.Screen 
            name="StudentGroups" 
            component={StudentGroupsScreen} 
          /> 

          {/* Student Do Assignment Choose Person Screen*/}
          <Stack.Screen 
            name="StudentDoAssignmentChoosePerson" 
            component={StudentDoAssignmentChoosePersonScreen} 
          /> 
          
          {/* Student Set Goal Screen*/}
          <Stack.Screen 
            name="StudentSetGoal" 
            component={StudentSetGoal} 
          /> 

          {/* Student Evaluation Screen*/}
          <Stack.Screen 
            name="StudentEvaluationResults" 
            component={StudentEvaluationResults} 
          /> 

          {/* Teacher Check Grades Screen*/}
          <Stack.Screen 
            name="TeacherCheckGrades" 
            component={TeacherCheckGrades} 
          /> 
        </Stack.Navigator>
      </UserProvider>
    </NavigationContainer>
  );
};

export default App;
