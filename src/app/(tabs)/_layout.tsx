import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#00aaff',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#000' : '#fff',
          borderTopWidth: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? "home" : "home-outline"} color={color} size={size} />
            ),
        }}
      />

      <Tabs.Screen
        name="workouts"
        options={{
          title: 'Workouts',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "barbell" : "barbell-outline"} color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="timer"
        options={{
          title: 'Timer',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? "alarm" : "alarm-outline"} color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
