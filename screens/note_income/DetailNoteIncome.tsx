/* eslint-disable react-native/no-inline-styles */
import {CheckBox} from '@rneui/themed';
import axios from 'axios';
import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
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
import {API_URL} from '../../context/AuthContext';

type DataCatatan = {
  id: number;
  deskripsi: string | null;
  kategori: string;
  total_uang_masuk: number;
  created_at: string;
  catatan_pemasukan: CatatanPemasukan[];
  alokasis: Alokasis[];
};

type CatatanPemasukan = {
  id: number;
  kategori_uang_masuk: string;
  nominal_uang_masuk: number;
  created_at: string;
};

type Alokasis = {
  id: number;
  variabel_alokasi: string;
  persentase_alokasi: number;
  created_at: string;
  pivot: {
    catatan_id: number;
    alokasi_id: number;
    variabel_teralokasi: string;
    saldo_teralokasi: number;
    created_at: string;
  };
};

type DataAlokasi = {
  variabel_alokasi: string;
};

const DetailNoteIncome = ({navigation, route}: any) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  const {itemId} = route.params;

  const [data, setData] = useState<DataCatatan | null>(null);

  const [variabelTerpilih, setVariabelTerpilih] = useState('');

  const fetchDatabyID = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/catatan/${itemId}`);
      if (res.data.success) {
        const dataCatatan = res.data.data;
        setData(dataCatatan);
        // console.log(dataCatatan);

        let variabelTeralokasi = '';
        dataCatatan.alokasis.forEach((element: any) => {
          variabelTeralokasi = element.pivot.variabel_teralokasi;
        });
        console.log(variabelTeralokasi);

        setVariabelTerpilih(variabelTeralokasi);
      } else {
        console.error('Failed to fetch data: ', res.data.message);
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  }, [itemId]);

  useEffect(() => {
    fetchDatabyID();
  }, [fetchDatabyID]);

  console.log(data);

  const formatCurrency = (amount: number) => {
    if (isNaN(amount)) {
      return 'Rp ';
    }
    return amount.toLocaleString('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteData = async (id: any) => {
    try {
      setIsLoading(true);
      const response = await axios.delete(`${API_URL}/catatan/${id}`);
      setIsLoading(false);
      Alert.alert('Berhasil', 'Catatan telah dihapus!');
      navigation.navigate('Home');
      console.log(response.data);
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Gagal', 'Catatan gagal dihapus!');
      console.error(error);
    }
  };

  const [allocationData, setAllocationData] = useState<DataAlokasi[]>([]);

  useEffect(() => {
    const fetchAllocation = async () => {
      try {
        const res = await axios.get(`${API_URL}/alokasi`);
        if (res.data.success) {
          const dataAlokasi = res.data.data;
          // console.log(dataAlokasi);
          setAllocationData(dataAlokasi);
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchAllocation();
  }, []);

  const allocationSection = () => {
    return allocationData.map((allocation, allocationIndex) => (
      <View key={allocationIndex} style={{height: 32, marginBottom: 4}}>
        <View>
          <CheckBox
            title={allocation.variabel_alokasi}
            textStyle={{fontWeight: 'normal', textTransform: 'capitalize'}}
            checked={allocation.variabel_alokasi === variabelTerpilih}
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
    ));
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
        <View style={{flexDirection: 'row'}}>
          <Text
            style={[
              styles.textPath,
              {color: isDarkMode ? '#0284C7' : Colors.lighter},
            ]}>
            Detail Catatan Pemasukan
          </Text>
          <View style={{justifyContent: 'center', marginHorizontal: 6}}>
            <Svg
              fill="none"
              viewBox="0 0 24 24"
              width={20}
              height={20}
              strokeWidth={1.5}
              stroke={isDarkMode ? '#0284C7' : Colors.lighter}>
              <Path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
              />
            </Svg>
          </View>
        </View>
      </View>
      {isLoading ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FFFFFF',
          }}>
          <ActivityIndicator size="large" color="#0284C7" />
        </View>
      ) : (
        <ScrollView>
          {data ? (
            <View style={styles.container}>
              <Card>
                <View style={styles.box}>
                  <Text style={styles.label}>Deskripsi Catatan Pemasukan</Text>
                  {data.deskripsi !== null ? (
                    <TextInput
                      value={data.deskripsi}
                      editable={false}
                      style={styles.input_deskripsi}
                      multiline={true}
                      numberOfLines={4}
                    />
                  ) : (
                    <TextInput
                      placeholder="Tidak ada deskripsi catatan"
                      editable={false}
                      style={styles.input_deskripsi}
                      multiline={true}
                      numberOfLines={4}
                    />
                  )}
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
                            editable={false}
                            style={styles.input_nominal}
                            value={formatCurrency(item?.nominal_uang_masuk)}
                          />
                        </View>
                      </Card>
                    </View>

                    <View style={{flex: 1}}>
                      <Card>
                        <View style={styles.box}>
                          <Text style={styles.label}>Kategori Uang Masuk</Text>
                          <View style={[styles.input_category, {marginTop: 4}]}>
                            <CheckBox
                              title="Cash"
                              checked={item.kategori_uang_masuk === 'Cash'}
                              textStyle={{fontWeight: 'normal'}}
                              checkedIcon={
                                <Svg
                                  viewBox="0 0 512 512"
                                  width={20}
                                  height={20}>
                                  <Path
                                    fill="#0D6EFD"
                                    d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256-96a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"
                                  />
                                </Svg>
                              }
                              uncheckedIcon={
                                <Svg
                                  viewBox="0 0 512 512"
                                  width={20}
                                  height={20}>
                                  <Path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z" />
                                </Svg>
                              }
                            />
                          </View>
                          <View style={{marginBottom: 4}}>
                            <CheckBox
                              title="Cashless"
                              checked={item.kategori_uang_masuk === 'Cashless'}
                              textStyle={{fontWeight: 'normal'}}
                              checkedIcon={
                                <Svg
                                  viewBox="0 0 512 512"
                                  width={20}
                                  height={20}>
                                  <Path
                                    fill="#0D6EFD"
                                    d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256-96a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"
                                  />
                                </Svg>
                              }
                              uncheckedIcon={
                                <Svg
                                  viewBox="0 0 512 512"
                                  width={20}
                                  height={20}>
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

              <Card>
                <View style={styles.box}>
                  <Text style={styles.label}>Uang Dialokasikan Ke</Text>
                  {allocationSection()}
                </View>
              </Card>

              <View style={{marginVertical: 2}}>
                <LineBreak />
              </View>

              <Card>
                <View style={styles.box}>
                  <Text style={{fontSize: 16, fontWeight: 'bold'}}>Total</Text>
                  <View style={styles.card}>
                    <TextInput
                      style={styles.input_total}
                      editable={false}
                      value={formatCurrency(data.total_uang_masuk)}
                    />
                  </View>
                </View>
              </Card>

              <View style={{flexDirection: 'row', marginTop: 8}}>
                <View style={{flex: 1}}>
                  <DeleteButton
                    onPress={() => handleDeleteData(itemId)}
                    disabled={isLoading}
                  />
                </View>
                <View style={{flex: 1}}>
                  <EditButton
                    textButton="Edit"
                    onPress={() =>
                      navigation.navigate('EditNoteIncome', {itemId: data.id})
                    }
                  />
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
              <ActivityIndicator size="large" color="#0284C7" />
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  boxPath: {
    flexDirection: 'row',
  },
  textPath: {
    fontSize: 18,
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
    borderBottomColor: '#0284C7',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  input_deskripsi: {
    margin: 5,
    padding: 10,
    borderWidth: 2,
    borderColor: '#0284C7',
    borderRadius: 10,
    textAlignVertical: 'top',
    color: '#000000',
  },
  input_nominal: {
    height: 80,
    margin: 5,
    padding: 10,
    borderWidth: 2,
    borderColor: '#0284C7',
    borderRadius: 10,
    textAlignVertical: 'top',
    color: '#000000',
  },
  input_category: {
    height: 32,
  },
  input_total: {
    flex: 1,
    height: 40,
    color: '#000000',
    fontSize: 17,
    textAlign: 'center',
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
