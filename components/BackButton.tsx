import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

export const BackButton = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={styles.backButton}>
      <Text style={styles.buttonText}>Kembali</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    backgroundColor: '#64748B',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginVertical: 10,
    marginHorizontal: 5,
    elevation: 4,
    shadowColor: '#000000',
    shadowOpacity: 0.5,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 10,
    },
  },
  buttonText: {
    fontWeight: '600',
    color: '#ffffff',
  },
});
