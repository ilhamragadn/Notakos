/* eslint-disable react-native/no-inline-styles */
import axios, {AxiosError} from 'axios';
import React, {useCallback, useEffect, useState} from 'react';
import {
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
// import CoreSectionIncome from './components/CoreSectionIncome';
import {CheckBox} from '@rneui/themed';

type PostDataState = {
  deskripsi: string;
  kategori: string;
  total_uang_masuk: string;
  catatan_pemasukan: Array<{
    nominal_uang_masuk: string;
    kategori_uang_masuk: string;
  }>;
};

const AddNoteIncome = ({navigation}: any) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  // SECTION CORE ADD NOTE

  const [sections, setSections] = useState([{nominal: '0', kategori: 'Cash'}]);

  const addSection = () => {
    setSections([...sections, {nominal: '0', kategori: 'Cash'}]);

    setPostData(prevData => ({
      ...prevData,
      catatan_pemasukan: [
        ...prevData.catatan_pemasukan,
        {nominal_uang_masuk: 'Rp 0', kategori_uang_masuk: 'Cash'},
      ],
    }));
  };

  const removeSection = (index: number) => {
    const updatedSections = [...sections];
    updatedSections.splice(index, 1);
    setSections(updatedSections);

    setPostData(prevData => ({
      ...prevData,
      catatan_pemasukan: prevData.catatan_pemasukan.filter(
        (_, i) => i !== index,
      ),
    }));
  };

  const handleNominalChange = (index: number, newTotal: string) => {
    const updatedSections = [...sections];
    updatedSections[index].nominal = newTotal;
    setSections(updatedSections);

    const nominalValue = parseInt(newTotal.replace(/[^\d]/g, ''), 10);

    setPostData(prevData => ({
      ...prevData,
      catatan_pemasukan: prevData.catatan_pemasukan.map((item, i) =>
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
      ),
    }));
  };

  const calculateTotal = useCallback(() => {
    let total = 0;
    sections.forEach(section => {
      total += parseInt(section.nominal.replace(/[^\d]/g, ''), 10);
    });
    return total;
  }, [sections]);

  const formatCurrency = (value: string): string => {
    const amountValue = value.replace(/[^\d]/g, '');
    const amount = parseInt(amountValue, 10);
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

  useEffect(() => {
    const total = calculateTotal();
    setPostData(prevData => ({
      ...prevData,
      total_uang_masuk: formatCurrency(total.toString()),
    }));
  }, [calculateTotal]);

  const handleCategoryIncome = (categoryIncome: string, index: number) => {
    const updatedSections = [...sections];
    updatedSections[index].kategori = categoryIncome;
    setSections(updatedSections);

    setPostData(prevData => ({
      ...prevData,
      catatan_pemasukan: prevData.catatan_pemasukan.map((item, i) =>
        i === index ? {...item, kategori_uang_masuk: categoryIncome} : item,
      ),
    }));
  };

  const sectionIncome = () => {
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
        <View style={{flexDirection: 'row'}}>
          <Card>
            <View style={styles.box}>
              <Text style={styles.label}>Nominal Uang Masuk</Text>
              <TextInput
                placeholder="Masukkan Nominal Uang"
                inputMode="numeric"
                style={styles.input_nominal}
                onChangeText={newTotal => handleNominalChange(index, newTotal)}
                value={formatCurrency(section.nominal)}
              />
            </View>
          </Card>
          <Card>
            <View style={styles.box}>
              <Text style={styles.label}>Kategori Uang Masuk</Text>
              <View style={styles.input_category}>
                <CheckBox
                  title="Cash"
                  checked={section.kategori === 'Cash'}
                  onPress={() => handleCategoryIncome('Cash', index)}
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
                  checked={section.kategori === 'Cashless'}
                  onPress={() => handleCategoryIncome('Cashless', index)}
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
        <LineBreak />
      </View>
    ));
  };

  // END SECTION CORE ADD NOTE

  const [postData, setPostData] = useState<PostDataState>({
    deskripsi: '',
    kategori: 'Catatan Pemasukan',
    total_uang_masuk: '',
    catatan_pemasukan: [
      {nominal_uang_masuk: 'Rp 0', kategori_uang_masuk: 'Cash'},
    ],
  });
  console.log(postData);

  const submitNoteIncome = async () => {
    try {
      const response = await axios.post(
        'http://192.168.43.129:8000/api/catatan/',
        postData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
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
          <Text style={styles.textPath}>Buat Catatan Pemasukan</Text>
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
              <Text style={styles.label}>Deskripsi Catatan Pemasukan</Text>
              <TextInput
                placeholder="Masukkan deskripsi (opsional)"
                style={styles.input_description}
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
            {sectionIncome()}
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
            <Card>
              <View style={[styles.box, {width: 360}]}>
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>Total</Text>
                <View style={styles.card}>
                  <TextInput
                    style={styles.input_total}
                    readOnly={true}
                    value={postData.total_uang_masuk}
                  />
                </View>
              </View>
            </Card>
          </View>
          <View style={{flexDirection: 'row', marginTop: 8}}>
            <View style={{flex: 1}}>
              <BackButton />
            </View>
            <View style={{flex: 1}}>
              <SubmitButton onPress={submitNoteIncome} />
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
  },
  input_nominal: {
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
    height: 40,
    width: 160,
  },
  input_description: {
    margin: 5,
    padding: 10,
    borderWidth: 2,
    borderColor: '#845FAC',
    borderRadius: 10,
    textAlignVertical: 'top',
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
  addButtonText: {
    color: 'white',
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

export default AddNoteIncome;
