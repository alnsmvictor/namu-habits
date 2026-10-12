import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@react-native-vector-icons/material-icons/static';
import { fontFamily, fontSize } from '../styles/typography';
import { Habit, HabitPeriod } from '../types/habit';

type Props = {
  habit: Habit;
  onBack: () => void;
  onToggleHabit: () => void;
  onUpdateHabit: (title: string, period: HabitPeriod) => void;
};
type IconName =
  | 'local-fire-department'
  | 'emoji-events'
  | 'track-changes'
  | 'access-alarm'
  | 'spa';

const weekDays = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'S\u00c1B', 'DOM'];
const periods: { key: HabitPeriod; label: string }[] = [
  { key: 'MANHA', label: 'MANH\u00c3' },
  { key: 'TARDE', label: 'TARDE' },
  { key: 'NOITE', label: 'NOITE' },
];
const completedDays = [2, 3, 5, 6, 7, 9, 10, 11, 12, 13, 15];

function HabitDetailsScreen({
  habit,
  onBack,
  onToggleHabit,
  onUpdateHabit,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(habit.title);
  const [period, setPeriod] = useState<HabitPeriod>(habit.period);
  const isMeditation = habit.title.toLowerCase().includes('meditar');

  function saveHabit() {
    if (title.trim()) {
      onUpdateHabit(title.trim(), period);
      setIsEditing(false);
    }
  }

  if (isEditing) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <Header
          title={'Editar H\u00e1bito'}
          onBack={() => setIsEditing(false)}
        />
        <View style={styles.editContent}>
          <Text style={styles.label}>{'NOME DO H\u00c1BITO'}</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
          />
          <Text style={styles.label}>{'PER\u00cdODO DO DIA'}</Text>
          <View style={styles.periodButtons}>
            {periods.map(item => (
              <Pressable
                key={item.key}
                onPress={() => setPeriod(item.key)}
                style={[
                  styles.periodButton,
                  period === item.key && styles.periodButtonSelected,
                ]}
              >
                <Text
                  style={[
                    styles.periodButtonText,
                    period === item.key && styles.periodButtonTextSelected,
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>
          <Pressable style={styles.saveButton} onPress={saveHabit}>
            <Text style={styles.saveButtonText}>
              {'Salvar Altera\u00e7\u00f5es'}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <Header
        title={'Detalhes do H\u00e1bito'}
        onBack={onBack}
        action={() => setIsEditing(true)}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.overline}>{'DETALHES DO H\u00c1BITO'}</Text>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{habit.title}</Text>
          <View style={styles.moreButton}>
            <MaterialIcons name="more-horiz" size={22} color="#66716e" />
          </View>
        </View>
        <View style={styles.habitCard}>
          <View style={styles.habitIconBox}>
            <MaterialIcons name="self-improvement" size={24} color="#0d2721" />
          </View>
          <View style={styles.habitInfo}>
            <Text style={styles.periodBadge}>
              {periods.find(item => item.key === habit.period)?.label}
            </Text>
            <Text style={styles.habitName}>
              {isMeditation
                ? 'Respira\u00e7\u00e3o & Foco'
                : 'Hidrata\u00e7\u00e3o'}
            </Text>
            <Text style={styles.habitMeta}>
              {isMeditation
                ? 'Meta di\u00e1ria: 1 sess\u00e3o'
                : 'Meta di\u00e1ria: 1 registro'}
            </Text>
          </View>
          <View style={styles.doneCircle}>
            <MaterialIcons name="check" size={20} color="#fff" />
          </View>
        </View>

        <SectionHeader title="SEMANA" detail="Meta: 6/7 dias" />
        <View style={styles.card}>
          <View style={styles.weekDays}>
            {weekDays.map((day, index) => {
              const done = index < 4;
              const today = index === 3;
              return (
                <View key={day} style={styles.weekDay}>
                  <Text style={styles.weekDayText}>{day}</Text>
                  <View
                    style={[
                      styles.weekCircle,
                      done && styles.weekCircleDone,
                      today && styles.weekCircleToday,
                    ]}
                  >
                    {done &&
                      (today ? (
                        <Text style={styles.weekCheck}>4</Text>
                      ) : (
                        <MaterialIcons name="check" size={17} color="#147d69" />
                      ))}
                  </View>
                </View>
              );
            })}
          </View>
          <View style={styles.weekProgress}>
            <Text style={styles.mutedText}>Progresso semanal</Text>
            <Text style={styles.greenText}>{'71% Conclu\u00eddo'}</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
        </View>

        <SectionHeader
          title={'CONSIST\u00caNCIA'}
          detail={'\u00daltimos 30 dias'}
        />
        <View style={styles.statsRow}>
          <Stat icon="local-fire-department" value="14" label="Dias seguidos" />
          <Stat icon="emoji-events" value="95%" label={'Taxa de \u00eaxito'} />
          <Stat icon="track-changes" value="42" label={'Total sess\u00f5es'} />
        </View>

        <Text style={styles.sectionTitle}>{'ROTINA & GATILHO'}</Text>
        <View style={styles.card}>
          <Routine
            icon="access-alarm"
            title="Logo ao acordar - 07:30"
            text="Lembrete sonoro suave ativado"
          />
          <Routine
            icon="spa"
            title={'Espa\u00e7o Zen / Quarto'}
            text={'Almofada de medita\u00e7\u00e3o e luz natural'}
          />
        </View>

        <SectionHeader title={'HIST\u00d3RICO MENSAL'} detail="Outubro" />
        <View style={styles.card}>
          <View style={styles.historyWeekDays}>
            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, index) => (
              <Text key={`${day}-${index}`} style={styles.historyWeekDay}>
                {day}
              </Text>
            ))}
          </View>
          <View style={styles.historyGrid}>
            {Array.from({ length: 31 }, (_, index) => index + 1).map(day => {
              const done = completedDays.includes(day);
              const today = day === 15;
              return (
                <View
                  key={day}
                  style={[
                    styles.historyDay,
                    done && styles.historyDayDone,
                    today && styles.historyDayToday,
                  ]}
                >
                  <Text
                    style={[
                      styles.historyDayText,
                      (done || today) && styles.historyDayTextDone,
                    ]}
                  >
                    {day}
                  </Text>
                </View>
              );
            })}
          </View>
          <View style={styles.legend}>
            <Legend color="#c5f4e7" label={'Conclu\u00eddo'} />
            <Legend color="#1bd0aa" label="Hoje" />
            <Legend color="#f0f4f3" label="Restante" />
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Pressable style={styles.completeButton} onPress={onToggleHabit}>
          <MaterialIcons
            name={habit.completed ? 'task-alt' : 'radio-button-unchecked'}
            size={20}
            color="#083e33"
          />
          <Text style={styles.completeButtonText}>
            {habit.completed
              ? 'H\u00e1bito conclu\u00eddo'
              : 'Concluir H\u00e1bito de Hoje'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function Header({
  title,
  onBack,
  action,
}: {
  title: string;
  onBack: () => void;
  action?: () => void;
}) {
  return (
    <View style={styles.header}>
      <Pressable style={styles.backButton} onPress={onBack}>
        <MaterialIcons name="arrow-back" size={25} color="#202725" />
      </Pressable>
      <Text style={styles.headerTitle}>{title}</Text>
      {action && (
        <Pressable style={styles.editButton} onPress={action}>
          <Text style={styles.editButtonText}>Editar</Text>
        </Pressable>
      )}
    </View>
  );
}
function SectionHeader({ title, detail }: { title: string; detail: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionDetail}>{detail}</Text>
    </View>
  );
}
function Stat({
  icon,
  value,
  label,
}: {
  icon: IconName;
  value: string;
  label: string;
}) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statIcon}>
        <MaterialIcons name={icon} size={18} color="#118b73" />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}
function Routine({
  icon,
  title,
  text,
}: {
  icon: IconName;
  title: string;
  text: string;
}) {
  return (
    <View style={styles.routineRow}>
      <View style={styles.routineIcon}>
        <MaterialIcons name={icon} size={19} color="#197e69" />
      </View>
      <View>
        <Text style={styles.routineTitle}>{title}</Text>
        <Text style={styles.routineText}>{text}</Text>
      </View>
    </View>
  );
}
function Legend({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fbfa' },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e8efed',
  },
  backButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontFamily: fontFamily.body,
    fontSize: fontSize.body,
    fontWeight: '700',
    color: '#202725',
  },
  editButton: { padding: 10 },
  editButtonText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.small,
    fontWeight: '700',
    color: '#11977d',
  },
  content: { padding: 16, paddingBottom: 96 },
  overline: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.small,
    color: '#55726b',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    fontFamily: fontFamily.heading,
    fontSize: fontSize.title,
    color: '#111816',
    marginTop: 4,
  },
  moreButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: '#edf1f0',
  },
  habitCard: {
    minHeight: 86,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginTop: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 3,
  },
  habitIconBox: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    backgroundColor: '#c9f7e9',
  },
  habitInfo: { flex: 1, marginLeft: 12 },
  periodBadge: {
    alignSelf: 'flex-start',
    fontFamily: fontFamily.body,
    fontSize: fontSize.small,
    color: '#21836f',
    backgroundColor: '#e4faf3',
  },
  habitName: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.body,
    fontWeight: '700',
    color: '#14221e',
    marginTop: 2,
  },
  habitMeta: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.small,
    color: '#71817c',
    marginTop: 3,
  },
  doneCircle: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
    backgroundColor: '#45ddb9',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.subtitle,
    fontWeight: '800',
    color: '#17211e',
  },
  sectionDetail: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.small,
    color: '#337c6c',
  },
  card: { padding: 12, borderRadius: 8, backgroundColor: '#fff', elevation: 2 },
  weekDays: { flexDirection: 'row' },
  weekDay: { width: '14.2%', alignItems: 'center' },
  weekDayText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.small,
    fontWeight: '700',
    color: '#5c726c',
    marginBottom: 6,
  },
  weekCircle: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: '#e9eeee',
  },
  weekCircleDone: { backgroundColor: '#aef1dd' },
  weekCircleToday: { backgroundColor: '#20d4ae' },
  weekCheck: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.small,
    fontWeight: '800',
    color: '#147d69',
  },
  weekProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  mutedText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.small,
    color: '#61736e',
  },
  greenText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.small,
    fontWeight: '700',
    color: '#168a73',
  },
  progressTrack: {
    height: 6,
    overflow: 'hidden',
    marginTop: 6,
    borderRadius: 3,
    backgroundColor: '#e2e9e7',
  },
  progressFill: {
    width: '71%',
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#2bd3af',
  },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statCard: {
    width: '31%',
    minHeight: 106,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 2,
  },
  statIcon: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: '#d2f8ed',
  },
  statValue: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.subtitle,
    fontWeight: '800',
    color: '#15211e',
    marginTop: 8,
  },
  statLabel: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.small,
    color: '#6f7e7a',
    marginTop: 2,
  },
  routineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  routineIcon: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    backgroundColor: '#cff8ed',
    marginRight: 10,
  },
  routineTitle: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.body,
    fontWeight: '700',
    color: '#1e2e29',
  },
  routineText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.small,
    color: '#73837e',
    marginTop: 3,
  },
  historyWeekDays: { flexDirection: 'row', justifyContent: 'space-between' },
  historyWeekDay: {
    width: 34,
    fontFamily: fontFamily.body,
    fontSize: fontSize.small,
    color: '#6b7d78',
    textAlign: 'center',
  },
  historyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  historyDay: {
    width: 34,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    borderRadius: 5,
    backgroundColor: '#f0f4f3',
  },
  historyDayDone: { backgroundColor: '#c5f4e7' },
  historyDayToday: { backgroundColor: '#1bd0aa' },
  historyDayText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.small,
    color: '#6e7c79',
  },
  historyDayTextDone: { fontWeight: '700', color: '#157c68' },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 4 },
  legendText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.small,
    color: '#74817e',
  },
  footer: { padding: 12, backgroundColor: '#f8fbfa' },
  completeButton: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 26,
    backgroundColor: '#23d6af',
    elevation: 4,
  },
  completeButtonText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.body,
    fontWeight: '700',
    color: '#083e33',
  },
  editContent: { flex: 1, padding: 18 },
  label: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.small,
    fontWeight: '700',
    color: '#47645d',
    marginTop: 18,
    marginBottom: 8,
  },
  input: {
    height: 54,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontFamily: fontFamily.body,
    fontSize: fontSize.body,
    color: '#18231f',
    elevation: 2,
  },
  periodButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  periodButton: {
    width: '31%',
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 2,
  },
  periodButtonSelected: {
    borderWidth: 1,
    borderColor: '#88e7d2',
    backgroundColor: '#effdf8',
  },
  periodButtonText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.small,
    fontWeight: '700',
    color: '#687773',
  },
  periodButtonTextSelected: { color: '#118b73' },
  saveButton: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    borderRadius: 8,
    backgroundColor: '#20d4ae',
    elevation: 3,
  },
  saveButtonText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.body,
    fontWeight: '700',
    color: '#063e32',
  },
});

export default HabitDetailsScreen;
