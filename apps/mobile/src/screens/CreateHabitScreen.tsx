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
import { CreateHabitData, HabitPeriod } from '../types/habit';

type Props = {
  onBack: () => void;
  onCreateHabit: (habit: CreateHabitData) => Promise<boolean>;
};
const categories = [
  { icon: 'self-improvement', value: 'mental' },
  { icon: 'water-drop', value: 'sa\u00fade' },
  { icon: 'fitness-center', value: 'exerc\u00edcio' },
  { icon: 'menu-book', value: 'mental' },
  { icon: 'directions-run', value: 'exerc\u00edcio' },
] as const;
const periods = [
  { key: 'MANHA', label: 'MANH\u00c3', icon: 'wb-sunny' },
  { key: 'TARDE', label: 'TARDE', icon: 'light-mode' },
  { key: 'NOITE', label: 'NOITE', icon: 'nights-stay' },
] as const;
const weekDays = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'S\u00c1B', 'DOM'];

function CreateHabitScreen({ onBack, onCreateHabit }: Props) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(0);
  const [period, setPeriod] = useState<HabitPeriod>('MANHA');
  const [days, setDays] = useState([0, 1, 2, 3, 4, 5, 6]);
  const [isSaving, setIsSaving] = useState(false);
  const toggleDay = (index: number) =>
    setDays(current =>
      current.includes(index)
        ? current.filter(day => day !== index)
        : [...current, index],
    );
  const toggleAll = () =>
    setDays(days.length === weekDays.length ? [] : [0, 1, 2, 3, 4, 5, 6]);
  async function create() {
    if (!title.trim() || isSaving) {
      return;
    }

    setIsSaving(true);

    const created = await onCreateHabit({
      title: title.trim(),
      period,
      frequency: days.length === weekDays.length ? 'di\u00e1rio' : 'semanal',
      category: categories[category].value,
    });

    setIsSaving(false);

    if (created) {
      onBack();
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <MaterialIcons name="arrow-back" size={25} color="#202725" />
        </Pressable>
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.overline}>NOVA ROTINA</Text>
            <Text style={styles.title}>{'Criar H\u00e1bito'}</Text>
          </View>
          <View style={styles.titleIcon}>
            <MaterialIcons name="spa" size={23} color="#20caa6" />
          </View>
        </View>
        <Text style={styles.label}>{'NOME DO H\u00c1BITO'}</Text>
        <View style={styles.inputBox}>
          <MaterialIcons name="edit" size={18} color="#1dc7a4" />
          <TextInput
            style={styles.input}
            placeholder="Ex.: Meditar 10 minutos"
            placeholderTextColor="#a1aaa8"
            value={title}
            onChangeText={setTitle}
          />
        </View>
        <View style={styles.sectionHeader}>
          <Text style={styles.label}>{'\u00cdCONE E CATEGORIA'}</Text>
          <Text style={styles.selectedText}>Selecionado</Text>
        </View>
        <View style={styles.categoryList}>
          {categories.map((item, index) => (
            <Pressable
              key={item.icon}
              onPress={() => setCategory(index)}
              style={[
                styles.categoryButton,
                category === index && styles.categoryButtonSelected,
              ]}
            >
              <MaterialIcons name={item.icon} size={21} color="#17201d" />
            </Pressable>
          ))}
        </View>
        <Text style={styles.label}>{'PER\u00cdODO DO DIA'}</Text>
        <View style={styles.periodList}>
          {periods.map(item => (
            <Pressable
              key={item.key}
              onPress={() => setPeriod(item.key)}
              style={[
                styles.periodButton,
                period === item.key && styles.periodButtonSelected,
              ]}
            >
              <View
                style={[
                  styles.periodIcon,
                  period === item.key && styles.periodIconSelected,
                ]}
              >
                <MaterialIcons name={item.icon} size={19} color="#408378" />
              </View>
              <Text
                style={[
                  styles.periodText,
                  period === item.key && styles.periodTextSelected,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.sectionHeader}>
          <Text style={styles.label}>{'FREQU\u00caNCIA SEMANAL'}</Text>
          <Pressable onPress={toggleAll}>
            <Text style={styles.selectedText}>Todos os dias</Text>
          </Pressable>
        </View>
        <View style={styles.frequencyCard}>
          {weekDays.map((day, index) => (
            <Pressable
              key={day}
              style={styles.dayButton}
              onPress={() => toggleDay(index)}
            >
              <Text style={styles.dayText}>{day}</Text>
              <View
                style={[
                  styles.dayCircle,
                  days.includes(index) && styles.dayCircleSelected,
                ]}
              >
                {days.includes(index) && (
                  <MaterialIcons name="check" size={14} color="#fff" />
                )}
              </View>
            </Pressable>
          ))}
        </View>
        <Pressable
          style={[
            styles.createButton,
            (!title.trim() || isSaving) && styles.createButtonDisabled,
          ]}
          onPress={create}
        >
          <MaterialIcons name="add-circle-outline" size={20} color="#073c32" />
          <Text style={styles.createButtonText}>
            {isSaving ? 'Criando...' : 'Criar H\u00e1bito'}
          </Text>
        </Pressable>
        <Pressable onPress={onBack}>
          <Text style={styles.cancelText}>Cancelar e Voltar</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f7fbfa' },
  header: {
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e8efed',
  },
  backButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { padding: 16, paddingBottom: 28 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  overline: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.small,
    color: '#5d827a',
  },
  title: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.title,
    color: '#101514',
    marginTop: 3,
  },
  titleIcon: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 21,
    backgroundColor: '#cef8eb',
  },
  label: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.small,
    fontWeight: '700',
    color: '#39544e',
    marginBottom: 8,
  },
  inputBox: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 18,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 2,
  },
  input: {
    flex: 1,
    marginLeft: 9,
    padding: 0,
    fontFamily: fontFamily.body,
    fontSize: fontSize.body,
    color: '#111615',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.small,
    fontWeight: '700',
    color: '#188d77',
    marginBottom: 8,
  },
  categoryList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  categoryButton: {
    width: 44,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 2,
  },
  categoryButtonSelected: { backgroundColor: '#bff6e7' },
  periodList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  periodButton: {
    width: '31%',
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 2,
  },
  periodButtonSelected: {
    borderWidth: 1,
    borderColor: '#9aeed9',
    backgroundColor: '#fbfffe',
  },
  periodIcon: {
    width: 27,
    height: 27,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: '#edf2f1',
  },
  periodIconSelected: { backgroundColor: '#c7f7e9' },
  periodText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.small,
    fontWeight: '700',
    color: '#35413e',
    marginTop: 6,
  },
  periodTextSelected: { color: '#11987e' },
  frequencyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 28,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 2,
  },
  dayButton: { width: 28, alignItems: 'center' },
  dayText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.small,
    fontWeight: '700',
    color: '#6b807b',
    marginBottom: 6,
  },
  dayCircle: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
    backgroundColor: '#e7edeb',
  },
  dayCircleSelected: { backgroundColor: '#6ae3c6' },
  createButton: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    borderRadius: 8,
    backgroundColor: '#20d5ae',
    elevation: 4,
  },
  createButtonDisabled: { backgroundColor: '#8fe9d4' },
  createButtonText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.body,
    fontWeight: '700',
    color: '#073c32',
  },
  cancelText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.small,
    color: '#59716b',
    textAlign: 'center',
    marginTop: 14,
  },
});

export default CreateHabitScreen;
