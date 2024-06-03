import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AuthContext from '../context/AuthContext';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import EquipesScreen from '../screens/EquipesScreen';
import ProjetsScreen from '../screens/ProjetsScreen';
import ProfilScreen from '../screens/ProfilScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AppTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Équipes" component={EquipesScreen} />
      <Tab.Screen name="Projets" component={ProjetsScreen} />
      <Tab.Screen name="Profil" component={ProfilScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { userToken } = useContext(AuthContext);

  return (
    <NavigationContainer>
      {userToken ? (
        <AppTabs />
      ) : (
        <Stack.Navigator initialRouteName="SignIn">
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
