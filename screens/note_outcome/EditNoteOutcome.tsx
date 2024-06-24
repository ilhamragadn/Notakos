/* eslint-disable react-native/no-inline-styles */
import {CheckBox} from '@rneui/themed';
import axios from 'axios';
import React, {useCallback, useEffect, useState} from 'react';
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
import LineBreak from '../../components/LineBreak';
import SubmitButton from '../../components/SubmitButton';
import {API_URL} from '../../context/AuthContext';

type DataCatatan = {
  id: number;
  deskripsi: string;
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

const EditNoteOutcome = ({navigation, route}: any) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  const {itemId} = route.params;

  const [data, setData] = useState<DataCatatan | null>(null);

  const [sections, setSections] = useState([
    {
      namaBarang: '',
      harga: 0,
      satuan: 1,
      jumlahHarga: 0,
      jenisKebutuhan: '',
      kategoriUang: 'Cash',
    },
  ]);

  const fetchDatabyID = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/catatan/${itemId}`);
      if (res.data.success) {
        const dataCatatan = res.data.data;
        setData(dataCatatan);
        console.log(dataCatatan);

        const updatedSections = dataCatatan.catatan_pengeluaran.map(
          (pengeluaran: any) => {
            return {
              namaBarang: pengeluaran.nama_barang,
              harga: pengeluaran.harga_barang,
              satuan: pengeluaran.satuan_barang,
              jumlahHarga: pengeluaran.nominal_uang_keluar,
              jenisKebutuhan: pengeluaran.jenis_kebutuhan,
              kategoriUang: pengeluaran.kategori_uang_keluar,
            };
          },
        );

        setSections(updatedSections);
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

  const handleTypeofNeedSection = (
    typeOutcome: string,
    sectionIndex: number,
    allocationIndex: number,
  ) => {
    const updatedSections = sections.map((section, i) =>
      i === sectionIndex ? {...section, jenisKebutuhan: typeOutcome} : section,
    );
    setSections(updatedSections);

    const updatedAllocation = allocationData.map((allocation, i) =>
      i === allocationIndex
        ? {...allocation, variabel_alokasi: typeOutcome}
        : allocation,
    );
    setAllocationData(updatedAllocation);

    setData((prevData: any) => {
      if (!prevData) {
        return prevData;
      }

      const updatedTypeOfNeed = prevData.catatan_pengeluaran.map(
        (item: any, i: any) =>
          i === sectionIndex
            ? {
                ...item,
                jenis_kebutuhan: typeOutcome,
              }
            : item,
      );

      return {
        ...prevData,
        catatan_pengeluaran: updatedTypeOfNeed,
      };
    });
  };

  const typeofNeedSection = (sectionIndex: number) => {
    return allocationData.map((allocation, allocationIndex) => (
      <View key={allocationIndex}>
        {allocation.variabel_alokasi === 'Semua Alokasi' ? (
          <View />
        ) : (
          <View style={styles.input_category}>
            <CheckBox
              title={allocation.variabel_alokasi}
              textStyle={{fontWeight: 'normal'}}
              checked={
                allocation.variabel_alokasi ===
                sections[sectionIndex]?.jenisKebutuhan
              }
              onPress={() =>
                handleTypeofNeedSection(
                  allocation.variabel_alokasi,
                  sectionIndex,
                  allocationIndex,
                )
              }
              checkedIcon={
                <Svg viewBox="0 0 512 512" width={18} height={18}>
                  <Path
                    fill="#0D6EFD"
                    d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256-96a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"
                  />
                </Svg>
              }
              uncheckedIcon={
                <Svg viewBox="0 0 512 512" width={18} height={18}>
                  <Path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z" />
                </Svg>
              }
            />
          </View>
        )}
      </View>
    ));
  };

  const [isInfoType, setIsInfoType] = useState(false);

  const handleItemName = (itemName: string, index: number) => {
    const updatedsections = [...sections];
    updatedsections[index].namaBarang = itemName;
    setSections(updatedsections);

    setData((prevData: any) => {
      if (!prevData) {
        return prevData;
      }

      const updatedItemName = prevData.catatan_pengeluaran.map(
        (item: any, i: any) =>
          i === index
            ? {
                ...item,
                nama_barang: itemName,
              }
            : item,
      );

      return {
        ...prevData,
        catatan_pengeluaran: updatedItemName,
      };
    });
  };

  const calcJumlahHarga = (
    index: number,
    newHarga: string,
    newSatuan: string,
  ) => {
    const updatedSections = [...sections];
    updatedSections[index].harga = parseInt(newHarga.replace(/[^\d]/g, ''), 10);
    updatedSections[index].satuan = parseInt(
      newSatuan.replace(/[^\d]/g, ''),
      10,
    );
    updatedSections[index].jumlahHarga =
      updatedSections[index].harga * updatedSections[index].satuan;
    setSections(updatedSections);

    const newHargaValue = parseInt(newHarga.replace(/[^\d]/g, ''), 10);
    const newSatuanValue = parseInt(newSatuan.replace(/[^\d]/g, ''), 10);

    let jumlahHarga = newHargaValue * newSatuanValue;

    let formattedJumlahHarga = 'Rp 0';
    if (!isNaN(jumlahHarga)) {
      formattedJumlahHarga = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(jumlahHarga);
    }

    setData((prevData: any) => {
      if (!prevData) {
        return prevData;
      }

      const updatedItems = prevData.catatan_pengeluaran.map(
        (item: any, i: any) =>
          i === index
            ? {
                ...item,
                harga_barang: new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(newHargaValue),
                satuan_barang: newSatuan,
                nominal_uang_keluar: formattedJumlahHarga,
              }
            : item,
      );

      return {
        ...prevData,
        catatan_pengeluaran: updatedItems,
      };
    });
  };

  const handleCategoryOutcome = (categoryOutcome: string, index: number) => {
    const updatedSections = [...sections];
    updatedSections[index].kategoriUang = categoryOutcome;
    setSections(updatedSections);

    setData((prevData: any) => {
      if (!prevData) {
        return prevData;
      }

      const updatedCategoryOutcome = prevData.catatan_pengeluaran.map(
        (item: any, i: any) =>
          i === index
            ? {
                ...item,
                kategori_uang_keluar: categoryOutcome,
              }
            : item,
      );

      return {
        ...prevData,
        catatan_pengeluaran: updatedCategoryOutcome,
      };
    });
  };

  const calculateTotal = useCallback(() => {
    let total = 0;
    sections.forEach(section => {
      total += section.jumlahHarga;
    });
    return total;
  }, [sections]);

  const formatCurrency = (value: number): string => {
    if (!isNaN(value)) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    }
    return 'Rp 0';
  };

  useEffect(() => {
    const total = calculateTotal();

    setData((prevData: any) => {
      if (!prevData) {
        return prevData;
      }

      return {
        ...prevData,
        total_uang_keluar: formatCurrency(total),
      };
    });
  }, [calculateTotal]);

  const sectionOutcome = () => {
    return sections.map((section, index) => (
      <View key={index}>
        <Card>
          <View style={styles.box}>
            <Text style={styles.label}>Nama Barang/Keperluan</Text>
            <TextInput
              placeholder="Masukkan nama barang atau keperluan"
              style={styles.input_primary}
              value={section.namaBarang}
              onChangeText={text => {
                handleItemName(text, index);
              }}
            />
          </View>
        </Card>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <Card>
              <View style={styles.box}>
                <Text style={styles.label}>Harga</Text>
                <TextInput
                  style={styles.input_secondary}
                  inputMode="numeric"
                  value={formatCurrency(section.harga)}
                  onChangeText={text => {
                    calcJumlahHarga(index, text, section.satuan.toString());
                  }}
                />
              </View>
            </Card>
          </View>

          <View style={{flex: 1}}>
            <Card>
              <View style={styles.box}>
                <Text style={styles.label}>Satuan</Text>
                <TextInput
                  style={[styles.input_secondary, {textAlign: 'center'}]}
                  inputMode="numeric"
                  value={
                    !isNaN(section.satuan) ? section.satuan.toString() : '0'
                  }
                  onChangeText={text => {
                    calcJumlahHarga(index, section.harga.toString(), text);
                  }}
                />
              </View>
            </Card>
          </View>
        </View>

        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <Card>
              <View style={styles.box}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={[styles.label, {flex: 1}]}>Jenis Kebutuhan</Text>
                  <TouchableOpacity onPress={() => setIsInfoType(!isInfoType)}>
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
                {typeofNeedSection(index)}
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
                    checked={section.kategoriUang === 'Cash'}
                    onPress={() => handleCategoryOutcome('Cash', index)}
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
                    checked={section.kategoriUang === 'Cashless'}
                    onPress={() => handleCategoryOutcome('Cashless', index)}
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
        <Modal transparent={true} animationType="fade" visible={isInfoType}>
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
                      Silahkan pilih jenis kebutuhan di bawah ini sesuai dengan
                      alokasi kebutuhan yang sudah dibuat sebelumnya di halaman
                      alokasi.
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  marginVertical: 4,
                  paddingVertical: 6,
                  borderRadius: 8,
                  backgroundColor: '#DC2626',
                }}
                onPress={() => setIsInfoType(!isInfoType)}>
                <Svg
                  width={25}
                  height={25}
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="#ffffff">
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
              style={[styles.input_primary, {paddingLeft: 12}]}
              editable={false}
              value={formatCurrency(section.jumlahHarga)}
            />
          </View>
        </Card>
        <LineBreak />
      </View>
    ));
  };

  console.log(data);
  // console.log(itemId);

  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateNotes = async () => {
    try {
      setIsLoading(true);
      const res = await axios.put(`${API_URL}/catatan/${itemId}`, data);

      setIsLoading(false);
      console.log('Success update: ', res.data);
      Alert.alert('Berhasil', 'Data Berhasil Diperbarui');
      navigation.navigate('Home');
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Gagal', 'Data Gagal Diperbarui');
      console.error(error);
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
        <View style={{flexDirection: 'row'}}>
          <Text
            style={[
              styles.textPath,
              {color: isDarkMode ? '#0284C7' : Colors.lighter},
            ]}>
            Edit Catatan Pengeluaran
          </Text>
          <View style={{justifyContent: 'center', marginHorizontal: 6}}>
            <Svg
              fill={isDarkMode ? '#0284C7' : Colors.lighter}
              viewBox="0 0 24 24"
              width={20}
              height={20}>
              <Path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
              <Path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
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
                  <Text style={styles.label}>
                    Deskripsi Catatan Pengeluaran
                  </Text>
                  {data.deskripsi !== null ? (
                    <TextInput
                      style={styles.input_deskripsi}
                      multiline={true}
                      numberOfLines={4}
                      value={data.deskripsi}
                      onChangeText={text => setData({...data, deskripsi: text})}
                    />
                  ) : (
                    <TextInput
                      placeholder="Tidak ada deskripsi catatan"
                      style={styles.input_deskripsi}
                      multiline={true}
                      numberOfLines={4}
                      onChangeText={text => setData({...data, deskripsi: text})}
                    />
                  )}
                </View>
              </Card>

              {sectionOutcome()}

              <LineBreak />

              <Card>
                <View style={styles.box}>
                  <Text style={{fontSize: 16, fontWeight: 'bold'}}>Total</Text>
                  <View style={styles.card}>
                    <TextInput
                      style={styles.input_total}
                      editable={false}
                      value={data.total_uang_keluar.toString()}
                    />
                  </View>
                </View>
              </Card>
              <View style={{flexDirection: 'row', marginTop: 8}}>
                <View style={{flex: 1}}>
                  <BackButton />
                </View>
                <View style={{flex: 1}}>
                  <SubmitButton
                    textButton="Perbarui"
                    onPress={handleUpdateNotes}
                    disabled={isLoading}
                  />
                </View>
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  label: {
    fontWeight: '500',
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
    margin: 5,
    padding: 10,
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
  },
  input_category: {
    height: 32,
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
  input_total: {
    flex: 1,
    height: 40,
    color: '#000000',
    fontSize: 17,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default EditNoteOutcome;
