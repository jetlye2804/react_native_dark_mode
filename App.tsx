import React, {useState, useEffect, useCallback} from 'react';
import {
  Platform,
  Appearance,
  StatusBar,
  TouchableOpacity,
  Text,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {NavigationContainer, DefaultTheme, DarkTheme, useTheme} from '@react-navigation/native';
import {TransitionPresets, createStackNavigator} from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import ThemeStatusScreen from './ThemeStatusScreen';
import ToggleSettingsScreen from './ToggleSettingsScreen';
import TextInputScreen from './TextInputScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const NativeStack = createNativeStackNavigator();

interface HomeStackProps {
  theme: typeof DefaultTheme | typeof DarkTheme;
  themePreference: string;
}

function HomeStack({ theme, themePreference }: HomeStackProps) {
  return (
    <Stack.Navigator
      initialRouteName="Theme Status"
      screenOptions={{
        gestureEnabled: true,
      }}
    >
      <Stack.Screen
        name="Theme Status"
        children={props => {
          return <ThemeStatusScreen themePreference={themePreference} {...props}/>;
        }}
      />
    </Stack.Navigator>
  );
}

const App = () => {
  const [theme, setTheme] = useState(DefaultTheme);
  const [themePreference, setThemePreference] = useState('system');

  const storeThemePreference = async (preference: string) => {
    try {

      console.log(preference);

      await AsyncStorage.setItem('themePreference', preference);
    } catch (error) {
      console.error('Error saving theme preference: ', error);
    }
  };

  const updateTheme = useCallback((preference: string) => {
    if (preference === 'on') {
      setTheme(DarkTheme);
    } else if (preference === 'off') {
      setTheme(DefaultTheme);
    } else {
      // Follow system theme
      const isDarkMode = Appearance.getColorScheme() === 'dark';
      setTheme(isDarkMode ? DarkTheme : DefaultTheme);
    }
  }, [setTheme]);

  const loadThemePreference = useCallback(async () => {
    try {
      const preference = await AsyncStorage.getItem('themePreference');
      if (preference !== null) {
        setThemePreference(preference);
        updateTheme(preference);
      }
    } catch (error) {
      console.error('Error loading theme preference: ', error);
    }
  }, [setThemePreference, updateTheme]);

  useEffect(() => {
    loadThemePreference();

    const subscription = Appearance.addChangeListener(({colorScheme}) => {
      if (themePreference === 'system') {
        updateTheme(themePreference);
      }
    });

    return () => {
      // Clean up listener
      subscription.remove();
    };
  }, [loadThemePreference, themePreference, updateTheme]);


  const toggleTheme = (preference: string) => {
    setThemePreference(preference);
    updateTheme(preference);
    storeThemePreference(preference);
  };

  return (
    <NavigationContainer theme={theme}>
      <StatusBar
        animated
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <Stack.Navigator
        initialRouteName="Main"
        screenOptions={{
          presentation: Platform.OS === 'ios' ? 'modal' : 'card',
        }}
      >
        <Stack.Group
          screenOptions={{
            headerShown: false,
            presentation: 'modal',
            headerStyle: {
              backgroundColor: theme.colors.background
            }
          }}
        >
          <Stack.Screen name="Main">
          {() => (
            <Tab.Navigator
              screenOptions={{
                headerShown: false, // Hide the header for Tab.Navigator
              }}
            >
              <Tab.Screen name="Home">
              {() => <HomeStack theme={theme} themePreference={themePreference} />}
              </Tab.Screen>
              {/* Add other screens to the Tab.Navigator if needed */}
              <Tab.Screen name="Input">
              {() => <TextInputScreen themePreference={themePreference}/>}
              </Tab.Screen>
            </Tab.Navigator>
          )}
         </Stack.Screen>
        </Stack.Group>
        <Stack.Group
          screenOptions={{
            headerShown: true,
            presentation: Platform.OS === 'ios' ? 'modal' : 'card',
          }}
        >
          <Stack.Screen
            name="Toggle Settings"
            options={{
              title: 'Toggle',
              // headerLeft: () => <></>, // This line hides the back button
              headerLeft: Platform.OS !== 'ios' ? undefined : () => null, // hide on iOS, remain on Android
            }}
            initialParams={{themePreference}}
          >
            {props => (
              <ToggleSettingsScreen
                toggleTheme={toggleTheme}
                themePreference={themePreference}
                {...props}
                />
            )}
          </Stack.Screen>
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
