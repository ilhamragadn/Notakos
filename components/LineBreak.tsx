import React from 'react';
import {StyleSheet, View} from 'react-native';

const LineBreak = () => {
  return <View style={styles.lineBreak} />;
};

const styles = StyleSheet.create({
  lineBreak: {
    borderWidth: 1,
    borderColor: '#64748B',
    borderRadius: 10,
    // marginVertical: 6,
  },
});
export default LineBreak;
