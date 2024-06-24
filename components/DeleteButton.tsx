import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

const DeleteButton = ({onPress, disabled}: any) => {
  return (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={onPress}
      disabled={disabled}>
      <Text style={styles.buttonText}>Hapus</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  deleteButton: {
    alignItems: 'center',
    backgroundColor: '#DC2626',
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
export default DeleteButton;
