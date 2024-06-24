import React from 'react';
import {StyleSheet, View} from 'react-native';

export const Card = ({children}: any) => {
  return <View style={styles.card}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    margin: 5,
    padding: 6,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#64748B',
    shadowOpacity: 0.5,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 10},
    elevation: 4,
  },
});
