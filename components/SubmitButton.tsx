import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

const SubmitButton = ({onPress}: any) => {
  return (
    <TouchableOpacity style={styles.submitButton} onPress={onPress}>
      <Text style={styles.buttonText}>Simpan</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  submitButton: {
    alignItems: 'center',
    backgroundColor: '#198754',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginVertical: 10,
    marginHorizontal: 5,
    elevation: 3,
    shadowColor: '#000000',
    shadowOpacity: 0.5,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  buttonText: {
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default SubmitButton;
