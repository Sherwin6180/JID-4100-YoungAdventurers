import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screen/Login'; // login screen
import CreateAccountScreen from './src/screen/CreateAccount'; // Create Account Screen
import ResetPasswordScreen from './src/screen/ResetPassword'; // Retrieve password screen

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      {/* Initial screen: Login */}
      <Stack.Navigator initialRouteName="Login">

        {/* login screen */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />

        {/* Create Account Screen */}
        <Stack.Screen 
          name="CreateAccount"
          component={CreateAccountScreen}
          options={{ headerShown: false }} 
        />

        {/* Retrieve password screen */}
        <Stack.Screen
          name="ResetPassword"
          component={ResetPasswordScreen}
          options={{ headerShown: false }}  
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
