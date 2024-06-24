/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Text, View, useColorScheme} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const Footer = () => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View
      style={{
        alignItems: 'center',
        paddingTop: 10,
        paddingHorizontal: 20,
        height: 300,
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
      }}>
      <Text
        style={{
          textAlign: 'center',
          color: isDarkMode ? Colors.light : Colors.dark,
        }}>
        Kelola uang jadi seru dan mudah dengan{' '}
        <Text style={{fontWeight: 'bold', color: '#0284C7'}}>NOTAKOS.</Text>
        Yuk, mulai catat sekarang!
      </Text>
    </View>
  );
};

export default Footer;
