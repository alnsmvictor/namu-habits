import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Alert } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import AuthScreen from '../screens/AuthScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import CreateHabitScreen from '../screens/CreateHabitScreen';
import DashboardScreen from '../screens/DashboardScreen';
import HabitDetailsScreen from '../screens/HabitDetailsScreen';
import HabitsScreen from '../screens/HabitsScreen';
import { AuthUser, changePassword } from '../services/auth';
import {
  createHabit,
  createCheckin,
  deleteHabit,
  getDashboard,
  getCheckins,
  getHabits,
  removeCheckin,
  updateHabit,
} from '../services/habits';
import {
  CreateHabitData,
  HabitCheckin,
  UpdateHabitData,
  UserHabit,
} from '../types/habit';

const Stack = createNativeStackNavigator();

function getDateKey(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return date.getFullYear() + '-' + month + '-' + day;
}

function AppNavigator() {
  const [habits, setHabits] = useState<UserHabit[]>([]);
  const [checkins, setCheckins] = useState<HabitCheckin[]>([]);
  const [selectedHabitId, setSelectedHabitId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState(getDateKey(new Date()));
  const [user, setUser] = useState<AuthUser | null>(null);
  const isTogglingHabit = useRef(false);

  useEffect(() => {
    if (!user) {
      setHabits([]);
      setCheckins([]);
      return;
    }

    getHabits(user.id)
      .then(async loadedHabits => {
        const dashboard = await getDashboard(user.id);
        const habitsWithStreak = loadedHabits.map(habit => {
          const dashboardHabit = dashboard.habits.find(
            item => item.id === habit.id,
          );

          return {
            ...habit,
            currentStreak: dashboardHabit?.currentStreak ?? 0,
          };
        });

        setHabits(habitsWithStreak);
        const loadedCheckins = await getCheckins(user.id, loadedHabits);
        setCheckins(loadedCheckins);
      })
      .catch(error => Alert.alert('Erro', error.message));
  }, [user]);

  async function refreshStreaks(currentHabits = habits) {
    if (!user) {
      return;
    }

    try {
      const dashboard = await getDashboard(user.id);

      setHabits(
        currentHabits.map(habit => {
          const dashboardHabit = dashboard.habits.find(
            item => item.id === habit.id,
          );

          return {
            ...habit,
            currentStreak: dashboardHabit?.currentStreak ?? 0,
          };
        }),
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Tente novamente.';
      Alert.alert('Erro', message);
    }
  }

  async function saveHabit(habit: CreateHabitData) {
    if (!user) {
      return false;
    }

    try {
      const createdHabit = await createHabit(user.id, habit);
      setHabits(currentHabits => [
        ...currentHabits,
        { ...createdHabit, currentStreak: 0 },
      ]);
      Alert.alert('Sucesso', 'Hábito criado com sucesso.');
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Tente novamente.';
      Alert.alert('Erro', message);
      return false;
    }
  }

  async function saveHabitChanges(habitId: number, habitData: UpdateHabitData) {
    if (!user) {
      return false;
    }

    try {
      const updatedHabit = await updateHabit(user.id, habitId, habitData);
      const updatedHabits = habits.map(habit =>
        habit.id === habitId
          ? { ...updatedHabit, currentStreak: habit.currentStreak }
          : habit,
      );
      await refreshStreaks(updatedHabits);
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Tente novamente.';
      Alert.alert('Erro', message);
      return false;
    }
  }

  async function toggleHabit(habitId: number) {
    if (!user || isTogglingHabit.current) {
      return;
    }

    isTogglingHabit.current = true;

    try {
      const checkin = checkins.find(
        item => item.habitId === habitId && item.date === selectedDate,
      );

      if (checkin) {
        await removeCheckin(user.id, habitId, checkin.id);
        setCheckins(currentCheckins =>
          currentCheckins.filter(item => item.id !== checkin.id),
        );
        await refreshStreaks();
        return;
      }

      const createdCheckin = await createCheckin(
        user.id,
        habitId,
        selectedDate,
      );
      setCheckins(currentCheckins => [...currentCheckins, createdCheckin]);
      await refreshStreaks();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Tente novamente.';
      Alert.alert('Erro', message);
    } finally {
      isTogglingHabit.current = false;
    }
  }

  async function removeHabit(habitId: number) {
    if (!user) {
      return false;
    }

    try {
      await deleteHabit(user.id, habitId);
      setHabits(currentHabits =>
        currentHabits.filter(habit => habit.id !== habitId),
      );
      setCheckins(currentCheckins =>
        currentCheckins.filter(checkin => checkin.habitId !== habitId),
      );
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Tente novamente.';
      Alert.alert('Erro', message);
      return false;
    }
  }

  async function updatePassword(currentPassword: string, newPassword: string) {
    if (!user) {
      return false;
    }

    try {
      const response = await changePassword(
        user.id,
        currentPassword,
        newPassword,
      );
      Alert.alert('Sucesso', response.message);
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Tente novamente.';
      Alert.alert('Erro', message);
      return false;
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
                  onOpenProfile={() => navigation.navigate('ChangePassword')}
                  onCreateHabit={() => navigation.navigate('CreateHabit')}
                  onOpenHabits={() => navigation.navigate('Habits')}
                  checkins={checkins}
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                  onCompleteHabit={toggleHabit}
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

                return (
                  <HabitDetailsScreen
                    habit={selectedHabit}
                    checkins={checkins.filter(
                      checkin => checkin.habitId === selectedHabit.id,
                    )}
                    selectedDate={selectedDate}
                    onBack={() => navigation.goBack()}
                    onToggleHabit={() => toggleHabit(selectedHabit.id)}
                    onUpdateHabit={habit =>
                      saveHabitChanges(selectedHabit.id, habit)
                    }
                    onDeleteHabit={() => removeHabit(selectedHabit.id)}
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

            <Stack.Screen
              name="ChangePassword"
              options={{
                presentation: 'modal',
                animation: 'slide_from_bottom',
              }}
            >
              {({ navigation }) => (
                <ChangePasswordScreen
                  onBack={() => navigation.goBack()}
                  onChangePassword={updatePassword}
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
