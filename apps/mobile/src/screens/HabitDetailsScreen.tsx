import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@react-native-vector-icons/material-icons/static';
import { fontFamily, fontSize } from '../styles/typography';
import {
  HabitCheckin,
  HabitPeriod,
  UpdateHabitData,
  UserHabit,
} from '../types/habit';

type Props = {
  habit: UserHabit;
  checkins: HabitCheckin[];
  selectedDate: string;
  onBack: () => void;
  onToggleHabit: () => void;
  onUpdateHabit: (habit: UpdateHabitData) => Promise<boolean>;
  onDeleteHabit: () => Promise<boolean>;
};

const periods: HabitPeriod[] = ['MANHA', 'TARDE', 'NOITE'];
const labels = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
const weekDayLabels = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'];
const categories = [
  { icon: 'self-improvement', value: 'mental' },
  { icon: 'water-drop', value: 'sa\u00fade' },
  { icon: 'fitness-center', value: 'exerc\u00edcio' },
  { icon: 'restaurant', value: 'alimenta\u00e7\u00e3o' },
] as const;

function dateKey(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

function getWeekDayIndex(date: string) {
  const day = new Date(`${date}T12:00:00`).getDay();
  return day === 0 ? 6 : day - 1;
}

function HabitDetailsScreen(props: Props) {
  const {
    habit,
    checkins,
    selectedDate,
    onBack,
    onToggleHabit,
    onUpdateHabit,
    onDeleteHabit,
  } = props;
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(habit.title);
  const [description, setDescription] = useState(habit.description ?? '');
  const [period, setPeriod] = useState<HabitPeriod>(habit.period);
  const [category, setCategory] = useState(habit.category);
  const [days, setDays] = useState(habit.weekDays);
  const checkinDates = checkins.map(checkin => checkin.date);
  const today = new Date();
  const week = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - 6 + index);
    const dateValue = dateKey(date);

    return {
      date: dateValue,
      label: labels[date.getDay()],
      isHabitDay: habit.weekDays.includes(getWeekDayIndex(dateValue)),
    };
  });
  const plannedWeekDays = week.filter(day => day.isHabitDay);
  const weekDone = plannedWeekDays.filter(day =>
    checkinDates.includes(day.date),
  ).length;
  const lastThirtyDays = Array.from({ length: 30 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - index);
    return dateKey(date);
  }).filter(date => habit.weekDays.includes(getWeekDayIndex(date)));
  const successRate = Math.round(
    (lastThirtyDays.filter(date => checkinDates.includes(date)).length /
      lastThirtyDays.length) *
      100,
  );
  const completed = checkinDates.includes(selectedDate);
  const isHabitDay = habit.weekDays.includes(getWeekDayIndex(selectedDate));
  const canToggleHabit = isHabitDay || completed;
  const schedule = habit.weekDays.map(day => weekDayLabels[day]).join(', ');
  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0,
  ).getDate();

  async function save() {
    if (!title.trim() || days.length === 0) {
      Alert.alert('Atenção', 'Informe um nome e ao menos um dia da semana.');
      return;
    }

    if (
      await onUpdateHabit({
        title: title.trim(),
        description: description.trim(),
        period,
        category,
        weekDays: days,
        frequency:
          days.length === weekDayLabels.length ? 'di\u00e1rio' : 'semanal',
      })
    ) {
      setEditing(false);
    }
  }

  function toggleDay(day: number) {
    setDays(currentDays =>
      currentDays.includes(day)
        ? currentDays.filter(item => item !== day)
        : [...currentDays, day],
    );
  }

  function remove() {
    Alert.alert('Excluir hábito', 'Essa ação não pode ser desfeita.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => (await onDeleteHabit()) && onBack(),
      },
    ]);
  }

  if (editing) {
    return (
      <SafeAreaView style={styles.safe}>
        <Header title="Editar Hábito" onBack={() => setEditing(false)} />
        <ScrollView
          contentContainerStyle={styles.edit}
          overScrollMode="never"
          bounces={false}
          alwaysBounceVertical={false}
        >
          <Text style={styles.label}>NOME DO HÁBITO</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
          />
          <Text style={styles.label}>DESCRIÇÃO</Text>
          <TextInput
            style={styles.descriptionInput}
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />
          <Text style={styles.label}>CATEGORIA</Text>
          <View style={styles.categories}>
            {categories.map(item => (
              <Pressable
                key={item.value}
                onPress={() => setCategory(item.value)}
                style={[
                  styles.categoryButton,
                  category === item.value && styles.selected,
                ]}
              >
                <MaterialIcons name={item.icon} size={22} color="#17302a" />
              </Pressable>
            ))}
          </View>
          <Text style={styles.label}>PERÍODO DO DIA</Text>
          <View style={styles.periods}>
            {periods.map(item => (
              <Pressable
                key={item}
                onPress={() => setPeriod(item)}
                style={[
                  styles.periodButton,
                  period === item && styles.selected,
                ]}
              >
                <Text style={styles.periodText}>{item}</Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.label}>FREQUÊNCIA SEMANAL</Text>
          <View style={styles.weekDays}>
            {weekDayLabels.map((day, index) => (
              <Pressable
                key={day}
                onPress={() => toggleDay(index)}
                style={styles.weekDayButton}
              >
                <Text numberOfLines={1} style={styles.weekDayText}>
                  {day}
                </Text>
                <View
                  style={[
                    styles.weekDayCircle,
                    days.includes(index) && styles.weekDayCircleSelected,
                  ]}
                >
                  {days.includes(index) && (
                    <MaterialIcons name="check" size={14} color="#ffffff" />
                  )}
                </View>
              </Pressable>
            ))}
          </View>
          <Pressable style={styles.save} onPress={save}>
            <Text style={styles.saveText}>Salvar alterações</Text>
          </Pressable>
          <Pressable style={styles.delete} onPress={remove}>
            <MaterialIcons name="delete-outline" size={20} color="#be3a3a" />
            <Text style={styles.deleteText}>Excluir hábito</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Header
        title="Detalhes do Hábito"
        onBack={onBack}
        action={() => setEditing(true)}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        overScrollMode="never"
        bounces={false}
        alwaysBounceVertical={false}
      >
        <Text style={styles.overline}>DETALHES DO HÁBITO</Text>
        <Text style={styles.title}>{habit.title}</Text>
        <View style={styles.habitCard}>
          <View style={styles.icon}>
            <MaterialIcons name="self-improvement" size={24} color="#0d2721" />
          </View>
          <View style={styles.info}>
            <Text style={styles.badge}>{habit.period}</Text>
            <Text style={styles.name}>{habit.category}</Text>
            <Text style={styles.muted}>Frequência: {habit.frequency}</Text>
            <Text style={styles.muted}>Dias: {schedule}</Text>
          </View>
          <View style={[styles.status, !completed && styles.statusOff]}>
            <MaterialIcons
              name={completed ? 'check' : 'radio-button-unchecked'}
              size={20}
              color={completed ? '#fff' : '#6f7e7a'}
            />
          </View>
        </View>
        <Section
          title="SEMANA"
          detail={weekDone + '/' + plannedWeekDays.length + ' dias'}
        />
        <View style={styles.card}>
          <View style={styles.week}>
            {week.map(day => (
              <View key={day.date} style={styles.weekItem}>
                <Text style={styles.day}>{day.label}</Text>
                <View
                  style={[
                    styles.circle,
                    checkinDates.includes(day.date) && styles.circleDone,
                  ]}
                >
                  {checkinDates.includes(day.date) && (
                    <MaterialIcons name="check" size={16} color="#147d69" />
                  )}
                </View>
              </View>
            ))}
          </View>
          <View style={styles.row}>
            <Text style={styles.muted}>Progresso semanal</Text>
            <Text style={styles.green}>
              {plannedWeekDays.length
                ? Math.round((weekDone / plannedWeekDays.length) * 100)
                : 0}
              % concluído
            </Text>
          </View>
          <View style={styles.track}>
            <View
              style={[
                styles.fill,
                {
                  width:
                    (plannedWeekDays.length
                      ? Math.round((weekDone / plannedWeekDays.length) * 100)
                      : 0) + '%',
                },
              ]}
            />
          </View>
        </View>
        <Section title="CONSISTÊNCIA" detail="Últimos 30 dias" />
        <View style={styles.stats}>
          <Stat value={String(checkins.length)} label="Total de sessões" />
          <Stat value={successRate + '%'} label="Taxa de êxito" />
          <Stat
            value={String(habit.currentStreak ?? 0)}
            label="Dias seguidos"
          />
        </View>
        <Section title="HISTÓRICO MENSAL" detail="Mês atual" />
        <View style={styles.card}>
          <View style={styles.history}>
            {Array.from({ length: daysInMonth }, (_, index) => {
              const date = new Date(
                today.getFullYear(),
                today.getMonth(),
                index + 1,
              );
              const done = checkinDates.includes(dateKey(date));
              return (
                <View
                  key={index}
                  style={[styles.historyDay, done && styles.historyDone]}
                >
                  <Text
                    style={[styles.historyText, done && styles.historyTextDone]}
                  >
                    {index + 1}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Pressable
          disabled={!canToggleHabit}
          style={[styles.complete, !canToggleHabit && styles.completeDisabled]}
          onPress={onToggleHabit}
        >
          <MaterialIcons
            name={completed ? 'task-alt' : 'radio-button-unchecked'}
            size={20}
            color="#083e33"
          />
          <Text style={styles.completeText}>
            {completed
              ? 'Desmarcar hábito'
              : isHabitDay
              ? 'Concluir hábito'
              : 'Hábito não programado'}
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
      <Pressable style={styles.back} onPress={onBack}>
        <MaterialIcons name="arrow-back" size={25} color="#202725" />
      </Pressable>
      <Text style={styles.headerTitle}>{title}</Text>
      {action && (
        <Pressable style={styles.editButton} onPress={action}>
          <Text style={styles.editText}>Editar</Text>
        </Pressable>
      )}
    </View>
  );
}
function Section({ title, detail }: { title: string; detail: string }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.detail}>{detail}</Text>
    </View>
  );
}
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.muted}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8fbfa' },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e8efed',
  },
  back: {
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
  editButton: { padding: 12 },
  editText: {
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
  title: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.title,
    color: '#111816',
    marginTop: 4,
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
  icon: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    backgroundColor: '#c9f7e9',
  },
  info: { flex: 1, marginLeft: 12 },
  badge: {
    alignSelf: 'flex-start',
    fontFamily: fontFamily.body,
    fontSize: fontSize.small,
    color: '#21836f',
    backgroundColor: '#e4faf3',
  },
  name: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.body,
    fontWeight: '700',
    color: '#14221e',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  muted: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.small,
    color: '#71817c',
  },
  status: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
    backgroundColor: '#45ddb9',
  },
  statusOff: { backgroundColor: '#eef3f1' },
  section: {
    flexDirection: 'row',
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
  detail: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.small,
    color: '#337c6c',
  },
  card: { padding: 12, borderRadius: 8, backgroundColor: '#fff', elevation: 2 },
  week: { flexDirection: 'row' },
  weekItem: { width: '14.28%', alignItems: 'center' },
  day: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.small,
    fontWeight: '700',
    color: '#5c726c',
    marginBottom: 6,
  },
  circle: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: '#e9eeee',
  },
  circleDone: { backgroundColor: '#aef1dd' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 },
  green: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.small,
    fontWeight: '700',
    color: '#168a73',
  },
  track: {
    height: 6,
    overflow: 'hidden',
    marginTop: 6,
    borderRadius: 3,
    backgroundColor: '#e2e9e7',
  },
  fill: { height: '100%', borderRadius: 3, backgroundColor: '#2bd3af' },
  stats: { flexDirection: 'row', justifyContent: 'space-between' },
  stat: {
    width: '31%',
    minHeight: 75,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 2,
  },
  value: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.subtitle,
    fontWeight: '800',
    color: '#15211e',
  },
  history: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  historyDay: {
    width: '13%',
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    marginRight: '1.28%',
    borderRadius: 5,
    backgroundColor: '#f0f4f3',
  },
  historyDone: { backgroundColor: '#c5f4e7' },
  historyText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.small,
    color: '#6e7c79',
  },
  historyTextDone: { fontWeight: '700', color: '#157c68' },
  footer: { padding: 12, backgroundColor: '#f8fbfa' },
  complete: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 26,
    backgroundColor: '#23d6af',
    elevation: 4,
  },
  completeDisabled: {
    backgroundColor: '#d7e6e2',
    elevation: 0,
  },
  completeText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.body,
    fontWeight: '700',
    color: '#083e33',
  },
  edit: { flex: 1, padding: 18 },
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
  descriptionInput: {
    minHeight: 76,
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontFamily: fontFamily.body,
    fontSize: fontSize.body,
    color: '#18231f',
    elevation: 2,
  },
  categories: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryButton: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 2,
  },
  periods: { flexDirection: 'row', justifyContent: 'space-between' },
  periodButton: {
    width: '31%',
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 2,
  },
  selected: {
    borderWidth: 1,
    borderColor: '#88e7d2',
    backgroundColor: '#effdf8',
  },
  periodText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.small,
    fontWeight: '700',
    color: '#687773',
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 2,
  },
  weekDayButton: { width: '14.28%', alignItems: 'center' },
  weekDayText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.small,
    fontWeight: '700',
    color: '#687773',
    textAlign: 'center',
    marginBottom: 6,
  },
  weekDayCircle: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
    backgroundColor: '#e7edeb',
  },
  weekDayCircleSelected: { backgroundColor: '#6ae3c6' },
  save: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    borderRadius: 8,
    backgroundColor: '#20d4ae',
    elevation: 3,
  },
  saveText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.body,
    fontWeight: '700',
    color: '#063e32',
  },
  delete: {
    height: 50,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  deleteText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.body,
    fontWeight: '700',
    color: '#be3a3a',
  },
});
export default HabitDetailsScreen;
