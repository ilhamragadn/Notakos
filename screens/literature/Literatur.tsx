/* eslint-disable react-native/no-inline-styles */
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import {Path, Svg} from 'react-native-svg';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {BottomNavbar} from '../../components/BottomNavbar';

type LiteraturItem = {
  id: number;
  judul: string;
  deskripsi: string;
  link: string;
  created_at: string;
  updated_at: string;
};

const Literatur = ({navigation}: any) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  const [data, setData] = useState<LiteraturItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const urlBase = 'http://192.168.43.129:8000/api/';
        const urlKey = 'literatur/';
        const res = await axios.get(urlBase + urlKey);

        if (res.data.success) {
          setData(res.data.data);
        } else {
          console.error('Failed to fetch data: ', res.data.message);
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };
    fetchData();
  }, []);

  // console.log(data.link);

  const handleLink = (datas: LiteraturItem) => {
    if (datas.link) {
      // Memeriksa apakah link ada di item
      Linking.openURL(datas.link); // Menggunakan item.link untuk membuka URL
    } else {
      console.error('Link tidak tersedia.');
    }
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={
          isDarkMode ? backgroundStyle.backgroundColor : '#845FAC'
        }
      />
      <View
        style={[
          isDarkMode
            ? [backgroundStyle.backgroundColor, styles.boxPath]
            : [{backgroundColor: '#845FAC'}, styles.boxPath],
        ]}>
        <Text
          style={[
            styles.textPath,
            isDarkMode ? {color: '#845FAC'} : {color: '#ffffff'},
          ]}>
          NOTAKOS
        </Text>
      </View>
      <ScrollView style={{flex: 1}}>
        <View style={{marginBottom: 12}}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '500',
              marginVertical: 8,
              marginLeft: 20,
            }}>
            Literatur
          </Text>
        </View>
        {Array.isArray(data) && data.length > 0 ? (
          data.map(item => (
            <Pressable
              key={item.id}
              style={({pressed}) => [
                {backgroundColor: pressed ? '#d9d9d9' : '#fafafa'},
              ]}
              onPress={() => handleLink(item)}>
              <View style={styles.list}>
                <View style={styles.listItem}>
                  <Svg
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#000000"
                    strokeWidth={2}
                    width={30}
                    height={30}>
                    <Path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
                    />
                  </Svg>
                </View>
                <View style={styles.listContent}>
                  <Text style={styles.title} numberOfLines={1}>
                    {item.judul}
                  </Text>
                  <Text numberOfLines={1} style={{fontSize: 12}}>
                    {item.deskripsi}
                  </Text>
                </View>
              </View>
            </Pressable>
          ))
        ) : (
          <View
            style={{
              marginTop: 10,
              justifyContent: 'center',
            }}>
            <ActivityIndicator size="large" color="#845FAC" />
          </View>
        )}
      </ScrollView>
      <View
        style={{
          position: 'absolute',
          bottom: 450,
          left: 0,
          right: 0,
        }}>
        <BottomNavbar navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  boxPath: {
    shadowColor: '#845FAC',
    shadowOpacity: 0.25,
    shadowOffset: {width: 0, height: 10},
    shadowRadius: 4,
    elevation: 3,
  },
  textPath: {fontSize: 18, fontWeight: 'bold', padding: 30},
  list: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    borderWidth: 0.5,
    borderColor: '#d9d9d9',
    // backgroundColor: '#fafafa',
    // marginHorizontal: 10,
  },
  listItem: {
    backgroundColor: '#eaeaea',
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginHorizontal: 10,
    alignItems: 'center',
    // borderWidth: 1,
  },
  listContent: {
    flex: 2,
    marginRight: 10,
    padding: 5,
    // borderWidth: 1,
  },
  // bgIcon: {borderRadius: 5, padding: 5},
  title: {
    fontWeight: '500',
    fontSize: 15,
    marginBottom: 4,
  },
});

export default Literatur;
