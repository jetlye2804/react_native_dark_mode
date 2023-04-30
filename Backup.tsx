import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Appearance,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {NavigationContainer, DefaultTheme, DarkTheme, useTheme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

const HomeScreen = ({toggleTheme, themePreference}) => {
  const {colors} = useTheme();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={[styles.title, {color: colors.text}]}>Dark Mode Toggle</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            themePreference === 'on' && styles.activeButton,
          ]}
          onPress={() => toggleTheme('on')}>
          <Text style={[styles.buttonText, {color: themePreference === 'on' ? 'white' : colors.primary}]}>
            On
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            themePreference === 'off' && styles.activeButton,
          ]}
          onPress={() => toggleTheme('off')}>
          <Text style={[styles.buttonText, {color: themePreference === 'off' ? 'white' : colors.primary}]}>
            Off
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            themePreference === 'system' && styles.activeButton,
          ]}
          onPress={() => toggleTheme('system')}>
          <Text style={[styles.buttonText, {color: themePreference === 'system' ? 'white' : colors.primary}]}>
            Follow System
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const Stack = createStackNavigator();

const App = () => {
  const [theme, setTheme] = useState(DefaultTheme);
  const [themePreference, setThemePreference] = useState('system');

  const storeThemePreference = async (preference) => {
    try {
      await AsyncStorage.setItem('themePreference', preference);
    } catch (error) {
      console.error('Error saving theme preference: ', error);
    }
  };

  const loadThemePreference = async () => {
    try {
      const preference = await AsyncStorage.getItem('themePreference');
      if (preference !== null) {
        setThemePreference(preference);
        updateTheme(preference);
      }
    } catch (error) {
      console.error('Error loading theme preference: ', error);
    }
  };

  const updateTheme = (preference) => {
    if (preference === 'on') {
      setTheme(DarkTheme);
    } else if (preference === 'off') {
      setTheme(DefaultTheme);
    } else {
      // Follow system theme
      const isDarkMode = Appearance.getColorScheme() === 'dark';
      setTheme(isDarkMode ? DarkTheme : DefaultTheme);
    }
  };

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
  }, [themePreference]);

  const toggleTheme = (preference) => {
    setThemePreference(preference);
    updateTheme(preference);
    storeThemePreference(preference);
  };

  return (
    <NavigationContainer theme={theme}>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          options={{headerShown: false}}>
          {(props) => (
            <HomeScreen
              {...props}
              toggleTheme={toggleTheme}
              themePreference={themePreference}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    borderWidth: 1,
    borderColor: '#007BFF',
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: '#007BFF',
  },
  buttonText: {
    fontSize: 18,
    color: '#007BFF',
  },
});

export default App;