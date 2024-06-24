import {useNavigation, useRoute} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, View, useColorScheme} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import TabBarItem from './TabBarItem';
import AlokasiIcon from './icons/AlokasiIcon';
import HomeIcon from './icons/HomeIcon';
import LiteraturIcon from './icons/LiteraturIcon';
import ProfilIcon from './icons/ProfilIcon';

const BottomNav = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation();
  const rute = useRoute();
  const currentRouteName = rute.name;

  const routes = [
    {name: 'Home', text: 'Beranda', icon: HomeIcon},
    {name: 'Alokasi', text: 'Alokasi', icon: AlokasiIcon},
    {name: 'Literatur', text: 'Literatur', icon: LiteraturIcon},
    {name: 'Profil', text: 'Profil', icon: ProfilIcon},
  ];

  return (
    <View style={styles.centeredView}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
          },
        ]}>
        {routes.map((route, index) => (
          <TabBarItem
            key={index}
            route={route}
            navigation={navigation}
            isFocused={currentRouteName === route.name}
            isDarkMode={isDarkMode}
          />
        ))}
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
    width: '100%',
    height: 50,
    flexDirection: 'row',
    borderTopWidth: 0.3,
    borderTopColor: '#64748B',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    justifyContent: 'space-evenly',
  },
  box: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  addButton: {
    alignItems: 'center',
    bottom: 5,
    left: '50%',
  },
});

export default BottomNav;
