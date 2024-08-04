//act as nav

import { Tabs } from 'expo-router';
import React from 'react';

import {Ionicons} from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused, size }) => (
           <Ionicons
            name={focused ? 'home' : 'home-outline'}
            color={color}
            size={size}
           />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color, focused, size }) => (
          <Ionicons
            name={focused ? 'camera' : 'camera-outline'}
            color={color}
            size={size}
           />  
          ),
        }}
      />

    <Tabs.Screen
        name="display"
        options={{
          title: 'Display',
          tabBarIcon: ({ color, focused, size }) => (
          <Ionicons
            name={focused ? 'bar-chart' : 'bar-chart-outline'}
            color={color}
            size={size}
           />
          )
        }}
      />
      <Tabs.Screen
        name="loading"
        options={{
          title: 'loading',
          href: null,
        }}
      />
    </Tabs>
  );
}
