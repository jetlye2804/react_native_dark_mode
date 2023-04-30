import { useTheme } from '@react-navigation/native';
import React from 'react';
import { Text, View } from 'react-native';

const HomeScreen = () => {
  const colors = useTheme().colors;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.card,
      }}>
      <Text style={{ color: colors.text }}>
        This is demo of default dark/light theme using navigation.
      </Text>
    </View>
  );
};

export default HomeScreen;