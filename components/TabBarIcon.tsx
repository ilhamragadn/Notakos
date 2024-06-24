/* eslint-disable react-native/no-inline-styles */
import type {PropsWithChildren} from 'react';
import React from 'react';
import {StyleSheet, Text, View, useColorScheme} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

type BarIconPropsWithChildren = PropsWithChildren<{
  textIcon: string;
  isFocused: any;
}>;

export const TabBarIcon = ({
  children,
  textIcon,
  isFocused,
}: BarIconPropsWithChildren) => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={styles.BarIcon}>
      {children}
      <Text
        style={[
          styles.TextIcon,
          {
            color: isDarkMode ? Colors.lighter : '#0284C7',
            fontWeight: isFocused ? 'bold' : 'normal',
          },
        ]}>
        {textIcon}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  BarIcon: {alignItems: 'center'},
  TextIcon: {fontSize: 11},
});
