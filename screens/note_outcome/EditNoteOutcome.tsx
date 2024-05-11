/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
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
import Svg, {Path} from 'react-native-svg';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {BackButton} from '../../components/BackButton';
import {Card} from '../../components/Card';
import LineBreak from '../../components/LineBreak';
import SubmitButton from '../../components/SubmitButton';

const EditNoteOutcome = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  const [isInfo, setIsInfo] = useState(false);

  const [cost, setCost] = useState('Rp ');
  const [unit, setUnit] = useState('1');
  const calcTotal = (harga: string, satuan: string) => {
    const x = parseInt(harga.replace(/\D/g, ''), 10);
    const y = parseInt(satuan.replace(/\D/g, ''), 10);

    const result = x * y;
    if (isNaN(result)) {
      return 'Rp ';
    }
    return result.toLocaleString('id-ID', {
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
          isDarkMode ? backgroundStyle.backgroundColor : '#0284C7'
        }
      />
      <View
        style={[
          isDarkMode
            ? [backgroundStyle.backgroundColor, styles.boxPath]
            : [{backgroundColor: '#0284C7'}, styles.boxPath],
        ]}>
        <Text style={styles.textPath}>Edit Catatan Pengeluaran</Text>
      </View>
      <ScrollView style={{flex: 1}}>
        <View style={styles.container}>
          <Card>
            <View style={styles.box}>
              <Text style={styles.label}>Judul Catatan Pengeluaran</Text>
              <TextInput
                placeholder="Masukkan Judul"
                style={styles.input_primary}
              />
            </View>
            <View style={styles.box}>
              <Text style={styles.label}>Deskripsi Catatan Pengeluaran</Text>
              <TextInput
                placeholder="Masukkan Deskripsi"
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
          <LineBreak />
          <Card>
            <View style={styles.box}>
              <Text style={styles.label}>Nama Barang/Keperluan</Text>
              <TextInput
                placeholder="Masukkan Nama Barang atau Keperluan"
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
                  inputMode="numeric"
                  onChangeText={text => {
                    setCost(text);
                  }}
                  defaultValue={calcTotal(cost, unit)}
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
                    setUnit(text);
                  }}
                  defaultValue={unit}
                />
              </View>
            </Card>
          </View>
          <Card>
            <View style={styles.box}>
              <Text style={styles.label}>Jumlah Harga</Text>
              <TextInput
                placeholder="Jumlah Harga"
                style={[styles.input_primary, {textAlign: 'center'}]}
                // onChangeText={setTotal}
                defaultValue={calcTotal(cost, unit)}
              />
            </View>
          </Card>
          <View style={{flexDirection: 'row'}}>
            <Card>
              <View style={styles.box}>
                <Text style={styles.label}>Sumber Uang Keluar</Text>
                <TextInput
                  placeholder="Orang tua, gaji"
                  style={styles.input_secondary}
                />
              </View>
            </Card>
            <Card>
              <View style={styles.box}>
                <Text style={styles.label}>Kategori Uang Keluar</Text>
                <TextInput
                  placeholder="Cash or Cashless"
                  style={styles.input_secondary}
                />
              </View>
            </Card>
          </View>
          <Card>
            <View style={styles.box}>
              <View style={{flexDirection: 'row'}}>
                <Text style={[styles.label, {flex: 1}]}>Jenis Pengeluaran</Text>
                <TouchableOpacity onPress={() => setIsInfo(!isInfo)}>
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
              <TextInput
                placeholder="jenis pengeluaran (primer, sekunder, uang darurat)"
                style={styles.input_primary}
              />
            </View>
          </Card>
          <Modal transparent={true} animationType="fade" visible={isInfo}>
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
                        Silahkan pilih jenis kebutuhan di bawah ini sesuai
                        dengan tingkat kebutuhan. Kebutuhan primer meliputi:
                        biaya sewa kost, makan, tranportasi, dan keperluan
                        lainnya yang terkait perkuliahan. Kebutuhan sekunder
                        meliputi: kebutuhan di luar terkait perkuliahan atau
                        keinginan peribadi. Terakhir, merupakan untuk dana
                        darurat bisa meliputi: tabungan, investasi, atau untuk
                        pengeluaran tidak terduga.
                      </Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  style={{alignItems: 'center', marginVertical: 4}}
                  onPress={() => setIsInfo(!isInfo)}>
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
          <LineBreak />
          <Card>
            <View style={styles.box}>
              <Text style={{fontSize: 16, fontWeight: 'bold'}}>Total</Text>
              <View style={styles.card}>
                <TextInput
                  style={styles.input_total}
                  readOnly={true}
                  inputMode="numeric"
                  defaultValue={calcTotal(cost, unit)}
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
  },
  input_secondary: {
    height: 40,
    width: 160,
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
    marginRight: 8,
    color: '#000000',
    fontSize: 17,
    textAlign: 'right',
    fontWeight: 'bold',
  },
});

export default EditNoteOutcome;
