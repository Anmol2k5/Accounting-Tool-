import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {View, Text, StyleSheet} from 'react-native';
import {C, FontSize} from '../theme';

import {HomeScreen} from '../screens/HomeScreen';
import {TransactionListScreen} from '../screens/TransactionListScreen';
import {TransactionEntryScreen} from '../screens/TransactionEntryScreen';
import {ReportsScreen} from '../screens/ReportsScreen';
import {AiAdvisorScreen} from '../screens/AiAdvisorScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Tab icon component
function TabIcon({label, focused}: {label: string; focused: boolean}) {
  const icons: Record<string, string> = {
    Home: '🏠',
    Transactions: '📋',
    Reports: '📈',
    'AI Advisor': '🤖',
  };

  return (
    <View style={tabStyles.iconContainer}>
      <Text style={[tabStyles.icon, focused && tabStyles.iconFocused]}>
        {icons[label] || '📄'}
      </Text>
      <Text
        style={[
          tabStyles.label,
          focused && tabStyles.labelFocused,
        ]}>
        {label}
      </Text>
      {focused && <View style={tabStyles.indicator} />}
    </View>
  );
}

const tabStyles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 6,
  },
  icon: {
    fontSize: 20,
    opacity: 0.5,
  },
  iconFocused: {
    opacity: 1,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: C.textMuted,
    marginTop: 2,
  },
  labelFocused: {
    color: C.gold,
    fontWeight: '700',
  },
  indicator: {
    width: 20,
    height: 3,
    borderRadius: 2,
    backgroundColor: C.gold,
    marginTop: 4,
  },
});

// Tab Navigator
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: C.surface,
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTintColor: C.textPrimary,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: FontSize.lg,
        },
        tabBarStyle: {
          backgroundColor: C.tabBar,
          borderTopColor: C.tabBarBorder,
          borderTopWidth: 1,
          height: 75,
          paddingBottom: 8,
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: C.gold,
        tabBarInactiveTintColor: C.textMuted,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <TabIcon label="Home" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionListScreen}
        options={{
          headerTitle: 'Transactions',
          tabBarIcon: ({focused}) => (
            <TabIcon label="Transactions" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Reports"
        component={ReportsScreen}
        options={{
          headerTitle: 'Reports & Ratios',
          tabBarIcon: ({focused}) => (
            <TabIcon label="Reports" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="AI Advisor"
        component={AiAdvisorScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <TabIcon label="AI Advisor" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Root Stack Navigator (for modals like Add Transaction)
export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: C.surface,
          },
          headerTintColor: C.gold,
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: FontSize.lg,
            color: C.textPrimary,
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: C.background,
          },
        }}>
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Add Transaction"
          component={TransactionEntryScreen}
          options={{
            headerTitle: 'Transaction Entry',
            presentation: 'modal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
