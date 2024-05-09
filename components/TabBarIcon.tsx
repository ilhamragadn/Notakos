import type {PropsWithChildren} from 'react';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

type BarIconPropsWithChildren = PropsWithChildren<{
  textIcon: string;
}>;

export const TabBarIcon = ({children, textIcon}: BarIconPropsWithChildren) => {
  return (
    <View style={styles.BarIcon}>
      {children}
      <Text style={styles.TextIcon}>{textIcon}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  BarIcon: {alignItems: 'center'},
  TextIcon: {fontSize: 11},
});
