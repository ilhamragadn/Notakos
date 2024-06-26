/* eslint-disable react-native/no-inline-styles */
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
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
import List from '../components/List';
import ModalChoose from '../components/ModalChoose';
import {API_URL} from '../context/AuthContext';

const Home = ({navigation}: any) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  const [datas, setDatas] = useState([]);
  const [saldoCash, setSaldoCash] = useState(0);
  const [saldoCashless, setSaldoCashless] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API_URL}/catatan`);
      if (res.data.success) {
        const dataCatatan = res.data.data;

        let cash = 0;
        let cashless = 0;

        dataCatatan.forEach((item: any) => {
          item.catatan_pemasukan.forEach((pemasukan: any) => {
            if (pemasukan.kategori_uang_masuk === 'Cash') {
              cash += pemasukan.nominal_uang_masuk;
            } else {
              cashless += pemasukan.nominal_uang_masuk;
            }
          });
          item.catatan_pengeluaran.forEach((pengeluaran: any) => {
            if (pengeluaran.kategori_uang_keluar === 'Cash') {
              cash -= pengeluaran.nominal_uang_keluar;
            } else {
              cashless -= pengeluaran.nominal_uang_keluar;
            }
          });
        });
        setDatas(dataCatatan);
        setSaldoCash(cash);
        setSaldoCashless(cashless);
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

  const [cardFilter, setCardFilter] = useState(false);
  const toggleCardFilter = () => {
    setCardFilter(!cardFilter);
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
        <View
          style={{
            justifyContent: 'center',
            marginLeft: 24,
            paddingHorizontal: 8,
          }}>
          <Text
            style={[
              styles.textPath,
              {color: isDarkMode ? '#0284C7' : Colors.lighter},
            ]}>
            Beranda
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}>
          <View
            style={{
              marginRight: 10,
              padding: 5,
            }}>
            <View style={{flexDirection: 'row', marginVertical: 2}}>
              <Svg
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#ffffff"
                width={24}
                height={24}
                style={{marginHorizontal: 4}}>
                <Path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
                />
              </Svg>
              <Text
                style={{
                  color: '#ffffff',
                  fontWeight: '500',
                  textAlignVertical: 'center',
                  fontSize: 16,
                }}>
                Cash. {''}
                {saldoCash.toLocaleString('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </Text>
            </View>
            <View style={{flexDirection: 'row', marginVertical: 2}}>
              <Svg
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#ffffff"
                width={24}
                height={24}
                style={{marginHorizontal: 4}}>
                <Path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
                />
              </Svg>
              <Text
                style={{
                  color: '#ffffff',
                  fontWeight: '500',
                  textAlignVertical: 'center',
                  fontSize: 16,
                }}>
                Cashless. {''}
                {saldoCashless.toLocaleString('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <ScrollView>
        <View style={{zIndex: cardFilter ? 1 : 0}}>
          <List
            navigation={navigation}
            data={datas}
            loading={isLoading}
            cardFilter={cardFilter}
            setCardFilter={setCardFilter}
            toggleCardFilter={toggleCardFilter}
          />
        </View>

        <View style={{marginVertical: 8}}>
          <LineBreak />
        </View>

        <Footer />
      </ScrollView>
      <View style={{bottom: 64, right: 12}}>
        <ModalChoose navigation={navigation} />
      </View>
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
    paddingVertical: 18,
    marginBottom: 4,
  },
  textPath: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Home;
