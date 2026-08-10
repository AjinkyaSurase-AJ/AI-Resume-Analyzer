import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message'
import AppScreen from './src/screens/AppScreen';
import AuthProvider from './src/provider/AuthProvider';

export default function App() {
  return (
    <AuthProvider>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <AppScreen />
        <Toast />
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    // marginTop: 30,
    flex: 1,
    backgroundColor: '#fff',
  },
});
