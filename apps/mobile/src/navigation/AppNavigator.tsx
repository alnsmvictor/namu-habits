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
  createCheckin,
  deleteHabit,
  getCheckins,
  getHabits,
  removeCheckin,
  updateHabit,
} from '../services/habits';
import {
  CreateHabitData,
  HabitCheckin,
  HabitPeriod,
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

  useEffect(() => {
    if (!user) {
      setHabits([]);
      setCheckins([]);
      return;
    }

    getHabits(user.id)
      .then(async loadedHabits => {
        setHabits(loadedHabits);
        const loadedCheckins = await getCheckins(user.id, loadedHabits);
        setCheckins(loadedCheckins);
      })
      .catch(error => Alert.alert('Erro', error.message));
  }, [user]);

  async function saveHabit(habit: CreateHabitData) {
    if (!user) {
      return false;
    }

    try {
      const createdHabit = await createHabit(user.id, habit);
      setHabits(currentHabits => [...currentHabits, createdHabit]);
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
    period: HabitPeriod,
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
      const checkin = checkins.find(
        item => item.habitId === habitId && item.date === selectedDate,
      );

      if (checkin) {
        await removeCheckin(user.id, habitId, checkin.id);
        setCheckins(currentCheckins =>
          currentCheckins.filter(item => item.id !== checkin.id),
        );
        return;
      }

      const createdCheckin = await createCheckin(user.id, habitId, selectedDate);
      setCheckins(currentCheckins => [...currentCheckins, createdCheckin]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Tente novamente.';
      Alert.alert('Erro', message);
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
      const message = error instanceof Error ? error.message : 'Tente novamente.';
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
                    onUpdateHabit={(title, period) =>
                      saveHabitChanges(selectedHabit.id, title, period)
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
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
