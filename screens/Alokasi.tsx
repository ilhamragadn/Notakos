/* eslint-disable react-native/no-inline-styles */
import axios from 'axios';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
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
import * as Progress from 'react-native-progress';
import {Path, Svg} from 'react-native-svg';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {BottomNavbar} from '../components/BottomNavbar';
import {Card} from '../components/Card';
import LineBreak from '../components/LineBreak';
import SubmitButton from '../components/SubmitButton';

interface User {
  id?: number;
}

interface Allocation {
  id?: number;
  variabel_alokasi: string;
  persentase_alokasi: number;
  user_id: number;
  alokasi_pemasukans: [
    {
      pivot: {
        saldo_teralokasi: number;
        variabel_teralokasi: string;
      };
    },
  ];
}

interface resultAllocation {
  allocationVariable: string;
  allocationPercentage: number;
  allocationBalance: number;
  allocationRemaining: number;
  allocationFraction: number;
  totalOutcome: number;
}

const Alokasi = ({navigation}: any) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  const urlBase = 'http://192.168.1.223:8000/api/';
  const urlKey = 'alokasi/';

  const [userID, setUserID] = useState<User>();
  const fetchUser = useCallback(async () => {
    try {
      const res = await axios.get(urlBase + 'profil/');
      if (res.data) {
        const dataUser = res.data;
        setUserID(dataUser.id);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (userID) {
      setAllocationSections(prevSections =>
        prevSections.map(section => ({
          ...section,
          userIdValue: userID,
        })),
      );
    }
  }, [userID]);

  const [allocationSections, setAllocationSections] = useState([
    {
      variableAllocationValue: '',
      percentageAllocationValue: 0,
      userIdValue: userID,
    },
  ]);

  const [savedAllocations, setSavedAllocations] = useState<Allocation[]>([]);

  const [disableButton, setDisableButton] = useState(true);

  const addAllocationSection = () => {
    setAllocationSections([
      ...allocationSections,
      {
        variableAllocationValue: '',
        percentageAllocationValue: 0,
        userIdValue: userID,
      },
    ]);
    setDisableButton(false);
  };

  const removeAllocationSection = (index: number) => {
    const updatedAllocationSections = [...allocationSections];
    updatedAllocationSections.splice(index, 1);
    setAllocationSections(updatedAllocationSections);
    setDisableButton(false);
  };

  const handleVariableAllocation = (
    variableAllocationVal: string,
    index: number,
  ) => {
    const updatedAllocationSections = [...allocationSections];
    updatedAllocationSections[index].variableAllocationValue =
      variableAllocationVal;
    setAllocationSections(updatedAllocationSections);
    setDisableButton(false);
  };

  const handlePercentageAllocation = (
    percentageAllocationVal: string,
    index: number,
  ) => {
    const updatedAllocationSections = [...allocationSections];
    const parsedValue = parseInt(
      percentageAllocationVal.replace(/[^\d]/g, ''),
      10,
    );
    updatedAllocationSections[index].percentageAllocationValue = isNaN(
      parsedValue,
    )
      ? 0
      : parsedValue;
    setAllocationSections(updatedAllocationSections);
    setDisableButton(false);
  };

  const preparePostAllocationData = () => {
    const postData = allocationSections.map(section => ({
      variabel_alokasi: section.variableAllocationValue,
      persentase_alokasi: section.percentageAllocationValue,
      user_id: section.userIdValue,
    }));
    console.log('Prepared post data:', JSON.stringify(postData, null, 2)); // Debugging line
    return postData;
  };

  const submitAllocation = async () => {
    try {
      const postAllocationData = preparePostAllocationData();
      console.log(postAllocationData);

      const response = await axios.post(urlBase + urlKey, postAllocationData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Success post data: ', response.data);
      Alert.alert('Berhasil', 'Data Berhasil Disimpan');
      fetchAllocation();
    } catch (error) {
      console.error('Axios error: ', error);
    }
  };

  const postAllocationSection = () => {
    return allocationSections.map((section, index) => (
      <View key={index}>
        <TextInput style={{display: 'none'}} value={userID?.toString()} />
        <View style={{marginVertical: 6, flexDirection: 'row'}}>
          <View style={{marginHorizontal: 4, flex: 1}}>
            <TextInput
              style={{
                height: 45,
                borderWidth: 1.5,
                borderRadius: 10,
                paddingHorizontal: 12,
              }}
              value={section.variableAllocationValue}
              onChangeText={text => {
                handleVariableAllocation(text, index);
              }}
              placeholder="Sewa Kos, Kebutuhan Kuliah"
            />
          </View>
          <View style={{flexDirection: 'row', marginHorizontal: 6}}>
            <TextInput
              style={{
                height: 45,
                width: 50,
                borderWidth: 1.5,
                borderTopLeftRadius: 10,
                borderBottomLeftRadius: 10,
                paddingHorizontal: 12,
                textAlign: 'center',
              }}
              value={
                section.percentageAllocationValue !== undefined
                  ? section.percentageAllocationValue.toString()
                  : '0'
              }
              onChangeText={text => {
                handlePercentageAllocation(text, index);
              }}
              placeholder="50"
              inputMode="numeric"
            />
            <View
              style={{
                backgroundColor: '#dddddd',
                paddingVertical: 4,
                paddingHorizontal: 6,
                justifyContent: 'center',
                alignItems: 'center',
                borderTopRightRadius: 10,
                borderBottomRightRadius: 10,
                borderWidth: 1.5,
                borderLeftWidth: 0,
              }}>
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>%</Text>
            </View>
          </View>
          {/* tombol sampah */}
          <TouchableOpacity
            onPress={() => removeAllocationSection(index)}
            style={{
              marginHorizontal: 4,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#DC2626',
              paddingHorizontal: 8,
              borderRadius: 10,
            }}>
            <Svg
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="#FFFFFF"
              width={24}
              height={24}>
              <Path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </Svg>
          </TouchableOpacity>
        </View>
      </View>
    ));
  };

  // FETCH DATA

  const [saldoKeSemua, setSaldoKeSemua] = useState(0);
  const [pivotVariabelTeralokasi, setPivotVariabelTeralokasi] = useState('');

  type alokasiSaldo = {[key: string]: number};

  const [saldoPerAlokasi, setSaldoPerAlokasi] = useState<alokasiSaldo>({});

  const fetchAllocation = useCallback(async () => {
    try {
      const res = await axios.get(urlBase + urlKey);
      if (res.data.success) {
        const dataAlokasi = res.data.data;
        setSavedAllocations(dataAlokasi);

        let totalSaldoSemua = 0;
        let variabelTeralokasi = '';
        let newSaldoTeralokasi: alokasiSaldo = {};
        let saldoDefault = 0;
        let saldoTeralokasi = 0;

        dataAlokasi.forEach((item: any) => {
          item.alokasi_pemasukans.forEach((pemasukan: any) => {
            variabelTeralokasi = pemasukan.pivot.variabel_teralokasi;
            saldoDefault = pemasukan.pivot.saldo_teralokasi;
            saldoTeralokasi = pemasukan.pivot.saldo_teralokasi;

            if (variabelTeralokasi === 'Semua Alokasi') {
              totalSaldoSemua += saldoDefault;
            } else {
              if (!newSaldoTeralokasi[variabelTeralokasi]) {
                newSaldoTeralokasi[variabelTeralokasi] = 0;
              }
              newSaldoTeralokasi[variabelTeralokasi] += saldoTeralokasi;
            }
          });

          if (!newSaldoTeralokasi[item.variabel_alokasi]) {
            newSaldoTeralokasi[item.variabel_alokasi] = 0;
          }
        });

        setSaldoKeSemua(totalSaldoSemua);
        setPivotVariabelTeralokasi(variabelTeralokasi);
        setSaldoPerAlokasi(newSaldoTeralokasi);
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  }, []);

  useEffect(() => {
    fetchAllocation();
  }, [fetchAllocation]);

  const handleUpdateAllocation = async (allocation: Allocation) => {
    try {
      const response = await axios.put(urlBase + urlKey + `${allocation.id}`, {
        variabel_alokasi: allocation.variabel_alokasi,
        persentase_alokasi: allocation.persentase_alokasi,
      });
      Alert.alert('Berhasil', 'Alokasi telah diperbarui!');
      fetchAllocation();
      console.log('Success update: ', response.data);
    } catch (error) {
      Alert.alert('Gagal', 'Alokasi gagal diperbarui!');
      console.error(error);
    }
  };

  const handleDeleteAllocation = async (id: any) => {
    try {
      const response = await axios.delete(urlBase + urlKey + `${id}`);
      Alert.alert('Berhasil', 'Alokasi telah dihapus!');
      fetchAllocation();
      console.log(response.data);
    } catch (error) {
      Alert.alert('Gagal', 'Alokasi gagal dihapus!');
      console.error(error);
    }
  };

  const fetchAllocationSection = () => {
    return savedAllocations.map((allocation, index) => (
      <View key={index}>
        {allocation.variabel_alokasi === 'Semua Alokasi' ? (
          <View />
        ) : (
          <View style={{marginVertical: 6, flexDirection: 'row'}}>
            <View style={{marginHorizontal: 4, flex: 1}}>
              <TextInput
                style={{
                  height: 45,
                  borderWidth: 1.5,
                  borderRadius: 10,
                  paddingHorizontal: 12,
                }}
                value={allocation.variabel_alokasi}
                onChangeText={text => {
                  const updatedAllocations = [...savedAllocations];
                  updatedAllocations[index].variabel_alokasi = text;
                  setSavedAllocations(updatedAllocations);
                }}
              />
            </View>
            <View style={{flexDirection: 'row', marginHorizontal: 6}}>
              <TextInput
                style={{
                  height: 45,
                  width: 50,
                  borderWidth: 1.5,
                  borderTopLeftRadius: 10,
                  borderBottomLeftRadius: 10,
                  paddingHorizontal: 12,
                  textAlign: 'center',
                }}
                value={(allocation.persentase_alokasi !== undefined
                  ? allocation.persentase_alokasi
                  : 0
                ).toString()}
                onChangeText={text => {
                  const updatedAllocations = [...savedAllocations];
                  updatedAllocations[index].persentase_alokasi =
                    parseInt(text, 10) || 0;
                  setSavedAllocations(updatedAllocations);
                }}
                placeholder="50"
                inputMode="numeric"
              />
              <View
                style={{
                  backgroundColor: '#dddddd',
                  paddingVertical: 4,
                  paddingHorizontal: 6,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderTopRightRadius: 10,
                  borderBottomRightRadius: 10,
                  borderWidth: 1.5,
                  borderLeftWidth: 0,
                }}>
                <Text style={{fontSize: 20, fontWeight: 'bold'}}>%</Text>
              </View>
            </View>

            {/* tombol update */}
            <TouchableOpacity
              onPress={() => handleUpdateAllocation(allocation)}
              style={{
                marginHorizontal: 4,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#16A34A',
                paddingHorizontal: 8,
                borderRadius: 10,
              }}>
              <Svg
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="#FFFFFF"
                width={24}
                height={24}>
                <Path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                />
              </Svg>
            </TouchableOpacity>

            {/* tombol sampah */}
            <TouchableOpacity
              onPress={() => handleDeleteAllocation(allocation.id)}
              style={{
                marginHorizontal: 4,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#DC2626',
                paddingHorizontal: 8,
                borderRadius: 10,
              }}>
              <Svg
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="#FFFFFF"
                width={24}
                height={24}>
                <Path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </Svg>
            </TouchableOpacity>
          </View>
        )}
      </View>
    ));
  };

  const [note, setNote] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const urlNote = 'catatan/';
        const res = await axios.get(urlBase + urlNote);
        if (res.data.success) {
          const dataCatatan = res.data.data;
          setNote(dataCatatan);
          // console.log(dataCatatan);
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchNotes();
  }, []);

  const [resultAllocation, setResultAllocation] = useState<resultAllocation[]>(
    [],
  );

  const calcAllocation = useCallback(() => {
    let totalPercentage = 0;

    if (savedAllocations && savedAllocations.length > 0) {
      const results = savedAllocations
        .map(section => {
          const variabelAlokasi = section.variabel_alokasi;
          const persentaseAlokasi = section.persentase_alokasi;
          let saldoTeralokasiAkhir = 0;

          totalPercentage += persentaseAlokasi;

          if (totalPercentage <= 100) {
            const saldoTeralokasiAwal =
              (persentaseAlokasi / 100) * saldoKeSemua;

            if (pivotVariabelTeralokasi !== 'Semua Alokasi') {
              saldoTeralokasiAkhir =
                saldoTeralokasiAwal + saldoPerAlokasi[variabelAlokasi];

              let outcome = 0;

              note.forEach((item: any) => {
                item.catatan_pengeluaran.forEach((pengeluaran: any) => {
                  if (variabelAlokasi === pengeluaran.jenis_kebutuhan) {
                    outcome += pengeluaran.nominal_uang_keluar;
                  }
                });
              });

              const sisaSaldoTeralokasi = saldoTeralokasiAkhir - outcome;
              const sisaSaldoAlokasiPerSaldoAlokasi =
                sisaSaldoTeralokasi / saldoTeralokasiAkhir;

              return {
                allocationBalance: saldoTeralokasiAkhir,
                allocationVariable: variabelAlokasi,
                allocationPercentage: persentaseAlokasi,
                allocationRemaining: sisaSaldoTeralokasi,
                allocationFraction: sisaSaldoAlokasiPerSaldoAlokasi,
                totalOutcome: outcome,
              };
            } else {
              saldoTeralokasiAkhir = saldoTeralokasiAwal;

              let outcome = 0;

              note.forEach((item: any) => {
                item.catatan_pengeluaran.forEach((pengeluaran: any) => {
                  if (variabelAlokasi === pengeluaran.jenis_kebutuhan) {
                    outcome += pengeluaran.nominal_uang_keluar;
                  }
                });
              });

              const sisaSaldoTeralokasi = saldoTeralokasiAkhir - outcome;
              const sisaSaldoAlokasiPerSaldoAlokasi =
                sisaSaldoTeralokasi / saldoTeralokasiAkhir;

              return {
                allocationBalance: saldoTeralokasiAkhir,
                allocationVariable: variabelAlokasi,
                allocationPercentage: persentaseAlokasi,
                allocationRemaining: sisaSaldoTeralokasi,
                allocationFraction: sisaSaldoAlokasiPerSaldoAlokasi,
                totalOutcome: outcome,
              };
            }
          } else {
            return Alert.alert('Gagal', 'Total persentase lebih dari seratus');
          }
        })
        .filter(result => result !== undefined) as resultAllocation[];

      setResultAllocation(results);
    }
  }, [
    note,
    pivotVariabelTeralokasi,
    saldoKeSemua,
    saldoPerAlokasi,
    savedAllocations,
  ]);

  useEffect(() => {
    calcAllocation();
  }, [calcAllocation, savedAllocations]);

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
        <Text
          style={[
            styles.textPath,
            isDarkMode ? {color: '#0284C7'} : {color: '#ffffff'},
          ]}>
          Alokasi
        </Text>
      </View>
      <ScrollView>
        <View style={styles.container}>
          <Card>
            <View style={{marginVertical: 8}}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '500',
                  marginHorizontal: 4,
                  textAlign: 'center',
                  marginBottom: 6,
                }}>
                Atur Persentase Alokasi
              </Text>
              <View
                style={{
                  padding: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {/* <PieChart donut radius={70} data={allocationPieData} /> */}
              </View>
              {fetchAllocationSection()}
              {postAllocationSection()}
              {/* tombol add */}
              <TouchableOpacity
                onPress={addAllocationSection}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: 6,
                }}>
                <View
                  style={{
                    borderWidth: 2,
                    padding: 6,
                    borderRadius: 5,
                    borderStyle: 'dashed',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Svg
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="#000000"
                    width={24}
                    height={24}>
                    <Path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </Svg>
                </View>
              </TouchableOpacity>
              <View>
                {disableButton ? (
                  <View />
                ) : (
                  <SubmitButton
                    onPress={submitAllocation}
                    textButton="Simpan"
                  />
                )}
              </View>
            </View>
          </Card>

          <View style={{marginVertical: 8}}>
            <LineBreak />
          </View>

          <View>
            {resultAllocation.map((section, index) => (
              <View key={index}>
                {section.allocationVariable === 'Semua Alokasi' ? (
                  <View />
                ) : (
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
                      <Text
                        style={{
                          color: '#0284C7',
                          fontWeight: 'bold',
                          textTransform: 'capitalize',
                        }}>
                        {section.allocationVariable}
                      </Text>

                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'flex-end',
                          alignItems: 'flex-end',
                        }}>
                        <Text style={{fontWeight: 'bold', marginRight: 6}}>
                          {isNaN(section.allocationBalance)
                            ? 'Rp 0'
                            : section.allocationBalance.toLocaleString(
                                'id-ID',
                                {
                                  style: 'currency',
                                  currency: 'IDR',
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 0,
                                },
                              )}
                        </Text>
                      </View>
                    </View>

                    <View style={{margin: 6}}>
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginVertical: 2,
                        }}>
                        <Progress.Bar
                          progress={
                            !isNaN(section.allocationFraction) &&
                            section.allocationFraction > 0
                              ? section.allocationFraction
                              : isNaN(section.allocationFraction)
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
                          <Text style={{fontWeight: 'bold', marginLeft: 6}}>
                            Rp 0
                          </Text>
                        </View>
                        <View
                          style={{
                            flex: 1,
                            justifyContent: 'flex-end',
                            alignItems: 'flex-end',
                          }}>
                          <Text style={{fontWeight: 'bold', marginRight: 6}}>
                            {isNaN(section.allocationRemaining)
                              ? 'Rp 0'
                              : section.totalOutcome === 0
                              ? section.allocationBalance.toLocaleString(
                                  'id-ID',
                                  {
                                    style: 'currency',
                                    currency: 'IDR',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0,
                                  },
                                )
                              : section.allocationRemaining.toLocaleString(
                                  'id-ID',
                                  {
                                    style: 'currency',
                                    currency: 'IDR',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0,
                                  },
                                )}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </Card>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* <View style={{marginTop: 4, marginBottom: 6}}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '500',
              marginVertical: 8,
              marginLeft: 20,
            }}>
            Alokasi
          </Text>
        </View> */}
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
                    backgroundColor: '#0284C7',
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
            <Text style={{fontWeight: 'bold', color: '#0284C7'}}>NOTAKOS.</Text>
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
    shadowColor: '#0284C7',
    shadowOpacity: 0.25,
    shadowOffset: {width: 0, height: 10},
    shadowRadius: 4,
    elevation: 3,
  },
  textPath: {fontSize: 18, fontWeight: 'bold', padding: 30},
  container: {margin: 5},
});

export default Alokasi;
