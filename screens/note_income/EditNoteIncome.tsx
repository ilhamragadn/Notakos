/* eslint-disable react-native/no-inline-styles */
import React from 'react';
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
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {BackButton} from '../../components/BackButton';
import {Card} from '../../components/Card';
import LineBreak from '../../components/LineBreak';
import SubmitButton from '../../components/SubmitButton';

const EditNoteIncome = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  // const [setTotal] = useState('0');
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
        <Text style={styles.textPath}>Edit Catatan Pemasukan</Text>
      </View>
      <ScrollView style={{flex: 1}}>
        <View style={styles.container}>
          <Card>
            <View style={styles.box}>
              <Text style={styles.label}>Judul Catatan Pemasukan</Text>
              <TextInput
                defaultValue="Judul Pemasukan"
                style={styles.input_primary}
                readOnly={true}
              />
            </View>
            <View style={styles.box}>
              <Text style={styles.label}>Deskripsi Catatan Pemasukan</Text>
              <TextInput
                defaultValue="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Illum mollitia dignissimos assumenda quod corrupti? Eveniet veniam distinctio ipsam hic deserunt? Perspiciatis, doloribus ad! Sed libero nam facilis recusandae odit reprehenderit?"
                readOnly={true}
                style={styles.input_deskripsi}
                multiline={true}
                numberOfLines={4}
              />
            </View>
            <View style={styles.box}>
              <Text style={styles.label}>Gambar Catatan Pemasukan</Text>
              <TextInput
                placeholder="Gambar bisa berupa screenshot bukti uang masuk"
                style={styles.input_primary}
              />
            </View>
          </Card>
          <View style={{flexDirection: 'row'}}>
            <Card>
              <View style={styles.box}>
                <Text style={styles.label}>Sumber Uang Masuk</Text>
                <TextInput
                  defaultValue="Orang tua"
                  readOnly={true}
                  style={styles.input_secondary}
                />
              </View>
            </Card>
            <Card>
              <View style={styles.box}>
                <Text style={styles.label}>Kategori Uang Masuk</Text>
                <TextInput
                  placeholder="Cash or Cashless"
                  readOnly={true}
                  style={styles.input_secondary}
                />
              </View>
            </Card>
          </View>
          <Card>
            <View style={styles.box}>
              <Text style={styles.label}>Nominal Uang Masuk</Text>
              <View style={styles.card}>
                <TextInput
                  readOnly={true}
                  // value="Rp 1.000.000"
                  inputMode="numeric"
                  style={{flex: 1, height: 40, marginLeft: 4, color: '#000000'}}
                  // onChangeText={newTotal => setTotal(newTotal)}
                  defaultValue={formatCurrency('1000000')}
                />
              </View>
            </View>
          </Card>
          <LineBreak />
          <Card>
            <View style={[styles.box, {width: 360}]}>
              <Text style={{fontSize: 16, fontWeight: 'bold'}}>Total</Text>
              <View style={styles.card}>
                <TextInput
                  style={styles.input_total}
                  readOnly={true}
                  // value="1000000"
                  inputMode="numeric"
                  defaultValue={formatCurrency('1000000')}
                />
              </View>
            </View>
          </Card>
          <View style={{justifyContent: 'flex-end', alignItems: 'flex-end'}}>
            <View style={{flexDirection: 'row'}}>
              <BackButton />
              <SubmitButton />
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
  textPath: {fontSize: 18, color: 'white', padding: 30, fontWeight: '600'},
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
    width: 160,
    borderBottomWidth: 2,
    borderBottomColor: '#845FAC',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    color: '#000000',
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

export default EditNoteIncome;
