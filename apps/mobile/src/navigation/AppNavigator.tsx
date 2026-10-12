import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Alert } from 'react-native';
import { useEffect, useState } from 'react';
import AuthScreen from '../screens/AuthScreen';
import DashboardScreen from '../screens/DashboardScreen';
import HabitsScreen from '../screens/HabitsScreen';
import { AuthUser } from '../services/auth';
import { getHabits } from '../services/habits';
import { UserHabit } from '../types/habit';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const [habits, setHabits] = useState<UserHabit[]>([]);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (!user) {
      setHabits([]);
      return;
    }

    getHabits(user.id)
      .then(setHabits)
      .catch(error => Alert.alert('Erro', error.message));
  }, [user]);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Login">
              {({ navigation }) => (
                <AuthScreen
                  mode="login"
                  onSuccess={setUser}
                  onChangeMode={() => navigation.navigate('Register')}
                />
              )}
            </Stack.Screen>

            <Stack.Screen name="Register">
              {({ navigation }) => (
                <AuthScreen
                  mode="register"
                  onSuccess={setUser}
                  onChangeMode={() => navigation.goBack()}
                />
              )}
            </Stack.Screen>
          </>
        ) : (
          <>
            <Stack.Screen name="Dashboard">
              {({ navigation }) => (
                <DashboardScreen
                  habits={habits}
                  userName={user.name}
                  onLogout={() => setUser(null)}
                  onCreateHabit={() =>
                    Alert.alert(
                      'Em breve',
                      'A criação de hábitos será conectada à API na próxima etapa.',
                    )
                  }
                  onOpenHabits={() => navigation.navigate('Habits')}
                />
              )}
            </Stack.Screen>

            <Stack.Screen name="Habits">
              {({ navigation }) => (
                <HabitsScreen
                  habits={habits}
                  onBack={() => navigation.goBack()}
                />
              )}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
