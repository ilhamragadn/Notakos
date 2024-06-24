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
import BottomNav from '../components/BottomNav';
import Footer from '../components/Footer';
import LineBreak from '../components/LineBreak';
import {API_URL} from '../context/AuthContext';

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
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API_URL}/literatur`);

      if (res.data.success) {
        setData(res.data.data);
        setIsLoading(false);
      } else {
        console.error('Failed to fetch data: ', res.data.message);
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });
    return unsubscribe;
  }, [navigation]);

  const handleLink = (datas: LiteraturItem) => {
    if (datas.link) {
      Linking.openURL(datas.link);
    } else {
      console.error('Link tidak tersedia.');
    }
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={
          isDarkMode ? backgroundStyle.backgroundColor : '#0284C7'
        }
      />
      <View
        style={[
          isDarkMode
            ? [backgroundStyle.backgroundColor, styles.boxPath]
            : [{backgroundColor: '#0284C7'}, styles.boxPath],
        ]}>
        <Text
          style={[
            styles.textPath,
            isDarkMode ? {color: '#0284C7'} : {color: '#ffffff'},
          ]}>
          Literatur
        </Text>
      </View>
      <ScrollView>
        {isLoading ? (
          <View
            style={{
              marginTop: 35,
              marginBottom: 25,
              justifyContent: 'center',
            }}>
            <ActivityIndicator size="large" color="#0284C7" />
          </View>
        ) : Array.isArray(data) && data.length > 0 ? (
          data.map(item => (
            <Pressable
              key={item.id}
              style={({pressed}) => [
                {
                  backgroundColor: pressed
                    ? isDarkMode
                      ? Colors.dark
                      : Colors.light
                    : isDarkMode
                    ? Colors.darker
                    : Colors.lighter,
                },
              ]}
              onPress={() => handleLink(item)}>
              <View style={styles.list}>
                <View style={styles.listItem}>
                  <Svg
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#ffffff"
                    strokeWidth={2}
                    width={30}
                    height={30}>
                    <Path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                    />
                  </Svg>
                </View>
                <View style={styles.listContent}>
                  <Text
                    style={[
                      styles.title,
                      {color: isDarkMode ? Colors.lighter : Colors.darker},
                    ]}
                    numberOfLines={1}>
                    {item.judul}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 11,
                      color: isDarkMode ? Colors.lighter : Colors.darker,
                    }}>
                    {item.deskripsi}
                  </Text>
                </View>
              </View>
            </Pressable>
          ))
        ) : (
          <View
            style={{
              marginTop: 25,
              marginBottom: 15,
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontWeight: '500',
                fontStyle: 'italic',
              }}>
              Mohon maaf, literatur masih belum tersedia.
            </Text>
          </View>
        )}

        <View style={{marginVertical: 8}}>
          <LineBreak />
        </View>

        <Footer />
      </ScrollView>
      <View
        style={{
          position: 'absolute',
          bottom: 450,
          left: 0,
          right: 0,
        }}>
        <BottomNav />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  boxPath: {
    flexDirection: 'row',
  },
  textPath: {fontSize: 18, fontWeight: 'bold', padding: 30},
  list: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  listItem: {
    backgroundColor: '#64748B',
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  listContent: {
    flex: 2,
    marginRight: 10,
    padding: 5,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
});

export default Literatur;
