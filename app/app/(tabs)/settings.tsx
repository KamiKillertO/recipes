import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuthStore } from '../../src/lib/authStore';

export default function SettingsScreen() {
  const { user, logout } = useAuthStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      
      {user ? (
        <View style={styles.section}>
          <Text style={styles.label}>Logged in as:</Text>
          <Text style={styles.value}>{user.username}</Text>
          <TouchableOpacity style={styles.button} onPress={logout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.subtitle}>Not logged in</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FAFAFA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: '#757575',
  },
  value: {
    fontSize: 18,
    color: '#212121',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#D32F2F',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
  },
});