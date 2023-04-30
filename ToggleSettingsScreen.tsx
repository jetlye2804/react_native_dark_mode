import React, {useState} from 'react';
import {View, TouchableOpacity, Text, StyleSheet, FlatList, Appearance, Platform} from 'react-native';
import { List, Row } from 'react-native-ios-list';
import {useTheme} from '@react-navigation/native';

type ToggleSettingsScreenProps = {
  toggleTheme: (newThemePreference: string) => void;
  themePreference: string;
};

const ToggleSettingsScreen = ({toggleTheme, themePreference, ...props}: ToggleSettingsScreenProps) => {
  const { colors } = useTheme();
  const [selectedThemePreference, setSelectedThemePreference] = useState(themePreference);

  const isDarkMode = themePreference === 'on' ||
  (themePreference === 'followSystem' && Appearance.getColorScheme() === 'dark');

  const handleThemePreferenceChange = (newThemePreference: string) => {
    setSelectedThemePreference(newThemePreference);
    toggleTheme(newThemePreference);
  };

  const data = [
    { label: 'On', value: 'on' },
    { label: 'Off', value: 'off' },
    { label: 'Follow System', value: 'followSystem' },
  ];

  const backgroundColor = {
    contentLight: 'white',
    contentDark: '#333333',
  };

  return (
    <List
      header="APPEARANCE"
      footer="If 'Follow System' is selected, the app will automatically adjust your appearance based on your device's system settings."
      inset={Platform.OS === 'ios' ? true : false}
      backgroundColor={isDarkMode ? backgroundColor.contentDark : backgroundColor.contentLight}

    >
      {data.map((item, i) => (
        <Row
          highlightColor="transparent"
          key={i}
          trailing={item.value === selectedThemePreference ? <Text style={[{color: colors.text}]}>Yes</Text> : null}
          onPress={() => handleThemePreferenceChange(item.value)}
        >
          <Text style={[{color: colors.text}]}>{item.label}</Text>
        </Row>
      ))}
    </List>
  );
};

export default ToggleSettingsScreen;