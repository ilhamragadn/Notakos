/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import ModalChoose from './ModalChoose';
import {TabBarIcon} from './TabBarIcon';

export const BottomNavbar = ({navigation}: any) => {
  return (
    <View style={styles.centeredView}>
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.box, {right: 10}]}
          onPress={() => navigation.navigate('Home')}>
          <TabBarIcon textIcon="Beranda">
            {/* outline */}
            <Svg
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0284C7"
              strokeWidth={2}>
              <Path
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TabBarIcon>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.box, {right: 15}]}
          onPress={() => navigation.navigate('Alokasi')}>
          <TabBarIcon textIcon="Alokasi">
            {/* //outline */}
            <Svg
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0284C7"
              strokeWidth={2}>
              <Path
                d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TabBarIcon>
        </TouchableOpacity>
        <View />
        <View style={styles.addButton}>
          <ModalChoose style={styles.addButton} navigation={navigation} />
        </View>
        <View />
        <TouchableOpacity
          style={[styles.box, {left: 15}]}
          onPress={() => navigation.navigate('Literatur')}>
          <TabBarIcon textIcon="Literatur">
            {/* //outline */}
            <Svg
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0284C7"
              strokeWidth={2}>
              <Path
                d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TabBarIcon>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.box, {left: 10}]}
          onPress={() => navigation.navigate('Profil')}>
          <TabBarIcon textIcon="Profil">
            <Svg
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0284C7"
              strokeWidth={2}>
              <Path
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TabBarIcon>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    alignItems: 'center',
    justifyContent: 'center',
    top: 450,
  },
  container: {
    width: 380,
    height: 50,
    flexDirection: 'row',
    backgroundColor: '#eaeaea',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    shadowColor: '#0284C7',
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    shadowOffset: {width: 0, height: 10},
    elevation: 3,
    justifyContent: 'space-evenly',
    borderTopWidth: 0.1,
    borderTopColor: '#d9d9d9',
  },
  box: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  addButton: {
    alignItems: 'center',
    bottom: 5,
    left: 27,
  },
});
