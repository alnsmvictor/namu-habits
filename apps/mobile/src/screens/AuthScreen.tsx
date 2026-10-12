import { useState } from 'react';
import {
  Image,
  Alert,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fontFamily, fontSize } from '../styles/typography';
import { AuthUser, login, register } from '../services/auth';

type AuthScreenProps = {
  mode: 'login' | 'register';
  onSuccess: (user: AuthUser) => void;
  onChangeMode: () => void;
};

function AuthScreen({ mode, onSuccess, onChangeMode }: AuthScreenProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isLogin = mode === 'login';

  async function handleSubmit() {
    setError('');

    if (!email.trim() || !password || (!isLogin && !name.trim())) {
      setError('Preencha todos os campos');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('As senhas n\u00e3o conferem');
      return;
    }

    setIsLoading(true);

    try {
      const response = isLogin
        ? await login(email, password)
        : await register(name, email, password);

      Alert.alert(response.message);
      onSuccess(response.user);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'N\u00e3o foi poss\u00edvel concluir a opera\u00e7\u00e3o',
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <Image
          source={require('../assets/namu-logo.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>
          {isLogin ? 'Bem-vindo' : 'Criar conta'}
        </Text>
        <Text style={styles.subtitle}>
          {isLogin
            ? 'Entre para cuidar da sua rotina.'
            : 'Comece a acompanhar seus h\u00e1bitos.'}
        </Text>

        {!isLogin && (
          <TextInput
            style={styles.input}
            placeholder="Seu nome"
            placeholderTextColor="#8c9794"
            value={name}
            onChangeText={setName}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#8c9794"
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#8c9794"
          autoCapitalize="none"
          autoComplete={isLogin ? 'current-password' : 'new-password'}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {!isLogin && (
          <TextInput
            style={styles.input}
            placeholder="Confirmar senha"
            placeholderTextColor="#8c9794"
            autoCapitalize="none"
            autoComplete="new-password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        )}

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable
          style={[styles.button, isLoading && styles.buttonDisabled]}
          disabled={isLoading}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Aguarde...' : isLogin ? 'Entrar' : 'Criar conta'}
          </Text>
        </Pressable>

        <Pressable onPress={onChangeMode}>
          <Text style={styles.link}>
            {isLogin ? 'Ainda n\u00e3o tenho conta' : 'J\u00e1 tenho uma conta'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fbfa' },
  content: { flex: 1, paddingHorizontal: 28, justifyContent: 'center' },
  logo: { width: 104, height: 104, alignSelf: 'center', marginBottom: 30 },
  title: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.display,
    color: '#10201c',
  },
  subtitle: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.body,
    color: '#65736f',
    marginTop: 8,
    marginBottom: 30,
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
  link: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.small,
    fontWeight: '700',
    color: '#168d76',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default AuthScreen;
