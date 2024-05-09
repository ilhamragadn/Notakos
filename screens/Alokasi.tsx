/* eslint-disable react-native/no-inline-styles */
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
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
import {PieChart} from 'react-native-gifted-charts';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {BottomNavbar} from '../components/BottomNavbar';
import {Card} from '../components/Card';
import LineBreak from '../components/LineBreak';
import SubmitButton from '../components/SubmitButton';

const topLabelComponent = () => (
  <Text style={{color: '#0D6EFD', marginBottom: 6, fontSize: 6}}>
    Rp 500.000
  </Text>
);

const Alokasi = ({navigation}: any) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  const [primaryValue, setPrimaryValue] = useState('0');
  const [secondaryValue, setSecondaryValue] = useState('0');
  const [emergencyValue, setEmergencyValue] = useState('0');
  const [primaryAllocation, setPrimaryAllocation] = useState(0);
  const [secondaryAllocation, setSecondaryAllocation] = useState(0);
  const [emergencyAllocation, setEmergencyAllocation] = useState(0);
  const [totalPercentageError, setTotalPercentageError] = useState(false);

  // const [saldo, setSaldo] = useState(0);

  const [primaryUsed, setPrimaryUsed] = useState(0);
  const [secondaryUsed, setSecondaryUsed] = useState(0);
  const [emergencyUsed, setEmergencyUsed] = useState(0);
  const [remainingPrimary, setRemainingPrimary] = useState(0);
  const [remainingSecondary, setRemainingSecondary] = useState(0);
  const [remainingEmergency, setRemainingEmergency] = useState(0);

  let parsePrimer = parseInt(primaryValue, 10);
  let parseSekunder = parseInt(secondaryValue, 10);
  let parseDarurat = parseInt(emergencyValue, 10);

  const allocationData = [
    // darurat
    {value: parseDarurat || 0, color: '#5FAC84'},
    // sekunder
    {value: parseSekunder || 0, color: '#AC845F'},
    // primer
    {value: parsePrimer || 0, color: '#845FAC'},
  ];

  const handleTotalPercentage = (value: string, setStateFunction: any) => {
    const parseVal = parseInt(value, 10);
    if (!isNaN(parseVal) && parseVal >= 0 && parseVal <= 100) {
      setStateFunction(value);
    } else {
      setStateFunction('');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const urlBase = 'http://192.168.43.129:8000/api/';
        const urlKey = 'catatan/';
        const res = await axios.get(urlBase + urlKey);
        if (res.data.success) {
          const dataCatatan = res.data.data;
          // console.log(dataCatatan);

          let saldoVal = 0;
          let primerTerpakai = 0;
          let sekunderTerpakai = 0;
          let daruratTerpakai = 0;
          let sisaPrimer = 0;
          let sisaSekunder = 0;
          let sisaDarurat = 0;

          dataCatatan.forEach((item: any) => {
            saldoVal += item.total_uang_masuk;
            // saldoVal -= item.total_uang_keluar;

            item.catatan_pengeluaran.forEach((pengeluaran: any) => {
              // console.log(pengeluaran);
              if (pengeluaran.jenis_kebutuhan === 'Kebutuhan Primer') {
                primerTerpakai += item.total_uang_keluar;
                sisaPrimer = primaryAllocation - primerTerpakai;
              } else if (pengeluaran.jenis_kebutuhan === 'Kebutuhan Sekunder') {
                sekunderTerpakai += item.total_uang_keluar;
                sisaSekunder = secondaryAllocation - sekunderTerpakai;
              } else if (pengeluaran.jenis_kebutuhan === 'Kebutuhan Darurat') {
                daruratTerpakai += item.total_uang_keluar;
                sisaDarurat = emergencyAllocation - daruratTerpakai;
              }
            });
          });

          // setSaldo(saldoVal);

          setPrimaryUsed(primerTerpakai);
          setRemainingPrimary(sisaPrimer);
          setSecondaryUsed(sekunderTerpakai);
          setRemainingSecondary(sisaSekunder);
          setEmergencyUsed(daruratTerpakai);
          setRemainingEmergency(sisaDarurat);

          let inputPrimer = parseInt(primaryValue, 10);
          let inputSekunder = parseInt(secondaryValue, 10);
          let inputDarurat = parseInt(emergencyValue, 10);

          let totalPercentageValue = inputPrimer + inputSekunder + inputDarurat;

          if (totalPercentageValue > 100) {
            setTotalPercentageError(true);
            setPrimaryAllocation(0);
            setSecondaryAllocation(0);
            setEmergencyAllocation(0);
          } else {
            setTotalPercentageError(false);
            let primaryPercentageValue = inputPrimer / totalPercentageValue;
            let secondaryPercentageValue = inputSekunder / totalPercentageValue;
            let emergencyPercentageValue = inputDarurat / totalPercentageValue;

            let primaryAllocationValue = primaryPercentageValue * saldoVal;
            let secondaryAllocationValue = secondaryPercentageValue * saldoVal;
            let emergencyAllocationValue = emergencyPercentageValue * saldoVal;

            setPrimaryAllocation(primaryAllocationValue);
            setSecondaryAllocation(secondaryAllocationValue);
            setEmergencyAllocation(emergencyAllocationValue);
          }
        } else {
          console.error('Failed to fetch data: ', res.data.message);
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, [
    emergencyAllocation,
    emergencyValue,
    primaryAllocation,
    primaryValue,
    secondaryAllocation,
    secondaryValue,
  ]);

  const storeValue = async () => {
    try {
      await AsyncStorage.setItem('primaryValue', primaryValue);
      await AsyncStorage.setItem('secondaryValue', secondaryValue);
      await AsyncStorage.setItem('emergencyValue', emergencyValue);

      console.log('Nilai berhasil diterapkan');
      Alert.alert('Berhasil', 'Pengaturan Alokasi Disimpan');
    } catch (error) {
      console.error('Error store data: ', error);
      Alert.alert('Gagal', 'Pengaturan Alokasi Gagal');
    }
  };

  useEffect(() => {
    const loadValue = async () => {
      try {
        const storedPrimaryValue =
          (await AsyncStorage.getItem('primaryValue')) || '0'; // Default value if not found
        const storedSecondaryValue =
          (await AsyncStorage.getItem('secondaryValue')) || '0'; // Default value if not found
        const storedEmergencyValue =
          (await AsyncStorage.getItem('emergencyValue')) || '0'; // Default value if not found

        setPrimaryValue(storedPrimaryValue);
        setSecondaryValue(storedSecondaryValue);
        setEmergencyValue(storedEmergencyValue);
      } catch (error) {
        console.error('Error load value: ', error);
      }
    };

    loadValue();
  }, []);

  const data = [
    {value: 20, label: 'Sen'},
    {value: 30, label: 'Sel'},
    {
      value: 50,
      label: 'Rabu',
      topLabelComponent: topLabelComponent,
    },
    {value: 40, label: 'Kam'},
    {value: 30, label: 'Jum'},
    {value: 25, label: 'Sab'},
    {value: 30, label: 'Min'},
  ];

  const pieData = [
    {value: 20, color: '#5FAC84'},
    {value: 30, color: '#AC845F'},
    {value: 50, color: '#845FAC'},
  ];

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
        <Text
          style={[
            styles.textPath,
            isDarkMode ? {color: '#845FAC'} : {color: '#ffffff'},
          ]}>
          NOTAKOS
        </Text>
      </View>
      <ScrollView style={{flex: 1}}>
        <View style={{marginTop: 4, marginBottom: 6}}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '500',
              marginVertical: 8,
              marginLeft: 20,
            }}>
            Alokasi
          </Text>
        </View>
        {/* <Card>
          <View style={{flexDirection: 'row'}}>
            <View style={{margin: 10, justifyContent: 'center'}}>
              <PieChart donut radius={32} data={pieData} />
            </View>
            <View style={{justifyContent: 'center', flex: 1, margin: 10}}>
              <TouchableOpacity
                onPress={() => navigation.navigate('DetailAlokasi')}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    backgroundColor: '#845FAC',
                    marginVertical: 2,
                    marginHorizontal: 6,
                    paddingVertical: 6,
                    borderRadius: 18,
                  }}>
                  <Text
                    style={{
                      fontWeight: '500',
                      textAlign: 'center',
                      color: '#ffffff',
                    }}>
                    Detail dan Atur Alokasi Uang
                  </Text>
                  <View style={{marginLeft: 8}}>
                    <Svg
                      fill="none"
                      viewBox="0 0 24 24"
                      width={22}
                      height={22}
                      stroke="#ffffff"
                      strokeWidth={1.5}>
                      <Path
                        d="m8.25 4.5 7.5 7.5-7.5 7.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Svg>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Card> */}

        <Card>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            <View style={{padding: 8, justifyContent: 'center'}}>
              <PieChart donut radius={80} data={allocationData} />
            </View>
            <View
              style={{
                marginTop: 4,
                marginBottom: 6,
              }}>
              <Text
                style={{
                  fontWeight: '500',
                  marginHorizontal: 6,
                }}>
                Atur Persentase Alokasi
              </Text>
              <View style={{marginTop: 8}}>
                <View
                  style={{
                    flexDirection: 'row',
                    margin: 6,
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      height: 18,
                      width: 18,
                      marginRight: 6,
                      borderRadius: 4,
                      backgroundColor: '#845FAC',
                    }}
                  />
                  <Text style={{color: '#845FAC', fontWeight: 'bold'}}>
                    Primer
                  </Text>
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'flex-end',
                    }}>
                    <TextInput
                      style={{
                        height: 40,
                        width: 40,
                        borderWidth: 2,
                        borderRadius: 10,
                        borderColor: '#845FAC',
                        textAlign: 'center',
                      }}
                      value={primaryValue}
                      onChangeText={text =>
                        handleTotalPercentage(text, setPrimaryValue)
                      }
                      placeholder="50"
                      inputMode="numeric"
                    />
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    margin: 6,
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      height: 18,
                      width: 18,
                      marginRight: 6,
                      borderRadius: 4,
                      backgroundColor: '#AC845F',
                    }}
                  />
                  <Text
                    style={{
                      color: '#AC845F',
                      fontWeight: 'bold',
                    }}>
                    Sekunder
                  </Text>
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'flex-end',
                    }}>
                    <TextInput
                      style={{
                        height: 40,
                        width: 40,
                        borderWidth: 2,
                        borderRadius: 10,
                        borderColor: '#AC845F',
                        textAlign: 'center',
                      }}
                      value={secondaryValue}
                      onChangeText={text =>
                        handleTotalPercentage(text, setSecondaryValue)
                      }
                      placeholder="30"
                      inputMode="numeric"
                    />
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    margin: 6,
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      height: 18,
                      width: 18,
                      marginRight: 6,
                      borderRadius: 4,
                      backgroundColor: '#5FAC84',
                    }}
                  />
                  <Text style={{color: '#5FAC84', fontWeight: 'bold'}}>
                    Darurat
                  </Text>
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'flex-end',
                    }}>
                    <TextInput
                      style={{
                        height: 40,
                        width: 40,
                        borderWidth: 2,
                        borderRadius: 10,
                        borderColor: '#5FAC84',
                        textAlign: 'center',
                      }}
                      value={emergencyValue}
                      onChangeText={text =>
                        handleTotalPercentage(text, setEmergencyValue)
                      }
                      placeholder="20"
                      inputMode="numeric"
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View>
            {totalPercentageError ? (
              totalPercentageError && (
                <Text
                  style={{
                    color: '#DC3545',
                    textAlign: 'center',
                    marginBottom: 6,
                  }}>
                  Total persentase tidak boleh melebihi 100.
                </Text>
              )
            ) : (
              <SubmitButton onPress={storeValue} />
            )}
          </View>
        </Card>

        <View style={{marginVertical: 8}}>
          <LineBreak />
        </View>

        <Card>
          <View
            style={{
              flexDirection: 'row',
              margin: 6,
              alignItems: 'center',
            }}>
            <View
              style={{
                height: 18,
                width: 18,
                marginRight: 6,
                borderRadius: 4,
                backgroundColor: '#845FAC',
              }}
            />
            <Text style={{color: '#845FAC', fontWeight: 'bold'}}>Primer</Text>
          </View>
          <View style={{margin: 6}}>
            <View style={{flexDirection: 'row', marginVertical: 6}}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{fontWeight: 'bold'}}>Alokasi Primer:</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{fontWeight: 'bold'}}>
                  {isNaN(primaryAllocation)
                    ? 'Rp 0'
                    : primaryAllocation.toLocaleString('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', marginVertical: 6}}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{fontWeight: 'bold'}}>Terpakai:</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{fontWeight: 'bold'}}>
                  {isNaN(primaryUsed) || primaryUsed < 0
                    ? 'Rp 0'
                    : primaryUsed.toLocaleString('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', marginVertical: 6}}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{fontWeight: 'bold'}}>Sisa:</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{fontWeight: 'bold'}}>
                  {isNaN(remainingPrimary)
                    ? 'Rp 0'
                    : primaryUsed === 0
                    ? primaryAllocation.toLocaleString('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })
                    : remainingPrimary.toLocaleString('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                </Text>
              </View>
            </View>
          </View>
        </Card>

        <View style={{marginVertical: 8}}>
          <LineBreak />
        </View>

        <Card>
          <View
            style={{
              flexDirection: 'row',
              margin: 6,
              alignItems: 'center',
            }}>
            <View
              style={{
                height: 18,
                width: 18,
                marginRight: 6,
                borderRadius: 4,
                backgroundColor: '#AC845F',
              }}
            />
            <Text
              style={{
                color: '#AC845F',
                fontWeight: 'bold',
              }}>
              Sekunder
            </Text>
          </View>
          <View style={{margin: 6}}>
            <View style={{flexDirection: 'row', marginVertical: 6}}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{fontWeight: 'bold'}}>Alokasi Sekunder:</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{fontWeight: 'bold'}}>
                  {isNaN(secondaryAllocation)
                    ? 'Rp 0'
                    : secondaryAllocation.toLocaleString('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', marginVertical: 6}}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{fontWeight: 'bold'}}>Terpakai:</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{fontWeight: 'bold'}}>
                  {isNaN(secondaryUsed) || secondaryUsed < 0
                    ? 'Rp 0'
                    : secondaryUsed.toLocaleString('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', marginVertical: 6}}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{fontWeight: 'bold'}}>Sisa:</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{fontWeight: 'bold'}}>
                  {isNaN(remainingSecondary) || remainingSecondary < 0
                    ? 'Rp 0'
                    : secondaryUsed === 0
                    ? secondaryAllocation.toLocaleString('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })
                    : remainingSecondary.toLocaleString('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                </Text>
              </View>
            </View>
          </View>
        </Card>

        <View style={{marginVertical: 8}}>
          <LineBreak />
        </View>

        <Card>
          <View
            style={{
              flexDirection: 'row',
              margin: 6,
              alignItems: 'center',
            }}>
            <View
              style={{
                height: 18,
                width: 18,
                marginRight: 6,
                borderRadius: 4,
                backgroundColor: '#5FAC84',
              }}
            />
            <Text style={{color: '#5FAC84', fontWeight: 'bold'}}>Darurat</Text>
          </View>
          <View style={{margin: 6}}>
            <View style={{flexDirection: 'row', marginVertical: 6}}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{fontWeight: 'bold'}}>Alokasi Darurat:</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{fontWeight: 'bold'}}>
                  {isNaN(emergencyAllocation)
                    ? 'Rp 0'
                    : emergencyAllocation.toLocaleString('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', marginVertical: 6}}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{fontWeight: 'bold'}}>Terpakai:</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{fontWeight: 'bold'}}>
                  {isNaN(emergencyUsed) || emergencyUsed < 0
                    ? 'Rp 0'
                    : emergencyUsed.toLocaleString('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', marginVertical: 6}}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{fontWeight: 'bold'}}>Sisa:</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{fontWeight: 'bold'}}>
                  {isNaN(remainingEmergency) || remainingEmergency < 0
                    ? 'Rp 0'
                    : remainingEmergency === 0
                    ? emergencyAllocation.toLocaleString('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })
                    : remainingEmergency.toLocaleString('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                </Text>
              </View>
            </View>
          </View>
        </Card>

        <View style={{marginVertical: 8}}>
          <LineBreak />
        </View>

        {/* <View style={{marginTop: 8}}>
          <LineBreak />
        </View>

        <View style={{marginTop: 4, marginBottom: 6}}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '500',
              marginVertical: 8,
              marginLeft: 20,
            }}>
            Analisis Keuangan
          </Text>
        </View>

        <Card>
          <BarChart
            width={300}
            data={data}
            barWidth={22}
            noOfSections={3}
            barBorderRadius={4}
            frontColor="#0D6EFD"
            yAxisThickness={0}
            xAxisThickness={0}
          />
        </Card> */}

        {/* <LineBreak /> */}
        <View
          style={{
            alignItems: 'center',
            paddingTop: 10,
            paddingHorizontal: 20,
            backgroundColor: '#f2f2f2',
            height: 200,
          }}>
          <Text style={{textAlign: 'center'}}>
            Kelola uang jadi seru dan mudah dengan{' '}
            <Text style={{fontWeight: 'bold', color: '#845FAC'}}>NOTAKOS.</Text>
            Yuk, mulai catat sekarang!
          </Text>
        </View>
      </ScrollView>
      <View
        style={{
          position: 'absolute',
          bottom: 450,
          left: 0,
          right: 0,
        }}>
        <BottomNavbar navigation={navigation} />
      </View>
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
  textPath: {fontSize: 18, fontWeight: 'bold', padding: 30},
});

export default Alokasi;
