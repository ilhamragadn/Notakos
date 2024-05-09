/* eslint-disable react-native/no-inline-styles */
import React, {PropsWithChildren} from 'react';
import {StyleSheet, Text, View} from 'react-native';

export type ListItem = PropsWithChildren<{
  judul: string;
  deskripsi: string;
  total_uang: number;
  navigation: any;
}>;

const ListNotes = ({judul, deskripsi, total_uang, children}: ListItem) => {
  return (
    <View style={styles.list}>
      <View style={[styles.listItem, {alignItems: 'center'}]}>{children}</View>
      <View style={styles.listContent}>
        <Text style={styles.title}>{judul}</Text>
        <Text style={{fontSize: 11}} numberOfLines={1}>
          {deskripsi}
        </Text>
      </View>
      <View style={[styles.listItem, {width: 110}]}>
        <Text style={{textAlign: 'left'}}>{total_uang}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    // backgroundColor: '#fafafa',
    // marginHorizontal: 10,
  },
  listItem: {
    padding: 5,
    marginHorizontal: 5,
  },
  listContent: {
    flex: 2,
    marginHorizontal: 2,
    padding: 5,
    // borderWidth: 1,
  },
  bgIconIncome: {backgroundColor: '#00d008', borderRadius: 20, padding: 5},
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
});

export default ListNotes;
