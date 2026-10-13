import { useState } from 'react';
import {
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@react-native-vector-icons/material-icons/static';
import { fontFamily, fontSize } from '../styles/typography';

type Props = {
  onBack: () => void;
  onChangePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<boolean>;
};

function ChangePasswordScreen({ onBack, onChangePassword }: Props) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  async function save() {
    setError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Preencha todos os campos');
      return;
    }

    if (newPassword.length < 6) {
      setError('A nova senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('As senhas n\u00e3o conferem');
      return;
    }

    setIsSaving(true);
    const changed = await onChangePassword(currentPassword, newPassword);
    setIsSaving(false);

    if (changed) {
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
        <Text style={styles.headerTitle}>Perfil</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.iconBox}>
          <MaterialIcons name="lock-outline" size={28} color="#168d76" />
        </View>
        <Text style={styles.title}>Alterar senha</Text>
        <Text style={styles.subtitle}>
          Confirme sua senha atual para criar uma nova.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Senha atual"
          placeholderTextColor="#8c9794"
          secureTextEntry
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Nova senha"
          placeholderTextColor="#8c9794"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar nova senha"
          placeholderTextColor="#8c9794"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable
          style={[styles.button, isSaving && styles.buttonDisabled]}
          disabled={isSaving}
          onPress={save}
        >
          <Text style={styles.buttonText}>
            {isSaving ? 'Salvando...' : 'Alterar senha'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fbfa' },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e8efed',
    backgroundColor: '#ffffff',
  },
  backButton: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.body,
    fontWeight: '700',
    color: '#202725',
  },
  content: { flex: 1, padding: 24, paddingTop: 38 },
  iconBox: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 28,
    backgroundColor: '#cff9ee',
    marginBottom: 18,
  },
  title: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.title,
    color: '#10201c',
  },
  subtitle: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.body,
    color: '#65736f',
    marginTop: 7,
    marginBottom: 28,
  },
  input: {
    height: 54,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#dce8e4',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    fontFamily: fontFamily.body,
    fontSize: fontSize.body,
    color: '#15211e',
  },
  error: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.small,
    color: '#bd3b3b',
    marginBottom: 12,
  },
  button: {
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: '#20d5ae',
  },
  buttonDisabled: { opacity: 0.65 },
  buttonText: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.body,
    fontWeight: '700',
    color: '#073c32',
  },
});

export default ChangePasswordScreen;
