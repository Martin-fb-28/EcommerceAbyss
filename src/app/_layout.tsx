import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { PirataOne_400Regular } from '@expo-google-fonts/pirata-one';
import { GrenzeGotisch_900Black } from '@expo-google-fonts/grenze-gotisch';
import { ActivityIndicator, View } from 'react-native';
import { CartProvider } from '../context/CartContext';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PirataOne_400Regular,
    GrenzeGotisch_900Black,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}