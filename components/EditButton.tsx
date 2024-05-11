import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const EditButton = () => {
  return (
    <View style={styles.editButton}>
      <Text style={styles.buttonText}>Edit</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  editButton: {
    alignItems: 'center',
    backgroundColor: '#EAB308',
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

export default EditButton;
