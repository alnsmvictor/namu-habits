import { useState } from 'react';
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
import { UserHabit } from '../types/habit';

type DashboardScreenProps = {
  habits: UserHabit[];
  userName: string;
  onLogout: () => void;
  onCreateHabit: () => void;
  onOpenHabits: () => void;
};

const navigationItems = [
  { label: 'Geral', icon: 'home' },
  { label: 'Hábitos', icon: 'check-circle-outline' },
  { label: 'Progresso', icon: 'trending-up' },
  { label: 'Jornada', icon: 'emoji-events' },
] as const;

function DashboardScreen({
  habits,
  userName,
  onLogout,
  onCreateHabit,
  onOpenHabits,
}: DashboardScreenProps) {
  const [selectedTab, setSelectedTab] = useState('Geral');

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
        <View style={styles.profileButton}>
          <MaterialIcons name="person-outline" size={25} color="#ffffff" />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.greeting}>Bem vindo, {userName}</Text>

        <View style={styles.listHeader}>
          <Text style={styles.periodTitle}>SEUS HÁBITOS</Text>
          <View style={styles.counterBadge}>
            <Text style={styles.counterText}>{`${habits.length} cadastrados`}</Text>
          </View>
        </View>

        {habits.length === 0 ? (
          <Text style={styles.emptyText}>
            Você ainda não possui hábitos cadastrados.
          </Text>
        ) : (
          habits.map(habit => <HabitCard key={habit.id} habit={habit} />)
        )}
      </ScrollView>

      <View style={styles.bottomNav}>
        {navigationItems.slice(0, 2).map(item => (
          <Pressable
            key={item.label}
            style={styles.navItem}
            onPress={() =>
              item.label === 'Hábitos'
                ? onOpenHabits()
                : setSelectedTab(item.label)
            }
          >
            <MaterialIcons
              name={item.icon}
              size={25}
              color={selectedTab === item.label ? '#4d5c51' : '#596257'}
            />
            <Text
              style={[
                styles.navLabel,
                selectedTab === item.label && styles.navLabelActive,
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        ))}

        <Pressable style={styles.addButton} onPress={onCreateHabit}>
          <MaterialIcons name="add" size={39} color="#ffffff" />
        </Pressable>

        {navigationItems.slice(2).map(item => (
          <Pressable
            key={item.label}
            style={styles.navItem}
            onPress={() => setSelectedTab(item.label)}
          >
            <MaterialIcons
              name={item.icon}
              size={25}
              color={selectedTab === item.label ? '#4d5c51' : '#596257'}
            />
            <Text
              style={[
                styles.navLabel,
                selectedTab === item.label && styles.navLabelActive,
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
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
    paddingHorizontal: 18,
    paddingTop: 23,
    paddingBottom: 115,
    backgroundColor: '#fcfcfc',
  },
  greeting: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.display,
    lineHeight: 38,
    color: '#090909',
    marginBottom: 13,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  periodTitle: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.subtitle,
    color: '#111111',
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
    justifyContent: 'space-between',
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
