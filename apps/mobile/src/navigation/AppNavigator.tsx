import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Alert } from 'react-native';
import { useEffect, useState } from 'react';
import AuthScreen from '../screens/AuthScreen';
import CreateHabitScreen from '../screens/CreateHabitScreen';
import DashboardScreen from '../screens/DashboardScreen';
import HabitDetailsScreen from '../screens/HabitDetailsScreen';
import HabitsScreen from '../screens/HabitsScreen';
import { AuthUser } from '../services/auth';
import {
  createHabit,
  createTodayCheckin,
  getDashboard,
  getHabits,
  getTodayCheckins,
  removeTodayCheckin,
  updateHabit,
} from '../services/habits';
import {
  CreateHabitData,
  DashboardData,
  Habit,
  UserHabit,
} from '../types/habit';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const [habits, setHabits] = useState<UserHabit[]>([]);
  const [todayCheckins, setTodayCheckins] = useState<Record<number, number>>(
    {},
  );
  const [dashboard, setDashboard] = useState<DashboardData>({
    weeklyCompletionPercentage: 0,
    weekDays: [],
  });
  const [selectedHabitId, setSelectedHabitId] = useState<number | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (!user) {
      setHabits([]);
      setTodayCheckins({});
      setDashboard({ weeklyCompletionPercentage: 0, weekDays: [] });
      return;
    }

    getHabits(user.id)
      .then(async loadedHabits => {
        setHabits(loadedHabits);
        const checkins = await getTodayCheckins(user.id, loadedHabits);
        setTodayCheckins(checkins);
      })
      .catch(error => Alert.alert('Erro', error.message));

    getDashboard(user.id)
      .then(setDashboard)
      .catch(error => Alert.alert('Erro', error.message));
  }, [user]);

  async function refreshDashboard() {
    if (!user) {
      return;
    }

    try {
      const dashboardData = await getDashboard(user.id);
      setDashboard(dashboardData);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Tente novamente.';
      Alert.alert('Erro', message);
    }
  }

  async function saveHabit(habit: CreateHabitData) {
    if (!user) {
      return false;
    }

    try {
      const createdHabit = await createHabit(user.id, habit);
      setHabits(currentHabits => [...currentHabits, createdHabit]);
      refreshDashboard();
      Alert.alert('Sucesso', 'Hábito criado com sucesso.');
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Tente novamente.';
      Alert.alert('Erro', message);
      return false;
    }
  }

  async function saveHabitChanges(
    habitId: number,
    title: string,
    period: Habit['period'],
  ) {
    if (!user) {
      return false;
    }

    try {
      const updatedHabit = await updateHabit(user.id, habitId, {
        title,
        period,
      });
      setHabits(currentHabits =>
        currentHabits.map(habit =>
          habit.id === habitId ? updatedHabit : habit,
        ),
      );
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Tente novamente.';
      Alert.alert('Erro', message);
      return false;
    }
  }

  async function toggleHabit(habitId: number) {
    if (!user) {
      return;
    }

    try {
      const checkinId = todayCheckins[habitId];

      if (checkinId) {
        await removeTodayCheckin(user.id, habitId, checkinId);
        setTodayCheckins(currentCheckins => {
          const updatedCheckins = { ...currentCheckins };
          delete updatedCheckins[habitId];
          return updatedCheckins;
        });
        refreshDashboard();
        return;
      }

      const checkin = await createTodayCheckin(user.id, habitId);
      setTodayCheckins(currentCheckins => ({
        ...currentCheckins,
        [habitId]: checkin.id,
      }));
      refreshDashboard();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Tente novamente.';
      Alert.alert('Erro', message);
    }
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
                  completedHabitIds={Object.keys(todayCheckins).map(Number)}
                  onCompleteHabit={toggleHabit}
                  weeklyCompletionPercentage={
                    dashboard.weeklyCompletionPercentage
                  }
                  weekDays={dashboard.weekDays}
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
                const selectedHabit = habits.find(
                  habit => habit.id === selectedHabitId,
                );

                if (!selectedHabit) {
                  return null;
                }

                const habit: Habit = {
                  id: selectedHabit.id,
                  title: selectedHabit.title,
                  period: selectedHabit.period,
                  completed: Boolean(todayCheckins[selectedHabit.id]),
                };

                return (
                  <HabitDetailsScreen
                    habit={habit}
                    onBack={() => navigation.goBack()}
                    onToggleHabit={() => toggleHabit(habit.id)}
                    onUpdateHabit={(title, period) =>
                      saveHabitChanges(habit.id, title, period)
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
                  onCreateHabit={saveHabit}
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
