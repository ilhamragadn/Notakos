import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {TabBarIcon} from './TabBarIcon';

const TabBarItem = ({route, navigation, isFocused}: any) => {
  const Icon = route.icon;
  return (
    <TouchableOpacity
      style={styles.box}
      onPress={() => navigation.navigate(route.name)}>
      <TabBarIcon textIcon={route.text} isFocused={isFocused}>
        <Icon isFocused={isFocused} />
      </TabBarIcon>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  box: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
});

export default TabBarItem;
