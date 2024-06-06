/* eslint-disable react-native/no-inline-styles */
import {CheckBox} from '@rneui/themed';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import Svg, {Path} from 'react-native-svg';
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
  total_uang_keluar: number;
  created_at: string;
  catatan_pengeluaran: CatatanPengeluaran[];
};

type CatatanPengeluaran = {
  id: number;
  nama_barang: string;
  harga_barang: number;
  satuan_barang: number;
  jenis_kebutuhan: string;
  kategori_uang_keluar: string;
  nominal_uang_keluar: number;
  created_at: string;
};

type DataAlokasi = {
  variabel_alokasi: string;
};

const DetailNoteOutcome = ({navigation, route}: any) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  const [isInfoType, setIsInfoType] = useState(false);

  const [data, setData] = useState<DataCatatan>();

  const {itemId} = route.params;

  const [typeOfNeed, setTypeOfNeed] = useState('');

  useEffect(() => {
    axios
      .get(`${API_URL}/catatan/${itemId}`)
      .then(res => {
        if (res.data.success) {
          const catatanData = res.data.data;
          setData(catatanData);
          // console.log(catatanData);

          let jenisKebutuhan = '';
          catatanData.catatan_pengeluaran.forEach((element: any) => {
            jenisKebutuhan = element.jenis_kebutuhan;
          });

          setTypeOfNeed(jenisKebutuhan);
        } else {
          console.error('Failed to fetch data: ', res.data.message);
        }
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  }, [itemId]);

  const formatCurrency = (amount: number) => {
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
      <View key={allocationIndex}>
        {allocation.variabel_alokasi === 'Semua Alokasi' ? (
          <View />
        ) : (
          <View style={[styles.input_category, {marginBottom: 4}]}>
            <CheckBox
              title={allocation.variabel_alokasi}
              textStyle={{fontWeight: 'normal', textTransform: 'capitalize'}}
              checked={allocation.variabel_alokasi === typeOfNeed}
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
        )}
      </View>
    ));
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'dark-content' : 'light-content'}
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
        <Text style={styles.textPath}>Detail Catatan Pengeluaran</Text>
      </View>
      <ScrollView style={{flex: 1}}>
        {data ? (
          <View style={styles.container}>
            <Card>
              <View style={styles.box}>
                <Text style={styles.label}>Deskripsi Catatan Pengeluaran</Text>
                <TextInput
                  defaultValue={data.deskripsi || 'Tidak ada deskripsi'}
                  readOnly={true}
                  style={styles.input_deskripsi}
                  multiline={true}
                  numberOfLines={4}
                />
              </View>
            </Card>
            <LineBreak />
            {data.catatan_pengeluaran.map(item => (
              <View key={item.id}>
                <Card>
                  <View style={styles.box}>
                    <Text style={styles.label}>Nama Barang/Keperluan</Text>
                    <TextInput
                      value={item.nama_barang}
                      readOnly={true}
                      style={styles.input_primary}
                    />
                  </View>
                </Card>
                <View style={{flexDirection: 'row'}}>
                  <Card>
                    <View style={styles.box}>
                      <Text style={styles.label}>Harga</Text>
                      <TextInput
                        style={styles.input_secondary}
                        editable={false}
                        value={formatCurrency(item.harga_barang)}
                      />
                    </View>
                  </Card>
                  <Card>
                    <View style={styles.box}>
                      <Text style={styles.label}>Satuan</Text>
                      <TextInput
                        style={[styles.input_secondary, {textAlign: 'center'}]}
                        readOnly={true}
                        defaultValue={item.satuan_barang.toLocaleString(
                          'id-ID',
                          {minimumFractionDigits: 0, maximumFractionDigits: 0},
                        )}
                      />
                    </View>
                  </Card>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1}}>
                    <Card>
                      <View style={styles.box}>
                        <View style={{flexDirection: 'row'}}>
                          <Text style={[styles.label, {flex: 1}]}>
                            Jenis Kebutuhan
                          </Text>
                          <TouchableOpacity
                            onPress={() => setIsInfoType(!isInfoType)}>
                            <Svg
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="#0D6EFD"
                              width={20}
                              height={20}>
                              <Path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                              />
                            </Svg>
                          </TouchableOpacity>
                        </View>
                        {allocationSection()}
                      </View>
                    </Card>
                  </View>
                  <View style={{flex: 1}}>
                    <Card>
                      <View style={styles.box}>
                        <Text style={styles.label}>Kategori Uang Keluar</Text>
                        <View style={[styles.input_category, {marginTop: 4}]}>
                          <CheckBox
                            title="Cash"
                            checked={item.kategori_uang_keluar === 'Cash'}
                            textStyle={{fontWeight: 'normal'}}
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
                        <View style={{marginBottom: 4}}>
                          <CheckBox
                            title="Cashless"
                            checked={item.kategori_uang_keluar === 'Cashless'}
                            textStyle={{fontWeight: 'normal'}}
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
                <Modal
                  transparent={true}
                  animationType="fade"
                  visible={isInfoType}>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      flex: 1,
                    }}>
                    <Card>
                      <View style={styles.box}>
                        <View style={styles.cardInfo}>
                          <View>
                            <Svg
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="#0D6EFD"
                              width={20}
                              height={20}>
                              <Path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                              />
                            </Svg>
                          </View>
                          <View style={{width: 300, marginHorizontal: 4}}>
                            <Text style={styles.text}>
                              Berikut ini adalah jenis kebutuhan Anda
                              berdasarkan dari alokasi yang sudah Anda buat
                              sebelumnya.
                            </Text>
                          </View>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={{alignItems: 'center', marginVertical: 4}}
                        onPress={() => setIsInfoType(!isInfoType)}>
                        <Svg
                          width={25}
                          height={25}
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="#000000">
                          <Path
                            d="M6 18 18 6M6 6l12 12"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </Svg>
                      </TouchableOpacity>
                    </Card>
                  </View>
                </Modal>
                <Card>
                  <View style={styles.box}>
                    <Text style={styles.label}>Jumlah Harga</Text>
                    <TextInput
                      placeholder="Jumlah Harga"
                      style={[styles.input_primary, {textAlign: 'center'}]}
                      readOnly={true}
                      defaultValue={formatCurrency(item.nominal_uang_keluar)}
                    />
                  </View>
                </Card>
              </View>
            ))}
            <LineBreak />
            <Card>
              <View style={styles.box}>
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>Total</Text>
                <View style={styles.card}>
                  <TextInput
                    style={styles.input_total}
                    readOnly={true}
                    defaultValue={formatCurrency(data.total_uang_keluar)}
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
                  onPress={() =>
                    navigation.navigate('EditNoteOutcome', {itemId: data.id})
                  }
                  textButton="Edit"
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
  },
  textPath: {
    fontSize: 18,
    color: 'white',
    padding: 30,
    fontWeight: '600',
  },
  container: {margin: 5},
  box: {
    marginVertical: 2,
    padding: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
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
  input_primary: {
    height: 40,
    width: 340,
    margin: 5,
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#0284C7',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    color: '#000000',
  },
  input_secondary: {
    height: 40,
    width: 150,
    borderBottomWidth: 2,
    borderBottomColor: '#0284C7',
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
    borderColor: '#0284C7',
    borderRadius: 10,
    textAlignVertical: 'top',
    color: '#000000',
  },
  input_source: {
    height: 80,
    width: 150,
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
    marginRight: 8,
    color: '#000000',
    fontSize: 17,
    textAlign: 'right',
    fontWeight: 'bold',
  },
});

export default DetailNoteOutcome;
