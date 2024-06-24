import React from 'react';
import {StyleSheet, View, useColorScheme} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const LineBreak = () => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View
      style={[
        styles.lineBreak,
        {backgroundColor: isDarkMode ? Colors.darker : Colors.lighter},
      ]}
    />
  );
};

const styles = StyleSheet.create({
  lineBreak: {
    borderWidth: 0.3,
    borderColor: '#64748B',
    borderRadius: 10,
  },
});

export default LineBreak;
