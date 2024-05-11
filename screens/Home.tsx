/* eslint-disable react-native/no-inline-styles */
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';
import {Path, Svg} from 'react-native-svg';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {BottomNavbar} from '../components/BottomNavbar';
import {Card} from '../components/Card';
import LineBreak from '../components/LineBreak';
import List from '../components/List';

const Home = ({navigation}: any) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  // const [, setData] = useState([]);
  const [saldoCash, setSaldoCash] = useState(0);
  const [saldoCashless, setSaldoCashless] = useState(0);

  const urlBase = 'http://192.168.43.129:8000/api/';
  const urlKey = 'catatan/';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(urlBase + urlKey);
        if (res.data.success) {
          const dataCatatan = res.data.data;
          // setData(dataCatatan);

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
          setSaldoCash(cash);
          setSaldoCashless(cashless);
        } else {
          console.error('Failed to fetch data: ', res.data.message);
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(urlBase + urlKey);
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
        setSaldoCash(cash);
        setSaldoCashless(cashless);
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

  // const [searchInput, setSearchInput] = useState('');
  // const [searchResults, setSearchResults] = useState([]);

  // const handleSearch = () => {
  //   if (searchInput && data && Array.isArray(data)) {
  //     const filteredData = data.filter(
  //       (item: any) =>
  //         item.fieldToSearch &&
  //         item.fieldToSearch.toLowerCase().includes(searchInput.toLowerCase()),
  //     );
  //     setSearchResults(filteredData);
  //   }
  // };

  return (
    <SafeAreaView style={[backgroundStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
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
          Beranda
        </Text>
        <View
          style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center'}}>
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
                }}>
                Cash: {''}
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
                }}>
                Cashless: {''}
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
        <View style={{alignItems: 'center'}}>
          <Card>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: 350,
                borderWidth: 0.5,
                borderColor: '#d1d1d1',
                borderRadius: 10,
              }}>
              <Svg
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#d1d1d1"
                width={20}
                height={20}
                style={{
                  marginLeft: 4,
                }}>
                <Path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </Svg>
              <TextInput
                placeholder="Cari catatan"
                style={{
                  flex: 1,
                  height: 40,
                  marginHorizontal: 4,
                }}
                // value={searchInput}
                // onChangeText={text => setSearchInput(text)}
                // onSubmitEditing={handleSearch}
              />
            </View>
          </Card>
        </View>
        {/* {searchResults.length > 0 ? (
          // Tampilkan hasil pencarian
          <FlatList
            data={searchResults}
            renderItem={(item: any) => (
              // Tampilkan item hasil pencarian
              <Text>{item.fieldToDisplay}</Text>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          // Tampilkan data asli jika tidak ada pencarian
          <FlatList
            data={data}
            renderItem={(item: any) => (
              // Tampilkan item data asli
              <Text>{item.fieldToDisplay}</Text>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        )} */}

        <View>
          <List navigation={navigation} />
        </View>

        <View style={{marginVertical: 8}}>
          <LineBreak />
        </View>

        <View
          style={{
            alignItems: 'center',
            paddingTop: 10,
            paddingHorizontal: 20,
            backgroundColor: '#f2f2f2',
          }}>
          <Text style={{textAlign: 'center'}}>
            Kelola uang jadi seru dan mudah dengan{' '}
            <Text style={{fontWeight: 'bold', color: '#0284C7'}}>NOTAKOS.</Text>
            Yuk, mulai catat sekarang!
          </Text>
        </View>
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
    shadowColor: '#0284C7',
    shadowOpacity: 0.25,
    shadowOffset: {width: 0, height: 10},
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
  },
  textPath: {fontSize: 18, fontWeight: 'bold', padding: 30},
});

export default Home;
