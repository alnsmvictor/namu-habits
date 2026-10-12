import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@react-native-vector-icons/material-icons/static';
import HabitCard from '../components/HabitCard';
import { fontFamily, fontSize } from '../styles/typography';
import { UserHabit } from '../types/habit';

type Props = {
  habits: UserHabit[];
  onBack: () => void;
};

function HabitsScreen({ habits, onBack }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <MaterialIcons name="arrow-back" size={25} color="#1a211f" />
        </Pressable>
        <Text style={styles.headerTitle}>{'H\u00e1bitos'}</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.overline}>{'TODOS OS H\u00c1BITOS'}</Text>
        <Text style={styles.title}>Sua rotina</Text>
        <Text
          style={styles.subtitle}
        >{`${habits.length} h\u00e1bitos cadastrados`}</Text>
        <View style={styles.list}>
          {habits.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum hábito cadastrado ainda.</Text>
          ) : (
            habits.map(habit => <HabitCard key={habit.id} habit={habit} />)
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fbfa' },
  header: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#edf1f0',
  },
  backButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.body,
    fontWeight: '700',
    color: '#1a211f',
  },
  content: { padding: 18, paddingBottom: 36 },
  overline: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.small,
    fontWeight: '700',
    color: '#2b9f86',
  },
  title: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.title,
    color: '#101514',
    marginTop: 3,
  },
  subtitle: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.small,
    color: '#74807d',
    marginTop: 4,
  },
  list: { marginTop: 22 },
  emptyText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.body,
    color: '#74807d',
  },
});

export default HabitsScreen;
