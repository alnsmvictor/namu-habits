import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState } from 'react';
import CreateHabitScreen from '../screens/CreateHabitScreen';
import AuthScreen from '../screens/AuthScreen';
import DashboardScreen from '../screens/DashboardScreen';
import HabitDetailsScreen from '../screens/HabitDetailsScreen';
import HabitsScreen from '../screens/HabitsScreen';
import { Habit } from '../types/habit';
import { AuthUser } from '../services/auth';

const Stack = createNativeStackNavigator();

const initialHabits: Habit[] = [
  { id: 1, title: 'Meditar 10 minutos', period: 'MANHA', completed: false },
  { id: 2, title: 'Beber 2L de agua', period: 'MANHA', completed: true },
  { id: 3, title: 'Meditar 10 minutos', period: 'TARDE', completed: false },
  { id: 4, title: 'Beber 2L de agua', period: 'TARDE', completed: true },
  { id: 5, title: 'Beber 2L de agua', period: 'NOITE', completed: true },
  { id: 6, title: 'Beber 44L de agua', period: 'NOITE', completed: true },
];

function AppNavigator() {
  const [habits, setHabits] = useState(initialHabits);
  const [selectedHabitId, setSelectedHabitId] = useState<number | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  function toggleHabit(id: number) {
    setHabits(currentHabits =>
      currentHabits.map(habit =>
        habit.id === id ? { ...habit, completed: !habit.completed } : habit,
      ),
    );
  }

  function createHabit(title: string, period: Habit['period']) {
    setHabits(currentHabits => [
      ...currentHabits,
      { id: Date.now(), title, period, completed: false },
    ]);
  }

  function updateHabit(id: number, title: string, period: Habit['period']) {
    setHabits(currentHabits =>
      currentHabits.map(habit =>
        habit.id === id ? { ...habit, title, period } : habit,
      ),
    );
  }

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
                  onCreateHabit={() => navigation.navigate('CreateHabit')}
                  onOpenHabits={() => navigation.navigate('Habits')}
                  onToggleHabit={toggleHabit}
                />
              )}
            </Stack.Screen>

            <Stack.Screen name="Habits">
              {({ navigation }) => (
                <HabitsScreen
                  habits={habits}
                  onBack={() => navigation.goBack()}
                  onOpenHabit={id => {
                    setSelectedHabitId(id);
                    navigation.navigate('HabitDetails');
                  }}
                />
              )}
            </Stack.Screen>

            <Stack.Screen
              name="HabitDetails"
              options={{
                presentation: 'modal',
                animation: 'slide_from_bottom',
              }}
            >
              {({ navigation }) => {
                const habit =
                  habits.find(item => item.id === selectedHabitId) ?? habits[0];

                return (
                  <HabitDetailsScreen
                    habit={habit}
                    onBack={() => navigation.goBack()}
                    onToggleHabit={() => toggleHabit(habit.id)}
                    onUpdateHabit={(title, period) =>
                      updateHabit(habit.id, title, period)
                    }
                  />
                );
              }}
            </Stack.Screen>

            <Stack.Screen
              name="CreateHabit"
              options={{
                presentation: 'modal',
                animation: 'slide_from_bottom',
              }}
            >
              {({ navigation }) => (
                <CreateHabitScreen
                  onBack={() => navigation.goBack()}
                  onCreateHabit={(title, period) => {
                    createHabit(title, period);
                    navigation.goBack();
                  }}
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
