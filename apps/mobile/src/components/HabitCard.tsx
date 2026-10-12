import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@react-native-vector-icons/material-icons/static';
import { fontFamily, fontSize } from '../styles/typography';
import { UserHabit } from '../types/habit';

type HabitCardProps = {
  habit: UserHabit;
  onPress?: () => void;
};

function HabitCard({ habit, onPress }: HabitCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.iconBox}>
        <MaterialIcons name="self-improvement" size={24} color="#08231c" />
      </View>
      <Text style={styles.title}>{habit.title}</Text>
      <View style={styles.category}>
        <Text style={styles.categoryText}>{habit.category}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  iconBox: {
    width: 49,
    height: 49,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#cff9ee',
  },
  title: {
    flex: 1,
    marginLeft: 18,
    fontFamily: fontFamily.body,
    fontSize: fontSize.body,
    fontWeight: '700',
    color: '#080808',
  },
  category: {
    maxWidth: 80,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: '#e8f8f3',
  },
  categoryText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.small,
    color: '#267b6c',
    textTransform: 'capitalize',
  },
  check: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e1e1e1',
    backgroundColor: '#f3f3f3',
  },
});

export default HabitCard;
