import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MaterialIcons } from '@react-native-vector-icons/material-icons/static';
import { SafeAreaView } from 'react-native-safe-area-context';
import HabitCard from '../components/HabitCard';
import { fontFamily, fontSize } from '../styles/typography';
import { HabitCheckin, HabitPeriod, UserHabit } from '../types/habit';

type DashboardScreenProps = {
  habits: UserHabit[];
  userName: string;
  onLogout: () => void;
  onOpenProfile: () => void;
  onCreateHabit: () => void;
  onOpenHabits: () => void;
  checkins: HabitCheckin[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onCompleteHabit: (habitId: number) => void;
};

const periods: { key: HabitPeriod; label: string }[] = [
  { key: 'MANHA', label: 'MANHÃ' },
  { key: 'TARDE', label: 'TARDE' },
  { key: 'NOITE', label: 'NOITE' },
];

function getDateKey(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return date.getFullYear() + '-' + month + '-' + day;
}

function getWeekDays(selectedDate: string) {
  const labels = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
  const selected = new Date(`${selectedDate}T12:00:00`);
  const start = new Date(selected);
  const day = selected.getDay();

  start.setDate(selected.getDate() - (day === 0 ? 6 : day - 1));

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const dateKey = getDateKey(date);

    return {
      label: labels[date.getDay()],
      date: dateKey,
    };
  });
}

function getWeekDayIndex(date: string) {
  const day = new Date(date + 'T12:00:00').getDay();
  return day === 0 ? 6 : day - 1;
}

