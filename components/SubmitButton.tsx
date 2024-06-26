import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

const SubmitButton = ({
  onPress,
  disabled,
  textButton,
}: {
  onPress: any;
  disabled: any;
  textButton: string;
}) => {
  return (
    <TouchableOpacity
      style={styles.submitButton}
      onPress={onPress}
      disabled={disabled}>
      <Text style={styles.buttonText}>{textButton}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  submitButton: {
    alignItems: 'center',
    backgroundColor: '#16A34A',
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

export default SubmitButton;
