import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {AuthProvider, useAuth} from './context/AuthContext';
import Alokasi from './screens/Alokasi';
import Home from './screens/Home';
import Login from './screens/Login';
import Profil from './screens/Profil';
import Register from './screens/Register';
import DetailAlokasi from './screens/alocation/DetailAlokasi';
import Literatur from './screens/literature/Literatur';
import AddNoteIncome from './screens/note_income/AddNoteIncome';
import DetailNoteIncome from './screens/note_income/DetailNoteIncome';
import EditNoteIncome from './screens/note_income/EditNoteIncome';
import AddNoteOutcome from './screens/note_outcome/AddNoteOutcome';
import DetailNoteOutcome from './screens/note_outcome/DetailNoteOutcome';
import EditNoteOutcome from './screens/note_outcome/EditNoteOutcome';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
}

export const Layout = () => {
  const {authState} = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {authState?.authenticated ? (
          <Stack.Group>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Alokasi" component={Alokasi} />
            <Stack.Screen name="DetailAlokasi" component={DetailAlokasi} />
            <Stack.Screen name="AddNoteIncome" component={AddNoteIncome} />
            <Stack.Screen
              name="DetailNoteIncome"
              component={DetailNoteIncome}
            />
            <Stack.Screen name="EditNoteIncome" component={EditNoteIncome} />
            <Stack.Screen name="AddNoteOutcome" component={AddNoteOutcome} />
            <Stack.Screen
              name="DetailNoteOutcome"
              component={DetailNoteOutcome}
            />
            <Stack.Screen name="EditNoteOutcome" component={EditNoteOutcome} />
            <Stack.Screen name="Literatur" component={Literatur} />
            <Stack.Screen name="Profil" component={Profil} />
          </Stack.Group>
        ) : (
          <Stack.Group>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