function DashboardScreen({
  habits,
  userName,
  onLogout,
  onOpenProfile,
  onCreateHabit,
  onOpenHabits,
  checkins,
  selectedDate,
  onSelectDate,
  onCompleteHabit,
}: DashboardScreenProps) {
  const currentDate = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
    .format(new Date(selectedDate + 'T12:00:00'))
    .replace('-', ' ');
  const weekDays = getWeekDays(selectedDate);

  function changeWeek(amount: number) {
    const date = new Date(`${selectedDate}T12:00:00`);
    date.setDate(date.getDate() + amount * 7);
    onSelectDate(getDateKey(date));
  }
  const habitsForSelectedDay = habits.filter(habit =>
    habit.weekDays.includes(getWeekDayIndex(selectedDate)),
  );
  const completedHabitIds = checkins
    .filter(
      checkin =>
        checkin.date === selectedDate &&
        habitsForSelectedDay.some(habit => habit.id === checkin.habitId),
    )
    .map(checkin => checkin.habitId);
  const dailyPercentage = habitsForSelectedDay.length
    ? Math.round((completedHabitIds.length / habitsForSelectedDay.length) * 100)
    : 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Pressable style={styles.logoutButton} onPress={onLogout}>
          <MaterialIcons name="logout" size={22} color="#407168" />
        </Pressable>
        <Image
          source={require('../assets/namu-logo.png')}
          style={styles.logo}
        />
        <Pressable style={styles.profileButton} onPress={onOpenProfile}>
          <MaterialIcons name="person-outline" size={25} color="#ffffff" />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        overScrollMode="never"
        bounces={false}
        alwaysBounceVertical={false}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.currentDate}>
          {currentDate.charAt(0).toUpperCase() + currentDate.slice(1)}
        </Text>
        <Text style={styles.greeting}>Bem vindo, {userName}</Text>

        <View style={styles.weekCard}>
          <Pressable style={styles.weekButton} onPress={() => changeWeek(-1)}>
            <MaterialIcons name="chevron-left" size={22} color="#60716d" />
          </Pressable>
          {weekDays.map(day => (
            <Pressable
              key={day.date}
              onPress={() => onSelectDate(day.date)}
              style={[
                styles.dayItem,
                selectedDate === day.date && styles.dayItemToday,
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  selectedDate === day.date && styles.dayTextToday,
                ]}
              >
                {day.label}
              </Text>
              {checkins.some(checkin => checkin.date === day.date) ? (
                <View style={styles.dayCompleted}>
                  <MaterialIcons name="check" size={13} color="#42cdb0" />
                </View>
              ) : (
                <View style={styles.dayDot} />
              )}
            </Pressable>
          ))}
          <Pressable style={styles.weekButton} onPress={() => changeWeek(1)}>
            <MaterialIcons name="chevron-right" size={22} color="#60716d" />
          </Pressable>
        </View>

        <View style={styles.progressHeader}>
          <Text style={styles.progressText}>{dailyPercentage}% Concluído</Text>
          <View style={styles.counterBadge}>
            <Text style={styles.counterText}>
              {completedHabitIds.length} de {habitsForSelectedDay.length}{' '}
              Hábitos
            </Text>
          </View>
        </View>
        <View style={styles.progressTrack}>
          <View
            style={[styles.progressFill, { width: dailyPercentage + '%' }]}
          />
        </View>

        {habits.length === 0 ? (
          <Text style={styles.emptyText}>
            Você ainda não possui hábitos cadastrados.
          </Text>
        ) : (
          periods.map(period => {
            const periodHabits = habitsForSelectedDay.filter(
              habit => habit.period === period.key,
            );

            if (periodHabits.length === 0) {
              return null;
            }

            return (
              <View key={period.key} style={styles.period}>
                <Text style={styles.periodTitle}>{period.label}</Text>
                {periodHabits.map(habit => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    showCheck
                    completed={completedHabitIds.includes(habit.id)}
                    onPress={() => onCompleteHabit(habit.id)}
                  />
                ))}
              </View>
            );
          })
        )}
      </ScrollView>

      <View style={styles.bottomNav}>
        <View style={styles.navItem}>
          <MaterialIcons name="home" size={25} color="#4d5c51" />
          <Text style={[styles.navLabel, styles.navLabelActive]}>Geral</Text>
        </View>

        <Pressable style={styles.addButton} onPress={onCreateHabit}>
          <MaterialIcons name="add" size={39} color="#ffffff" />
        </Pressable>

        <Pressable style={styles.navItem} onPress={onOpenHabits}>
          <MaterialIcons
            name="check-circle-outline"
            size={25}
            color="#596257"
          />
          <Text style={styles.navLabel}>Hábitos</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fcfcfc' },
  header: {
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#eef2f1',
    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowRadius: 9,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  logoutButton: {
    position: 'absolute',
    left: 16,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: { width: 44, height: 44, resizeMode: 'contain' },
  profileButton: {
    position: 'absolute',
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#49e0be',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingTop: 23,
    paddingBottom: 115,
    backgroundColor: '#fcfcfc',
  },
  scroll: { backgroundColor: '#fcfcfc' },
  greeting: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.display,
    lineHeight: 38,
    color: '#090909',
    marginBottom: 13,
  },
  currentDate: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.small,
    color: '#8a9693',
    marginBottom: 5,
  },
  weekCard: {
    height: 62,
    paddingHorizontal: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 9,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  dayItem: {
    flex: 1,
    height: 47,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  weekButton: {
    width: 24,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayItemToday: { borderWidth: 2, borderColor: '#8ae9d5' },
  dayText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.small,
    fontWeight: '700',
    color: '#9b9b9b',
    marginBottom: 4,
  },
  dayTextToday: { color: '#5e5e5e' },
  dayCompleted: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d4f8ef',
  },
  dayDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#d8d8d8' },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  progressText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.small,
    color: '#8a9693',
  },
  progressTrack: {
    height: 8,
    overflow: 'hidden',
    marginBottom: 14,
    borderRadius: 5,
    backgroundColor: '#dedede',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: '#49e0be',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 14,
  },
  counterBadge: {
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 13,
    backgroundColor: '#c9f6ea',
  },
  counterText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.small,
    fontWeight: '700',
    color: '#199e85',
  },
  sectionTitle: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.subtitle,
    color: '#111111',
  },
  period: { marginBottom: 7 },
  periodTitle: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.subtitle,
    color: '#111111',
    marginBottom: 9,
  },
  emptyText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.body,
    color: '#72807c',
    lineHeight: 22,
  },
  bottomNav: {
    position: 'absolute',
    left: 9,
    right: 9,
    bottom: 17,
    height: 76,
    paddingHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 42,
    borderRadius: 32,
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOpacity: 0.16,
    shadowRadius: 9,
    shadowOffset: { width: 0, height: 3 },
    elevation: 8,
  },
  navItem: { width: 64, alignItems: 'center' },
  navLabel: {
    fontFamily: fontFamily.body,
    marginTop: 3,
    fontSize: fontSize.small,
    color: '#30352f',
  },
  navLabelActive: { fontWeight: '700' },
  addButton: {
    width: 70,
    height: 70,
    marginTop: -38,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 6,
    borderColor: '#ffffff',
    backgroundColor: '#49e0be',
    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
});

export default DashboardScreen;
