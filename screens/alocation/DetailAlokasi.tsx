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
import * as Progress from 'react-native-progress';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Card} from '../../components/Card';
import LineBreak from '../../components/LineBreak';
import SubmitButton from '../../components/SubmitButton';

const DetailAlokasi = () => {
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

  const [saldoTeralokasi, setSaldoTeralokasi] = useState(0);
  const [saldoTerkini, setSaldoTerkini] = useState(0);

  const [primaryUsed, setPrimaryUsed] = useState(0);
  const [secondaryUsed, setSecondaryUsed] = useState(0);
  const [emergencyUsed, setEmergencyUsed] = useState(0);
  const [remainingPrimary, setRemainingPrimary] = useState(0);
  const [remainingSecondary, setRemainingSecondary] = useState(0);
  const [remainingEmergency, setRemainingEmergency] = useState(0);

  const [disableButton, setDisableButton] = useState(true);

  let parsePrimer = parseInt(primaryValue, 10);
  let parseSekunder = parseInt(secondaryValue, 10);
  let parseDarurat = parseInt(emergencyValue, 10);

  const allocationData = [
    // sekunder
    {value: parseSekunder || 0, color: '#A802C7'},
    // darurat
    {value: parseDarurat || 0, color: '#C74502'},
    // primer
    {value: parsePrimer || 0, color: '#0284C7'},
  ];

  const handleTotalPercentage = (value: string, setStateFunction: any) => {
    const parseVal = parseInt(value, 10);
    if (!isNaN(parseVal) && parseVal >= 0 && parseVal <= 100) {
      setDisableButton(false);
      setStateFunction(value);
    } else {
      setStateFunction('');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const urlBase = 'http://192.168.1.223:8000/api/';
        const urlKey = 'catatan/';
        const res = await axios.get(urlBase + urlKey);
        if (res.data.success) {
          const dataCatatan = res.data.data;
          // console.log(dataCatatan);

          let saldoTeralokasiVal = 0;
          let saldoTerkiniVal = 0;
          let primerTerpakai = 0;
          let sekunderTerpakai = 0;
          let daruratTerpakai = 0;
          let sisaPrimer = 0;
          let sisaSekunder = 0;
          let sisaDarurat = 0;

          dataCatatan.forEach((item: any) => {
            saldoTeralokasiVal += item.total_uang_masuk;

            saldoTerkiniVal += item.total_uang_masuk;
            saldoTerkiniVal -= item.total_uang_keluar;

            item.catatan_pengeluaran.forEach((pengeluaran: any) => {
              // console.log(pengeluaran);
              if (pengeluaran.jenis_kebutuhan === 'Kebutuhan Primer') {
                primerTerpakai += pengeluaran.nominal_uang_keluar;
                sisaPrimer = primaryAllocation - primerTerpakai;
              } else if (pengeluaran.jenis_kebutuhan === 'Kebutuhan Sekunder') {
                sekunderTerpakai += pengeluaran.nominal_uang_keluar;
                sisaSekunder = secondaryAllocation - sekunderTerpakai;
              } else if (pengeluaran.jenis_kebutuhan === 'Kebutuhan Darurat') {
                daruratTerpakai += pengeluaran.nominal_uang_keluar;
                sisaDarurat = emergencyAllocation - daruratTerpakai;
              }
            });
          });

          setSaldoTeralokasi(saldoTeralokasiVal);
          setSaldoTerkini(saldoTerkiniVal);

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

            let primaryAllocationValue =
              primaryPercentageValue * saldoTeralokasiVal;
            let secondaryAllocationValue =
              secondaryPercentageValue * saldoTeralokasiVal;
            let emergencyAllocationValue =
              emergencyPercentageValue * saldoTeralokasiVal;

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
      setDisableButton(true);
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

  let primerTakTerpakai = remainingPrimary / primaryAllocation;
  let sekunderTakTerpakai = remainingSecondary / secondaryAllocation;
  let daruratTakTerpakai = remainingEmergency / emergencyAllocation;

  return (
    <SafeAreaView style={[backgroundStyle]}>
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
        <Text style={styles.textPath}>Detail Alokasi Keuangan</Text>
      </View>
      <ScrollView>
        <Card>
          <View
            style={{
              marginVertical: 8,
            }}>
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  flex: 1,
                  marginLeft: 32,
                }}>
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                  Saldo Teralokasi:
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                  {saldoTeralokasi.toLocaleString('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              marginVertical: 8,
            }}>
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  flex: 1,
                  marginLeft: 32,
                }}>
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                  Saldo Terkini:
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                  {saldoTerkini.toLocaleString('id-ID', {
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
                      backgroundColor: '#0284C7',
                    }}
                  />
                  <Text style={{color: '#0284C7', fontWeight: 'bold'}}>
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
                        borderColor: '#0284C7',
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
                      backgroundColor: '#A802C7',
                    }}
                  />
                  <Text
                    style={{
                      color: '#A802C7',
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
                        borderColor: '#A802C7',
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
                      backgroundColor: '#C74502',
                    }}
                  />
                  <Text style={{color: '#C74502', fontWeight: 'bold'}}>
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
                        borderColor: '#C74502',
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
                    color: '#DC2626',
                    textAlign: 'center',
                    marginBottom: 6,
                  }}>
                  Total persentase tidak boleh melebihi 100.
                </Text>
              )
            ) : (
              <View>
                {disableButton ? (
                  <View />
                ) : (
                  <SubmitButton onPress={storeValue} textButton="Terapkan" />
                )}
              </View>
              // <SubmitButton
              //   onPress={storeValue}
              //   textButton="Terapkan"
              //   disabled={disableButton}
              // />
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
                backgroundColor: '#0284C7',
              }}
            />
            <Text style={{color: '#0284C7', fontWeight: 'bold'}}>Primer</Text>
          </View>
          <View style={{margin: 6}}>
            <View style={{flexDirection: 'row', marginVertical: 6}}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                }}>
                <Text style={{fontWeight: 'bold', marginLeft: 6}}>
                  Alokasi Primer:
                </Text>
              </View>

              <View
                style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                }}>
                <Text style={{fontWeight: 'bold', marginRight: 6}}>
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

            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: 2,
              }}>
              <Progress.Bar
                progress={
                  !isNaN(primerTakTerpakai) && primerTakTerpakai > 0
                    ? primerTakTerpakai
                    : isNaN(primerTakTerpakai)
                    ? 0
                    : 10
                }
                width={320}
                color="#0284C7"
                unfilledColor="#e9ecef"
              />
            </View>

            <View style={{flexDirection: 'row', marginVertical: 6}}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                }}>
                <Text style={{fontWeight: 'bold', marginLeft: 6}}>Rp 0</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                }}>
                <Text style={{fontWeight: 'bold', marginRight: 6}}>
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
                backgroundColor: '#A802C7',
              }}
            />
            <Text
              style={{
                color: '#A802C7',
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
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                }}>
                <Text style={{fontWeight: 'bold', marginLeft: 6}}>
                  Alokasi Sekunder:
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                }}>
                <Text style={{fontWeight: 'bold', marginRight: 6}}>
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

            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: 2,
              }}>
              <Progress.Bar
                progress={
                  !isNaN(sekunderTakTerpakai) && sekunderTakTerpakai > 0
                    ? sekunderTakTerpakai
                    : isNaN(sekunderTakTerpakai)
                    ? 0
                    : 10
                }
                width={320}
                color="#A802C7"
                unfilledColor="#e9ecef"
              />
            </View>

            <View style={{flexDirection: 'row', marginVertical: 6}}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                }}>
                <Text style={{fontWeight: 'bold', marginLeft: 6}}>Rp 0</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                }}>
                <Text style={{fontWeight: 'bold', marginRight: 6}}>
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
                backgroundColor: '#C74502',
              }}
            />
            <Text style={{color: '#C74502', fontWeight: 'bold'}}>Darurat</Text>
          </View>
          <View style={{margin: 6}}>
            <View style={{flexDirection: 'row', marginVertical: 6}}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                }}>
                <Text style={{fontWeight: 'bold', marginLeft: 6}}>
                  Alokasi Darurat:
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                }}>
                <Text style={{fontWeight: 'bold', marginRight: 6}}>
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

            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: 2,
              }}>
              <Progress.Bar
                progress={
                  !isNaN(daruratTakTerpakai) && daruratTakTerpakai > 0
                    ? daruratTakTerpakai
                    : isNaN(daruratTakTerpakai)
                    ? 0
                    : 10
                }
                width={320}
                color="#C74502"
                unfilledColor="#e9ecef"
              />
            </View>

            <View style={{flexDirection: 'row', marginVertical: 6}}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                }}>
                <Text style={{fontWeight: 'bold', marginLeft: 6}}>Rp 0</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                }}>
                <Text style={{fontWeight: 'bold', marginRight: 6}}>
                  {isNaN(remainingEmergency) || remainingEmergency < 0
                    ? 'Rp 0'
                    : emergencyUsed === 0
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
  textPath: {fontSize: 18, color: 'white', padding: 30, fontWeight: '600'},
  container: {margin: 5},
  box: {
    marginVertical: 2,
    padding: 5,
  },
  label: {
    fontWeight: '500',
  },
  input: {
    height: 40,
    width: 340,
    margin: 5,
    padding: 10,
    borderWidth: 2,
    borderColor: '#0284C7',
    borderRadius: 10,
    // borderBottomLeftRadius: 10,
    // borderBottomRightRadius: 10,
  },
});

export default DetailAlokasi;
