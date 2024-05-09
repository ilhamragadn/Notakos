import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const DeleteButton = () => {
  return (
    <View style={styles.deleteButton}>
      <Text style={styles.buttonText}>Hapus</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  deleteButton: {
    alignItems: 'center',
    backgroundColor: '#DC3545',
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
export default DeleteButton;
