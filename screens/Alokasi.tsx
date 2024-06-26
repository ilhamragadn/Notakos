/* eslint-disable react-native/no-inline-styles */
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
import * as Progress from 'react-native-progress';
import {Path, Svg} from 'react-native-svg';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import BottomNav from '../components/BottomNav';
import {Card} from '../components/Card';
import Footer from '../components/Footer';
import LineBreak from '../components/LineBreak';
import SubmitButton from '../components/SubmitButton';
import {API_URL} from '../context/AuthContext';

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

const Alokasi = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  const [userID, setUserID] = useState<User>();
  const fetchUser = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/profil`);
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

  const [disableSubmitButton, setDisableSubmitButton] = useState(true);

  const addAllocationSection = () => {
    setAllocationSections([
      ...allocationSections,
      {
        variableAllocationValue: '',
        percentageAllocationValue: 0,
        userIdValue: userID,
      },
    ]);
  };

  const removeAllocationSection = (index: number) => {
    const updatedAllocationSections = [...allocationSections];
    updatedAllocationSections.splice(index, 1);
    setAllocationSections(updatedAllocationSections);
    setDisableSubmitButton(true);
  };

  const handleVariableAllocation = (
    variableAllocationVal: string,
    index: number,
  ) => {
    const updatedAllocationSections = [...allocationSections];
    updatedAllocationSections[index].variableAllocationValue =
      variableAllocationVal;
    setAllocationSections(updatedAllocationSections);
    setDisableSubmitButton(false);
  };

  const handlePercentageAllocation = (
    percentageAllocationVal: string,
    index: number,
  ) => {
    const parsedValue = parseInt(
      percentageAllocationVal.replace(/[^\d]/g, ''),
      10,
    );
    const newValue = isNaN(parsedValue) ? 0 : parsedValue;

    const updatedAllocationSections = [...allocationSections];
    updatedAllocationSections[index].percentageAllocationValue = newValue;

    const newTotalPercentage = updatedAllocationSections.reduce(
      (total, section) => total + section.percentageAllocationValue,
      0,
    );

    if (newTotalPercentage > 100) {
      setDisableSubmitButton(true);
      setDisableUpdateButton(true);
      Alert.alert('Error', 'Harap masukkan nilai yang valid');
      return;
    } else {
      setAllocationSections(updatedAllocationSections);
      setDisableSubmitButton(false);
    }
  };

  const preparePostAllocationData = () => {
    const postData = allocationSections.map(section => ({
      variabel_alokasi: section.variableAllocationValue,
      persentase_alokasi: section.percentageAllocationValue,
      user_id: section.userIdValue,
    }));

    console.log('Prepared post data:', JSON.stringify(postData, null, 2));

    return postData;
  };

  const [isLoading, setIsLoading] = useState(false);

  const submitAllocation = async () => {
    try {
      const postAllocationData = preparePostAllocationData();

      if (postAllocationData.every(e => e.variabel_alokasi === '')) {
        Alert.alert('Error', 'Kolom alokasi tidak boleh kosong');
        return;
      } else if (postAllocationData.every(e => e.persentase_alokasi === 0)) {
        Alert.alert('Error', 'Kolom persentase tidak boleh 0');
        return;
      }

      const totalPersenSementara = postAllocationData.reduce(
        (total, allocation) => total + allocation.persentase_alokasi,
        totalPercentage,
      );
      if (totalPersenSementara > 100) {
        setDisableSubmitButton(true);
        setAllocationSections([
          {
            variableAllocationValue: '',
            percentageAllocationValue: 0,
            userIdValue: userID,
          },
        ]);
        Alert.alert(
          'Error',
          'Jumlah persentase alokasi tidak boleh lebih dari 100%',
        );
        return;
      }

      console.log(postAllocationData);

      setIsLoading(true);
      const response = await axios.post(
        `${API_URL}/alokasi`,
        postAllocationData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      setIsLoading(false);
      console.log('Success post data: ', response.data);
      Alert.alert('Berhasil', 'Data Berhasil Disimpan');
      setDisableSubmitButton(true);
      fetchAllocation();

      setAllocationSections([
        {
          variableAllocationValue: '',
          percentageAllocationValue: 0,
          userIdValue: userID,
        },
      ]);
    } catch (error) {
      setIsLoading(false);
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
                height: 40,
                borderRadius: 8,
                paddingHorizontal: 12,
                backgroundColor: '#f2f2f2',
              }}
              value={section.variableAllocationValue}
              onChangeText={text => {
                handleVariableAllocation(text, index);
              }}
              placeholder="Harian, Bulanan, Darurat"
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: 6,
              backgroundColor: '#f2f2f2',
              borderRadius: 8,
            }}>
            <TextInput
              style={{
                height: 40,
                width: 40,
                marginLeft: 6,
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
                marginRight: 6,
                paddingVertical: 4,
                justifyContent: 'center',
                alignItems: 'center',
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
  const [totalPercentage, setTotalPercentage] = useState(0);

  const fetchAllocation = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API_URL}/alokasi`);
      if (res.data.success) {
        const dataAlokasi = res.data.data;
        setSavedAllocations(dataAlokasi);

        let totalSaldoSemua = 0;
        let variabelTeralokasi = '';
        let newSaldoTeralokasi: alokasiSaldo = {};
        let saldoDefault = 0;
        let saldoTeralokasi = 0;
        let totalPersentase = 0;

        dataAlokasi.forEach((item: any) => {
          totalPersentase += item.persentase_alokasi;
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

        setTotalPercentage(totalPersentase);
        setSaldoKeSemua(totalSaldoSemua);
        setPivotVariabelTeralokasi(variabelTeralokasi);
        setSaldoPerAlokasi(newSaldoTeralokasi);

        setIsLoading(false);
        console.log(dataAlokasi);
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  }, []);

  useEffect(() => {
    fetchAllocation();
  }, [fetchAllocation]);

  const [disableUpdateButton, setDisableUpdateButton] = useState(true);
  const [updatedIndices, setUpdatedIndices] = useState<any[]>([]);
  const handleUpdateAllocation = async (allocation: Allocation) => {
    try {
      if (allocation.variabel_alokasi === '') {
        Alert.alert('Error', 'Kolom alokasi tidak boleh kosong');
        return;
      } else if (allocation.persentase_alokasi === 0) {
        Alert.alert('Error', 'Kolom persentase tidak boleh 0');
        return;
      }

      setIsLoading(true);

      const response = await axios.put(`${API_URL}/alokasi/${allocation.id}`, {
        variabel_alokasi: allocation.variabel_alokasi,
        persentase_alokasi: allocation.persentase_alokasi,
      });

      setIsLoading(false);
      setUpdatedIndices(
        updatedIndices.filter(index => index !== allocation.id),
      );
      setDisableUpdateButton(true);
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
      setIsLoading(true);

      const response = await axios.delete(`${API_URL}/alokasi/${id}`);

      setIsLoading(false);
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
                  height: 40,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  backgroundColor: '#f2f2f2',
                }}
                value={allocation.variabel_alokasi}
                onChangeText={text => {
                  const updatedAllocations = [...savedAllocations];
                  updatedAllocations[index].variabel_alokasi = text;
                  setSavedAllocations(updatedAllocations);
                  setDisableUpdateButton(false);
                  if (!updatedIndices.includes(index)) {
                    setUpdatedIndices([...updatedIndices, index]);
                  }
                }}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: 6,
                backgroundColor: '#f2f2f2',
                borderRadius: 8,
              }}>
              <TextInput
                style={{
                  height: 40,
                  width: 40,
                  marginLeft: 6,
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
                  setDisableUpdateButton(false);
                  if (!updatedIndices.includes(index)) {
                    setUpdatedIndices([...updatedIndices, index]);
                  }
                }}
                placeholder="50"
                inputMode="numeric"
              />
              <View
                style={{
                  marginRight: 6,
                  paddingVertical: 4,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{fontSize: 20, fontWeight: 'bold'}}>%</Text>
              </View>
            </View>

            {/* tombol update */}
            {disableUpdateButton ? (
              <View />
            ) : (
              <TouchableOpacity
                onPress={() => handleUpdateAllocation(allocation)}
                style={{
                  marginHorizontal: 4,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#16A34A',
                  paddingHorizontal: 8,
                  borderRadius: 10,
                  display: updatedIndices.includes(index) ? 'flex' : 'none',
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
            )}

            {/* tombol sampah */}
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  'Perhatian',
                  'Apakah Anda yakin ingin menghapus data ini?',
                  [
                    {
                      text: 'Batal',
                    },
                    {
                      text: 'OK',
                      onPress: () => handleDeleteAllocation(allocation.id),
                    },
                  ],
                  {cancelable: false},
                )
              }
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
        setIsLoading(true);
        const res = await axios.get(`${API_URL}/catatan`);
        if (res.data.success) {
          const dataCatatan = res.data.data;
          setNote(dataCatatan);
        }

        setIsLoading(false);
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
    let resultTotalPercentage = 0;

    if (savedAllocations && savedAllocations.length > 0) {
      const results = savedAllocations
        .map((section, index) => {
          const variabelAlokasi = section.variabel_alokasi;
          const persentaseAlokasi = section.persentase_alokasi;
          let saldoTeralokasiAkhir = 0;

          resultTotalPercentage += persentaseAlokasi;

          if (resultTotalPercentage <= 100) {
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
            if (!updatedIndices.includes(index)) {
              setUpdatedIndices([...updatedIndices, index]);
            }
            setDisableUpdateButton(true);
            Alert.alert('Gagal', 'Harap masukkan nilai yang valid');
            return undefined;
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
    updatedIndices,
  ]);

  useEffect(() => {
    calcAllocation();
  }, [calcAllocation, savedAllocations]);

  const [infoAllocation, setInfoAllocation] = useState(false);

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
        <View
          style={{
            justifyContent: 'center',
            marginLeft: 24,
            paddingHorizontal: 8,
          }}>
          <Text
            style={[
              styles.textPath,
              {color: isDarkMode ? '#0284C7' : Colors.lighter},
            ]}>
            Alokasi
          </Text>
        </View>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => setInfoAllocation(!infoAllocation)}>
          <Svg
            fill={isDarkMode ? '#0284C7' : Colors.lighter}
            viewBox="0 0 24 24"
            width={22}
            height={22}>
            <Path
              fillRule="evenodd"
              clipRule="evenodd"
              strokeLinejoin="round"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
            />
          </Svg>
        </TouchableOpacity>
      </View>
      <ScrollView>
        {isLoading ? (
          <View
            style={{
              marginTop: 35,
              marginBottom: 25,
              justifyContent: 'center',
            }}>
            <ActivityIndicator size="large" color="#0284C7" />
          </View>
        ) : (
          <View style={styles.container}>
            <Card>
              <View style={{marginVertical: 8}}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 6,
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '500',
                      textAlign: 'center',
                    }}>
                    Kelola Alokasi
                  </Text>
                </View>

                {fetchAllocationSection()}

                {totalPercentage >= 100 ? (
                  <View />
                ) : (
                  <>
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
                          backgroundColor: '#0284C7',
                          borderRadius: 8,
                          padding: 6,
                          justifyContent: 'center',
                          alignItems: 'center',
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
                            d="M12 4.5v15m7.5-7.5h-15"
                          />
                        </Svg>
                      </View>
                    </TouchableOpacity>
                    <View>
                      {disableSubmitButton ? (
                        <View />
                      ) : (
                        <SubmitButton
                          onPress={submitAllocation}
                          textButton="Simpan"
                          disabled={isLoading}
                        />
                      )}
                    </View>
                  </>
                )}
              </View>
            </Card>

            <Modal
              transparent={true}
              animationType="fade"
              visible={infoAllocation}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                }}>
                <Card>
                  <View style={{marginVertical: 2, padding: 5}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        backgroundColor: 'rgba(0, 163, 255, 0.1)',
                        borderColor: '#0D6EFD',
                        borderWidth: 1,
                        borderRadius: 10,
                        padding: 6,
                      }}>
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
                        <Text style={{color: '#0D6EFD', textAlign: 'justify'}}>
                          Silahkan atur alokasi berdasarkan kebutuhan dan
                          kisaran persentase yang akan dikeluarkan. Contoh:
                          kebutuhan harian menghabiskan 50% dari total
                          pemasukan, kebutuhan bulanan sebesar 30%, dan sisanya
                          untuk kebutuhan mendesak sebesar 20%. Ingat, jangan
                          melebihi 100% untuk total persentase dari tiap alokasi
                          kebutuhanmu.
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
                    onPress={() => setInfoAllocation(!infoAllocation)}>
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

            <View>
              {resultAllocation.map((section, index) => (
                <View key={index}>
                  {section.allocationVariable === 'Semua Alokasi' ? (
                    <View />
                  ) : (
                    <>
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
                                !isNaN(section.allocationFraction)
                                  ? section.allocationFraction > 0
                                    ? section.allocationFraction
                                    : section.allocationFraction
                                  : isNaN(section.allocationFraction)
                                  ? 0
                                  : 10
                              }
                              width={320}
                              color="#0284C7"
                              unfilledColor="#e9ecef"
                            />
                          </View>

                          <View
                            style={{flexDirection: 'row', marginVertical: 6}}>
                            <View
                              style={{
                                flex: 1,
                                justifyContent: 'flex-end',
                                alignItems: 'flex-end',
                              }}>
                              <Text
                                style={{fontWeight: 'bold', marginRight: 6}}>
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
                    </>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={{marginTop: 8}}>
          <LineBreak />
        </View>

        <Footer />
      </ScrollView>
      <View
        style={{
          position: 'absolute',
          bottom: 450,
          left: 0,
          right: 0,
        }}>
        <BottomNav />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  boxPath: {
    flexDirection: 'row',
    paddingVertical: 36,
    marginBottom: 4,
  },
  textPath: {fontSize: 20, fontWeight: 'bold'},
  container: {margin: 5},
});

export default Alokasi;
