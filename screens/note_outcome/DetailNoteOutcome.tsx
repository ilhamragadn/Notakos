/* eslint-disable react-native/no-inline-styles */
import {CheckBox} from '@rneui/themed';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
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

type DataCatatan = {
  deskripsi: string | null;
  kategori: string;
  total_uang_keluar: number;
  created_at: string;
  catatan_pengeluaran: CatatanPengeluaran[];
};

type CatatanPengeluaran = {
  catatan_id: number;
  nama_barang: string;
  harga_barang: number;
  satuan_barang: number;
  nominal_uang_keluar: number;
  jenis_kebutuhan: string;
  kategori_uang_keluar: string;
};

const DetailNoteOutcome = ({navigation, route}: any) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  const [isInfoType, setIsInfoType] = useState(false);

  const [data, setData] = useState<DataCatatan>();
  const [selectedCategory, setSelectedCategory] = useState('Cash');
  const [selectedTypeOutcome, setSelectedTypeOutcome] =
    useState('Kebutuhan Primer');
  const {itemId} = route.params;

  useEffect(() => {
    axios
      .get('http://192.168.43.129:8000/api/catatan/' + `${itemId}`)
      .then(res => {
        if (res.data.success) {
          const catatanData = res.data.data;
          setData(catatanData);

          if (catatanData.catatan_pengeluaran) {
            const isCash = catatanData.catatan_pengeluaran.some(
              (item: any) => item.kategori_uang_keluar === 'Cash',
            );
            setSelectedCategory(isCash ? 'Cash' : 'Cashless');

            const isTypeOutcomePrimer = catatanData.catatan_pengeluaran.some(
              (item: any) => item.jenis_kebutuhan === 'Kebutuhan Primer',
            );

            const isTypeOutcomeSekunder = catatanData.catatan_pengeluaran.some(
              (item: any) => item.jenis_kebutuhan === 'Kebutuhan Sekunder',
            );

            if (isTypeOutcomePrimer) {
              setSelectedTypeOutcome('Kebutuhan Primer');
            } else if (isTypeOutcomeSekunder) {
              setSelectedTypeOutcome('Kebutuhan Sekunder');
            } else {
              setSelectedTypeOutcome('Kebutuhan Darurat');
            }
          }
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
              <View key={item.catatan_id}>
                <Card>
                  <View style={styles.box}>
                    <Text style={styles.label}>Nama Barang/Keperluan</Text>
                    <TextInput
                      defaultValue={item.nama_barang}
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
                        readOnly={true}
                        defaultValue={formatCurrency(item.harga_barang)}
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
                        <View style={styles.input_category}>
                          <CheckBox
                            title="Primer"
                            style={{marginVertical: 0}}
                            checked={selectedTypeOutcome === 'Kebutuhan Primer'}
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
                            title="Sekunder"
                            style={{marginVertical: 0}}
                            checked={
                              selectedTypeOutcome === 'Kebutuhan Sekunder'
                            }
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
                        <View
                          style={[styles.input_category, {marginBottom: 8}]}>
                          <CheckBox
                            title="Darurat"
                            style={{marginVertical: 0}}
                            checked={
                              selectedTypeOutcome === 'Kebutuhan Darurat'
                            }
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
                  <View style={{flex: 1}}>
                    <Card>
                      <View style={styles.box}>
                        <Text style={styles.label}>Kategori Uang Keluar</Text>
                        <View style={{marginTop: 4}}>
                          <CheckBox
                            title="Cash"
                            checked={selectedCategory === 'Cash'}
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
                        <View style={{marginBottom: 2}}>
                          <CheckBox
                            title="Cashless"
                            checked={selectedCategory === 'Cashless'}
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
                              Berikut ini adalah jenis kebutuhan Anda. Kebutuhan
                              primer meliputi: biaya sewa kost, makan,
                              tranportasi, dan keperluan lainnya yang terkait
                              perkuliahan. Kebutuhan sekunder meliputi:
                              kebutuhan di luar terkait perkuliahan atau
                              keinginan pribadi. Terakhir, merupakan untuk
                              darurat bisa meliputi: pengeluaran tidak terduga
                              atau pengeluaran kritis yang menggunakan dana
                              tabungan, investasi.
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
            <View
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
                  onPress={() => navigation.navigate('EditNoteOutcome')}>
                  <EditButton />
                </TouchableOpacity>
              </View>
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
    borderBottomColor: '#845FAC',
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
    height: 80,
    width: 150,
    margin: 5,
    padding: 10,
    borderWidth: 2,
    borderColor: '#845FAC',
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
