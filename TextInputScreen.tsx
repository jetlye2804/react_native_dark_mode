import { useTheme } from '@react-navigation/native';
import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Appearance,
} from 'react-native';

interface Props {
  themePreference: string;
}

const TextInputScreen = ({themePreference}: Props) => {
  const {colors} = useTheme();
  const [inputValue, setInputValue] = React.useState('');

  const isDarkMode = themePreference === 'on' ||
  (themePreference === 'system' && Appearance.getColorScheme() === 'dark');

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, {backgroundColor: colors.background}]}>
        <Text style={[styles.label, {color: colors.text}]}>Enter some text:</Text>
        <TextInput
          style={styles.input}
          onChangeText={text => setInputValue(text)}
          value={inputValue}
          placeholder="Type here..."
          keyboardAppearance={isDarkMode ? "dark" : "light"}
          placeholderTextColor="#888"
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderRadius: 8,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 8,
  },
});

export default TextInputScreen;
