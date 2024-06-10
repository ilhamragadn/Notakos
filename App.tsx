import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';
import NotifService from './NotifService';
import {AuthProvider, useAuth} from './context/AuthContext';
import Alokasi from './screens/Alokasi';
import Home from './screens/Home';
import Literatur from './screens/Literatur';
import Login from './screens/Login';
import Profil from './screens/Profil';
import Register from './screens/Register';
import AddNoteIncome from './screens/note_income/AddNoteIncome';
import DetailNoteIncome from './screens/note_income/DetailNoteIncome';
import EditNoteIncome from './screens/note_income/EditNoteIncome';
import AddNoteOutcome from './screens/note_outcome/AddNoteOutcome';
import DetailNoteOutcome from './screens/note_outcome/DetailNoteOutcome';
import EditNoteOutcome from './screens/note_outcome/EditNoteOutcome';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const notifService = new NotifService(
    token => {
      console.log('Device registered for notifications:', token);
    },
    notification => {
      console.log('Received notification:', notification);
    },
  );

  return (
    <AuthProvider>
      <Layout notifService={notifService} />
    </AuthProvider>
  );
}

export const Layout = ({notifService}: any) => {
  const {authState} = useAuth();

  useEffect(() => {
    console.log('Checking authentication state');
    if (authState?.authenticated) {
      console.log('User authenticated, scheduling notification with sound:');
      notifService.scheduleNotif();
    }
  }, [authState, notifService]);

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
