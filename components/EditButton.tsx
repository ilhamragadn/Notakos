import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

const EditButton = ({
  onPress,
  textButton,
}: {
  onPress: any;
  textButton: string;
}) => {
  return (
    <TouchableOpacity style={styles.editButton} onPress={onPress}>
      <Text style={styles.buttonText}>{textButton}</Text>
    </TouchableOpacity>
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

export default EditButton;
