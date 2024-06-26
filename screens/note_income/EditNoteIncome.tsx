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
import LineBreak from '../../components/LineBreak';
import SubmitButton from '../../components/SubmitButton';
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
  id: number;
  variabel_alokasi: string;
};

const EditNoteIncome = ({navigation, route}: any) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  const {itemId} = route.params;

  const [data, setData] = useState<DataCatatan | null>(null);
  const [sections, setSections] = useState([
    {
      nominal: '0',
      kategori: 'Cash',
      kategoriAlokasi: '',
    },
  ]);

  const fetchDatabyID = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/catatan/${itemId}`);
      if (res.data.success) {
        const dataCatatan = res.data.data;
        setData(dataCatatan);
        // console.log(dataCatatan);

        const updatedSections = dataCatatan.catatan_pemasukan.map(
          (pemasukan: any) => {
            const allocation = dataCatatan.alokasis.find(
              (alokasi: any) =>
                alokasi.pivot.catatan_id === pemasukan.catatan_id,
            );
            return {
              nominal: pemasukan.nominal_uang_masuk.toString(),
              kategori: pemasukan.kategori_uang_masuk,
              kategoriAlokasi: allocation
                ? allocation.pivot.variabel_teralokasi
                : '',
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

  const formatCurrency = (value: string): string => {
    const amountValue = value.replace(/[^\d]/g, '');
    const amount = parseInt(amountValue, 10);
    if (isNaN(amount)) {
      return 'Rp 0';
    }
    return amount.toLocaleString('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
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

  const handleCategoryAllocation = (
    categoryAllocation: string,
    sectionIndex: number,
    allocationIndex: number,
  ) => {
    const updatedSections = sections.map((section, i) =>
      i === sectionIndex
        ? {...section, kategoriAlokasi: categoryAllocation}
        : section,
    );
    setSections(updatedSections);

    setData((prevData: any) => {
      if (!prevData) {
        return prevData;
      }

      const updatedAlokasi = prevData.alokasis.map((item: any, i: any) =>
        i === sectionIndex
          ? {
              ...item,
              pivot: {
                ...item.pivot,
                variabel_teralokasi: categoryAllocation,
                alokasi_id: allocationData[allocationIndex].id,
              },
            }
          : item,
      );

      return {
        ...prevData,
        alokasis: updatedAlokasi,
      };
    });
  };

  const allocationSection = (sectionIndex: number) => {
    return allocationData.map((allocation, allocationIndex) => (
      <View key={allocationIndex} style={{height: 32, marginBottom: 4}}>
        <View>
          <CheckBox
            title={allocation.variabel_alokasi}
            textStyle={{fontWeight: 'normal', textTransform: 'capitalize'}}
            checked={
              allocation.variabel_alokasi ===
              sections[sectionIndex]?.kategoriAlokasi
            }
            onPress={() =>
              handleCategoryAllocation(
                allocation.variabel_alokasi,
                sectionIndex,
                allocationIndex,
              )
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
    ));
  };

  const handleNominalChange = (index: number, newTotal: string) => {
    const updatedSections = [...sections];
    updatedSections[index].nominal = newTotal;
    setSections(updatedSections);

    const nominalValue = parseInt(newTotal.replace(/[^\d]/g, ''), 10);

    setData((prevData: any) => {
      if (!prevData) {
        return prevData;
      }

      const updatedNominal = prevData.catatan_pemasukan.map(
        (item: any, i: any) =>
          i === index
            ? {
                ...item,
                nominal_uang_masuk: new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(nominalValue),
              }
            : item,
      );

      const updatedSaldoTeralokasi = prevData.alokasis.map(
        (item: any, i: any) => {
          if (i === index) {
            return {
              ...item,
              pivot: {
                ...item.pivot,
                saldo_teralokasi: new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(nominalValue),
              },
            };
          }
          return item;
        },
      );

      return {
        ...prevData,
        catatan_pemasukan: updatedNominal,
        alokasis: updatedSaldoTeralokasi,
      };
    });
  };

  const calculateTotal = useCallback(() => {
    let total = 0;
    sections.forEach(section => {
      total += parseInt(section.nominal.replace(/[^\d]/g, ''), 10);
    });
    return total;
  }, [sections]);

  useEffect(() => {
    const total = calculateTotal();
    setData((prevData: any) => {
      if (!prevData) {
        return prevData;
      }

      return {
        ...prevData,
        total_uang_masuk: formatCurrency(total.toString()),
      };
    });
  }, [calculateTotal]);

  const handleCategoryIncome = (categoryIncome: string, index: number) => {
    const updatedSections = [...sections];
    updatedSections[index].kategori = categoryIncome;
    setSections(updatedSections);

    setData((prevData: any) => {
      if (!prevData) {
        return prevData;
      }

      const updatedCategoryIncome = prevData.catatan_pemasukan.map(
        (item: any, i: any) =>
          i === index
            ? {
                ...item,
                kategori_uang_masuk: categoryIncome,
              }
            : item,
      );

      return {
        ...prevData,
        catatan_pemasukan: updatedCategoryIncome,
      };
    });
  };

  const sectionIncome = () => {
    return sections.map((section, index) => (
      <View key={index}>
        {/* <View
          style={{
            marginRight: 6,
            marginTop: 4,
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
          }}>
          <TouchableOpacity
            onPress={() => removeSection(index)}
            style={{
              backgroundColor: '#DC2626',
              borderRadius: 6,
              paddingHorizontal: 10,
              paddingVertical: 4,
            }}>
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
        </View> */}
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <Card>
              <View style={styles.box}>
                <Text style={styles.label}>Nominal Uang Masuk</Text>
                <TextInput
                  placeholder="Masukkan Nominal Uang"
                  inputMode="numeric"
                  style={styles.input_nominal}
                  value={formatCurrency(section.nominal)}
                  onChangeText={newTotal =>
                    handleNominalChange(index, newTotal)
                  }
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
                    checked={section.kategori === 'Cash'}
                    onPress={() => handleCategoryIncome('Cash', index)}
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
                    checked={section.kategori === 'Cashless'}
                    onPress={() => handleCategoryIncome('Cashless', index)}
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
        <Card>
          <View style={{marginTop: 6, marginBottom: 24, paddingHorizontal: 6}}>
            <Text style={styles.label}>Alokasi Ke</Text>
            {allocationSection(index)}
          </View>
        </Card>
        <LineBreak />
      </View>
    ));
  };

  console.log(data?.alokasis.map(e => e.pivot.variabel_teralokasi));
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
            Edit Catatan Pemasukan
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
                  <Text style={styles.label}>Deskripsi Catatan Pemasukan</Text>
                  {data.deskripsi !== null ? (
                    <TextInput
                      value={data.deskripsi}
                      style={styles.input_deskripsi}
                      multiline={true}
                      numberOfLines={4}
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

              <LineBreak />

              <View>{sectionIncome()}</View>

              <Card>
                <View style={styles.box}>
                  <Text style={{fontSize: 16, fontWeight: 'bold'}}>Total</Text>
                  <View style={styles.card}>
                    <TextInput
                      style={styles.input_total}
                      editable={false}
                      value={formatCurrency(data.total_uang_masuk.toString())}
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
});

export default EditNoteIncome;
