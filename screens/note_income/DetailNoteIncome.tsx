/* eslint-disable react-native/no-inline-styles */
import {CheckBox} from '@rneui/themed';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
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
import {BackButton} from '../../components/BackButton';
import {Card} from '../../components/Card';
import DeleteButton from '../../components/DeleteButton';
import EditButton from '../../components/EditButton';
import LineBreak from '../../components/LineBreak';

type DataCatatan = {
  deskripsi: string | null;
  kategori: string;
  total_uang_masuk: number;
  created_at: string;
  catatan_pemasukan: CatatanPemasukan[];
};

type CatatanPemasukan = {
  id: number;
  kategori_uang_masuk: string;
  nominal_uang_masuk: number;
  created_at: string;
};

const DetailNoteIncome = ({navigation, route}: any) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const {itemId} = route.params;
  const [data, setData] = useState<DataCatatan>();

  useEffect(() => {
    axios
      .get('http://192.168.43.129:8000/api/catatan/' + `${itemId}`)
      .then(res => {
        if (res.data.success) {
          const catatanData = res.data.data;
          setData(catatanData);
          // console.log(catatanData);
        } else {
          console.error('Failed to fetch data: ', res.data.message);
        }
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  }, [itemId]);

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
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.textPath}>Detail Catatan Pemasukan</Text>
          <View style={{justifyContent: 'center', marginHorizontal: 6}}>
            <Svg
              fill="none"
              viewBox="0 0 24 24"
              width={20}
              height={20}
              strokeWidth={1.5}
              stroke="#ffffff">
              <Path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
              />
            </Svg>
          </View>
        </View>
      </View>
      <ScrollView style={{flex: 1}}>
        {data ? (
          <View style={styles.container}>
            <Card>
              <View style={styles.box}>
                <Text style={styles.label}>Deskripsi Catatan Pemasukan</Text>
                <TextInput
                  defaultValue={data.deskripsi || 'Tidak ada deskripsi catatan'}
                  readOnly={true}
                  style={styles.input_deskripsi}
                  multiline={true}
                  numberOfLines={4}
                />
              </View>
            </Card>
            <LineBreak />
            {data.catatan_pemasukan.map(item => (
              <View key={item.id}>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1}}>
                    <Card>
                      <View style={styles.box}>
                        <Text style={styles.label}>Nominal Uang Masuk</Text>
                        <TextInput
                          readOnly={true}
                          style={styles.input_source}
                          defaultValue={formatCurrency(item.nominal_uang_masuk)}
                        />
                      </View>
                    </Card>
                  </View>
                  <View style={{flex: 1}}>
                    <Card>
                      <View style={styles.box}>
                        <Text style={styles.label}>Kategori Uang Masuk</Text>
                        <View style={styles.input_category}>
                          <CheckBox
                            title="Cash"
                            checked={item.kategori_uang_masuk === 'Cash'}
                            checkedIcon={
                              <Svg viewBox="0 0 512 512" width={20} height={20}>
                                <Path
                                  fill="#0D6EFD"
                                  d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256-96a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"
                                />
                              </Svg>
                            }
                            uncheckedIcon={
                              <Svg viewBox="0 0 512 512" width={20} height={20}>
                                <Path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z" />
                              </Svg>
                            }
                          />
                        </View>
                        <View style={styles.input_category}>
                          <CheckBox
                            title="Cashless"
                            checked={item.kategori_uang_masuk === 'Cashless'}
                            checkedIcon={
                              <Svg viewBox="0 0 512 512" width={20} height={20}>
                                <Path
                                  fill="#0D6EFD"
                                  d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256-96a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"
                                />
                              </Svg>
                            }
                            uncheckedIcon={
                              <Svg viewBox="0 0 512 512" width={20} height={20}>
                                <Path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z" />
                              </Svg>
                            }
                          />
                        </View>
                      </View>
                    </Card>
                  </View>
                </View>
              </View>
            ))}
            <LineBreak />
            <Card>
              <View style={[styles.box, {width: 360}]}>
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>Total</Text>
                <View style={styles.card}>
                  <TextInput
                    style={styles.input_total}
                    readOnly={true}
                    inputMode="numeric"
                    defaultValue={formatCurrency(data.total_uang_masuk)}
                  />
                </View>
              </View>
            </Card>
            {/* <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: 8,
              }}>
              <BackButton />
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity>
                  <DeleteButton />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate('EditNoteIncome')}>
                  <EditButton />
                </TouchableOpacity>
              </View>
            </View> */}

            <View style={{flexDirection: 'row', marginTop: 8}}>
              <View style={{flex: 1}}>
                <DeleteButton />
              </View>
              <View style={{flex: 1}}>
                <EditButton />
              </View>
            </View>
            <View style={{flex: 1}}>
              <BackButton />
            </View>
          </View>
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
  textPath: {
    fontSize: 18,
    color: 'white',
    paddingVertical: 30,
    paddingLeft: 30,
    fontWeight: '600',
  },
  container: {margin: 5},
  box: {
    marginVertical: 2,
    padding: 5,
  },
  label: {
    fontWeight: '500',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 6,
    borderBottomWidth: 2,
    borderBottomColor: '#845FAC',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  input_primary: {
    height: 40,
    width: 340,
    margin: 5,
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#845FAC',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    color: '#000000',
  },
  input_secondary: {
    height: 40,
    width: 150,
    borderBottomWidth: 2,
    borderBottomColor: '#845FAC',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    color: '#000000',
    margin: 5,
    padding: 10,
  },
  input_deskripsi: {
    margin: 5,
    padding: 10,
    borderWidth: 2,
    borderColor: '#845FAC',
    borderRadius: 10,
    textAlignVertical: 'top',
    color: '#000000',
  },
  input_source: {
    height: 70,
    margin: 5,
    padding: 10,
    borderWidth: 2,
    borderColor: '#845FAC',
    borderRadius: 10,
    textAlignVertical: 'top',
    color: '#000000',
  },
  input_category: {
    height: 40,
    width: 160,
  },
  input_total: {
    flex: 1,
    height: 40,
    marginRight: 8,
    color: '#000000',
    fontSize: 17,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  cardInfo: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 163, 255, 0.1)',
    borderColor: '#0D6EFD',
    borderWidth: 1,
    borderRadius: 10,
    padding: 6,
  },
  text: {
    color: '#0D6EFD',
    textAlign: 'justify',
  },
});

export default DetailNoteIncome;
