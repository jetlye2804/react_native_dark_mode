import React, { useEffect } from 'react';
import {Text, View, StyleSheet, Appearance, Button, StatusBar} from 'react-native';
import {useTheme} from '@react-navigation/native';

interface Props {
  navigation: any;
  themePreference: string;
}

const ThemeStatusScreen = ({navigation, themePreference}: Props) => {
  const {colors} = useTheme();

  const isDarkMode = themePreference === 'on' ||
  (themePreference === 'followSystem' && Appearance.getColorScheme() === 'dark');

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>

      <View style={[{paddingBottom: 16 ,alignItems: 'flex-start'}]}>
        <Text style={[{fontSize: 48, fontWeight: '700'}, {color: colors.text}]}>
          Hello
        </Text>
      </View>


      <Text style={[styles.text, {color: colors.text}]}>
        Current Theme: {isDarkMode ? 'Dark' : 'Light'}
      </Text>

      <Button
        title="Go to Settings"
        onPress={() => navigation.navigate('Toggle Settings')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 24,
  },
});

export default ThemeStatusScreen;
