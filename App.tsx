import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import Alokasi from './screens/Alokasi';
import Home from './screens/Home';
import Profil from './screens/Profil';
import DetailAlokasi from './screens/alocation/DetailAlokasi';
import Literatur from './screens/literature/Literatur';
import AddNoteIncome from './screens/note_income/AddNoteIncome';
import DetailNoteIncome from './screens/note_income/DetailNoteIncome';
import EditNoteIncome from './screens/note_income/EditNoteIncome';
import AddNoteOutcome from './screens/note_outcome/AddNoteOutcome';
import DetailNoteOutcome from './screens/note_outcome/DetailNoteOutcome';
import EditNoteOutcome from './screens/note_outcome/EditNoteOutcome';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Alokasi" component={Alokasi} />
        <Stack.Screen name="DetailAlokasi" component={DetailAlokasi} />
        <Stack.Screen name="AddNoteIncome" component={AddNoteIncome} />
        <Stack.Screen name="DetailNoteIncome" component={DetailNoteIncome} />
        <Stack.Screen name="EditNoteIncome" component={EditNoteIncome} />
        <Stack.Screen name="AddNoteOutcome" component={AddNoteOutcome} />
        <Stack.Screen name="DetailNoteOutcome" component={DetailNoteOutcome} />
        <Stack.Screen name="EditNoteOutcome" component={EditNoteOutcome} />
        <Stack.Screen name="Literatur" component={Literatur} />

        <Stack.Screen name="Profil" component={Profil} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
