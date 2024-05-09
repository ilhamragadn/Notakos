/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Svg, {Path} from 'react-native-svg';

const ListOutcome = () => {
  return (
    <View style={styles.list}>
      <View style={styles.listItem}>
        <View style={styles.bgIconOutcome}>
          <Svg viewBox="0 0 24 24" width={30} height={30} fill="#fafafa">
            <Path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M1.72 5.47a.75.75 0 0 1 1.06 0L9 11.69l3.756-3.756a.75.75 0 0 1 .985-.066 12.698 12.698 0 0 1 4.575 6.832l.308 1.149 2.277-3.943a.75.75 0 1 1 1.299.75l-3.182 5.51a.75.75 0 0 1-1.025.275l-5.511-3.181a.75.75 0 0 1 .75-1.3l3.943 2.277-.308-1.149a11.194 11.194 0 0 0-3.528-5.617l-3.809 3.81a.75.75 0 0 1-1.06 0L1.72 6.53a.75.75 0 0 1 0-1.061Z"
            />
          </Svg>
        </View>
      </View>
      <View style={styles.listContent}>
        <Text style={styles.title}>Judul Pengeluaran</Text>
        <Text style={{fontSize: 11}} numberOfLines={1}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum
          neque pariatur quidem voluptates? Excepturi ex sed iste. Nisi, at
          adipisci! Voluptates, repudiandae. Ratione exercitationem laborum
          maxime temporibus quo pariatur repudiandae?
        </Text>
      </View>
      <View style={styles.listItem}>
        <Text>Rp 2.000.000</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    height: 70,
    // marginHorizontal: 10,
  },
  listItem: {
    padding: 5,
    marginHorizontal: 5,
    alignItems: 'center',
    // borderWidth: 1,
  },
  listContent: {
    flex: 2,
    marginHorizontal: 2,
    padding: 5,
    // borderWidth: 1,
  },
  bgIconOutcome: {backgroundColor: '#d00c00', borderRadius: 20, padding: 5},
  title: {
    fontWeight: '500',
    fontSize: 16,
    marginBottom: 4,
  },
});

export default ListOutcome;
