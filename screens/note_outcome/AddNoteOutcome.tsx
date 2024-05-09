/* eslint-disable react-native/no-inline-styles */
import {CheckBox} from '@rneui/themed';
import axios, {AxiosError} from 'axios';
import React, {useCallback, useEffect, useState} from 'react';
import {
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
import {Path, Svg} from 'react-native-svg';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {BackButton} from '../../components/BackButton';
import {Card} from '../../components/Card';
import LineBreak from '../../components/LineBreak';
import SubmitButton from '../../components/SubmitButton';

type PostDataState = {
  deskripsi: string;
  kategori: string;
  total_uang_keluar: string;
  catatan_pengeluaran: Array<{
    nama_barang: string;
    harga_barang: string;
    satuan_barang: string;
    nominal_uang_keluar: string;
    jenis_kebutuhan: string;
    kategori_uang_keluar: string;
  }>;
};

const AddNoteOutcome = ({navigation}: any) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  const [sections, setSections] = useState([
    {
      namaBarang: '',
      harga: 0,
      satuan: 1,
      jumlahHarga: 0,
      jenisKebutuhan: 'Kebutuhan Primer',
      kategoriUang: 'Cash',
    },
  ]);

  const addSection = () => {
    setSections([
      ...sections,
      {
        namaBarang: '',
        harga: 0,
        satuan: 1,
        jumlahHarga: 0,
        jenisKebutuhan: 'Kebutuhan Primer',
        kategoriUang: 'Cash',
      },
    ]);

    setPostData(prevData => ({
      ...prevData,
      catatan_pengeluaran: [
        ...prevData.catatan_pengeluaran,
        {
          nama_barang: '',
          harga_barang: 'Rp 0',
          satuan_barang: '1',
          nominal_uang_keluar: 'Rp 0',
          jenis_kebutuhan: 'Kebutuhan Primer',
          kategori_uang_keluar: 'Cash',
        },
      ],
    }));
  };

  const removeSection = (index: number) => {
    const updatedSections = [...sections];
    updatedSections.splice(index, 1);
    setSections(updatedSections);

    setPostData(prevData => ({
      ...prevData,
      catatan_pengeluaran: prevData.catatan_pengeluaran.filter(
        (_, i) => i !== index,
      ),
    }));
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

    setPostData(prevData => ({
      ...prevData,
      catatan_pengeluaran: prevData.catatan_pengeluaran.map((item, idx) =>
        idx === index
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
      ),
    }));
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
    setPostData(prevData => ({
      ...prevData,
      total_uang_keluar: formatCurrency(total),
    }));
  }, [calculateTotal]);

  const handleItemName = (itemName: string, index: number) => {
    const updatedSections = [...sections];
    updatedSections[index].namaBarang = itemName;
    setSections(updatedSections);

    setPostData(prevData => ({
      ...prevData,
      catatan_pengeluaran: prevData.catatan_pengeluaran.map((item, i) =>
        i === index ? {...item, nama_barang: itemName} : item,
      ),
    }));
  };

  const handleCategoryOutcome = (categoryOutcome: string, index: number) => {
    const updatedSections = [...sections];
    updatedSections[index].kategoriUang = categoryOutcome;
    setSections(updatedSections);

    setPostData(prevData => ({
      ...prevData,
      catatan_pengeluaran: prevData.catatan_pengeluaran.map((item, i) =>
        i === index ? {...item, kategori_uang_keluar: categoryOutcome} : item,
      ),
    }));
  };

  const handleTypeOutcome = (typeOutcome: string, index: number) => {
    const updatedSections = [...sections];
    updatedSections[index].jenisKebutuhan = typeOutcome;
    setSections(updatedSections);

    setPostData(prevData => ({
      ...prevData,
      catatan_pengeluaran: prevData.catatan_pengeluaran.map((item, i) =>
        i === index ? {...item, jenis_kebutuhan: typeOutcome} : item,
      ),
    }));
  };

  const sectionOutcome = () => {
    return sections.map((section, index) => (
      <View key={index}>
        <View
          style={{
            marginRight: 6,
            marginTop: 4,
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
          }}>
          <TouchableOpacity
            onPress={() => removeSection(index)}
            style={{
              backgroundColor: '#DC3545',
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
        </View>
        <Card>
          <View style={styles.box}>
            <Text style={styles.label}>Nama Barang/Keperluan</Text>
            <TextInput
              placeholder="Masukkan nama barang atau keperluan"
              style={styles.input_primary}
              value={section.namaBarang}
              // onChangeText={text =>
              //   setPostData({...postData, nama_barang: text})
              // }
              onChangeText={text => {
                handleItemName(text, index);
              }}
            />
          </View>
        </Card>
        <View style={{flexDirection: 'row'}}>
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
          <Card>
            <View style={styles.box}>
              <Text style={styles.label}>Satuan</Text>
              <TextInput
                style={[styles.input_secondary, {textAlign: 'center'}]}
                inputMode="numeric"
                onChangeText={text => {
                  calcJumlahHarga(index, section.harga.toString(), text);
                }}
                value={section.satuan.toString()}
              />
            </View>
          </Card>
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
                <View style={styles.input_category}>
                  <CheckBox
                    title="Primer"
                    checked={section.jenisKebutuhan === 'Kebutuhan Primer'}
                    onPress={() => handleTypeOutcome('Kebutuhan Primer', index)}
                    style={{marginVertical: 0}}
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
                    checked={section.jenisKebutuhan === 'Kebutuhan Sekunder'}
                    onPress={() =>
                      handleTypeOutcome('Kebutuhan Sekunder', index)
                    }
                    style={{marginVertical: 0}}
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
                <View style={[styles.input_category, {marginBottom: 8}]}>
                  <CheckBox
                    title="Darurat"
                    checked={section.kategoriUang === 'Kebutuhan Darurat'}
                    onPress={() =>
                      handleTypeOutcome('Kebutuhan Darurat', index)
                    }
                    style={{marginVertical: 0}}
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
                    checked={section.kategoriUang === 'Cash'}
                    onPress={() => handleCategoryOutcome('Cash', index)}
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
                    checked={section.kategoriUang === 'Cashless'}
                    onPress={() => handleCategoryOutcome('Cashless', index)}
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
                      tingkat kebutuhan. Kebutuhan primer meliputi: biaya sewa
                      kost, makan, tranportasi, dan keperluan lainnya yang
                      terkait perkuliahan. Kebutuhan sekunder meliputi:
                      kebutuhan di luar terkait perkuliahan atau keinginan
                      peribadi. Terakhir, merupakan jenis pengeluaran yang
                      melibatkan dana darurat atau tabungan yang digunakan untuk
                      pengeluaran yang tidak terduga, mendadak, dan kritis.
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
              value={formatCurrency(section.jumlahHarga)}
            />
          </View>
        </Card>
        <LineBreak />
      </View>
    ));
  };

  const [isInfoType, setIsInfoType] = useState(false);

  const [postData, setPostData] = useState<PostDataState>({
    deskripsi: '',
    kategori: 'Catatan Pengeluaran',
    total_uang_keluar: 'Rp 0',
    catatan_pengeluaran: [
      {
        nama_barang: '',
        harga_barang: 'Rp 0',
        satuan_barang: '1',
        nominal_uang_keluar: 'Rp 0',
        jenis_kebutuhan: 'Kebutuhan Primer',
        kategori_uang_keluar: 'Cash',
      },
    ],
  });

  console.log(postData);

  const submitNoteOutcome = async () => {
    try {
      const urlBase = 'http://192.168.43.129:8000/api/';
      const urlKey = 'catatan/';
      const response = await axios.post(urlBase + urlKey, postData);
      console.log('Success post data: ', response.data);
      navigation.navigate('Home');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        console.error(
          'Axios error:',
          axiosError.response?.data || axiosError.message,
        );
      } else {
        console.error('Unknown error:', error);
      }
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
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.textPath}>Buat Catatan Pengeluaran</Text>
          <View style={{justifyContent: 'center', marginHorizontal: 6}}>
            <Svg fill="white" viewBox="0 0 24 24" width={20} height={20}>
              <Path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
              <Path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
            </Svg>
          </View>
        </View>
      </View>
      <ScrollView style={{flex: 1}}>
        <View style={styles.container}>
          <Card>
            <View style={styles.box}>
              <Text style={styles.label}>Deskripsi Catatan Pengeluaran</Text>
              <TextInput
                placeholder="Masukkan deskripsi (opsional)"
                style={styles.input_deskripsi}
                multiline={true}
                numberOfLines={4}
                value={postData.deskripsi || ''}
                onChangeText={text =>
                  setPostData({...postData, deskripsi: text})
                }
              />
            </View>
          </Card>
          <LineBreak />
          <View>
            {sectionOutcome()}
            <View style={{alignItems: 'center', marginBottom: 12}}>
              <TouchableOpacity onPress={addSection} style={styles.addButton}>
                <View
                  style={{
                    alignItems: 'center',
                  }}>
                  <Svg
                    width={20}
                    height={20}
                    viewBox="0 0 24 24"
                    strokeWidth={3}
                    stroke="#000000">
                    <Path
                      d="M12 4.5v15m7.5-7.5h-15"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <Card>
            <View style={styles.box}>
              <Text style={{fontSize: 16, fontWeight: 'bold'}}>Total</Text>
              <View style={styles.card}>
                <TextInput
                  style={styles.input_total}
                  readOnly={true}
                  inputMode="numeric"
                  value={postData.total_uang_keluar}
                />
              </View>
            </View>
          </Card>
          <View style={{flexDirection: 'row', marginTop: 8, marginBottom: 12}}>
            <View style={{flex: 1}}>
              <BackButton />
            </View>
            <View style={{flex: 1}}>
              <SubmitButton onPress={submitNoteOutcome} />
            </View>
          </View>
        </View>
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
    width: 340,
    margin: 5,
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#845FAC',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
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
  },
  input_category: {
    height: 32,
  },
  input_secondary: {
    height: 40,
    width: 150,
    margin: 5,
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#845FAC',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  input_deskripsi: {
    margin: 5,
    padding: 10,
    borderWidth: 2,
    borderColor: '#845FAC',
    borderRadius: 10,
    textAlignVertical: 'top',
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
  input_total: {
    flex: 1,
    height: 40,
    marginRight: 8,
    color: '#000000',
    fontSize: 17,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#dddddd',
    padding: 8,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    alignItems: 'center',
    width: 50,
  },
});

export default AddNoteOutcome;
