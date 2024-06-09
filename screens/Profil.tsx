/* eslint-disable react-native/no-inline-styles */
import axios from 'axios';
import React, {useEffect, useState} from 'react';
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
import {Path, Svg} from 'react-native-svg';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {BottomNavbar} from '../components/BottomNavbar';
import {Card} from '../components/Card';
import LineBreak from '../components/LineBreak';
import SubmitButton from '../components/SubmitButton';
import {API_URL, useAuth} from '../context/AuthContext';

type Profil = {
  name: string;
  email: string;
  parent_email: string;
  password: string;
  password_confirmation: string;
};

const Profil = ({navigation}: any) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  const [isLoading, setIsLoading] = useState(false);
  const [totalPemasukan, setTotalPemasukan] = useState(0);
  const [totalPengeluaran, setTotalPengeluaran] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [cardMonth, setCardMonth] = useState(false);

  const toggleCardMonth = () => {
    setCardMonth(!cardMonth);
  };

  const monthNames = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  const handleMonthSelect = (month: any) => {
    setSelectedMonth(month);
    setCardMonth(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const res = await axios.get(`${API_URL}/catatan`);
      if (res.data.success) {
        const dataCatatan = res.data.data;
        console.log(dataCatatan);

        let totalPemasukanVal = 0;
        let totalPengeluaranVal = 0;

        dataCatatan.forEach((item: any) => {
          const itemDate = new Date(item.created_at);
          const itemMonth = itemDate.getMonth();
          if (itemMonth === selectedMonth) {
            totalPemasukanVal += item.total_uang_masuk || 0;
            totalPengeluaranVal += item.total_uang_keluar || 0;
          }
        });

        setTotalPemasukan(totalPemasukanVal);
        setTotalPengeluaran(totalPengeluaranVal);
        setIsLoading(false);
      }
      try {
      } catch (error) {}
    };

    fetchData();
  }, [selectedMonth]);

  const [visibleProfile, setVisibleProfile] = useState(false);
  const toggleVisibilityProfile = () => {
    setVisibleProfile(!visibleProfile);
  };

  const [disableSaveButtonProfile, setDisableSaveButtonProfile] =
    useState(true);
  const [disableSaveButtonPassword, setDisableSaveButtonPassword] =
    useState(true);

  const [editableName, setEditableName] = useState(false);
  const toggleEditableName = () => {
    setEditableName(!editableName);
  };
  const [editableEmail, setEditableEmail] = useState(false);
  const toggleEditableEmail = () => {
    setEditableEmail(!editableEmail);
  };
  const [editableParentEmail, setEditableParentEmail] = useState(false);
  const toggleEditableParentEmail = () => {
    setEditableParentEmail(!editableParentEmail);
  };

  const [infoParentEmail, setInfoParentEmail] = useState(false);

  const [visibleNewPassword, setVisibleNewPassword] = useState(false);
  const toggleVisibilityNewPassword = () => {
    setVisibleNewPassword(!visibleNewPassword);
  };

  const [secureNewPassword, setSecureNewPassword] = useState(true);
  const toggleSecureNewPassword = () => {
    setSecureNewPassword(!secureNewPassword);
  };
  const [secureNewPasswordConfirmation, setSecureNewPasswordConfirmation] =
    useState(true);
  const toggleSecureNewPasswordConfirmation = () => {
    setSecureNewPasswordConfirmation(!secureNewPasswordConfirmation);
  };

  const [visibleFAQ, setVisibleFAQ] = useState(false);
  const toggleVisibilityFAQ = () => {
    setVisibleFAQ(!visibleFAQ);
  };

  const {onLogout} = useAuth();

  const [profileData, setProfileData] = useState<Profil>({
    name: '',
    email: '',
    parent_email: '',
    password: '',
    password_confirmation: '',
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${API_URL}/profil`);

        if (res.data) {
          const dataProfil = res.data;
          console.log(dataProfil);
          setProfileData(dataProfil);
          setIsLoading(false);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfileData();
  }, []);

  const [isLoadingUpdateProfile, setIsLoadingUpdateProfile] = useState(false);

  const handleUpdateProfile = async (profil: Profil) => {
    try {
      setIsLoadingUpdateProfile(true);
      const res = await axios.put(`${API_URL}/profil`, {
        name: profil.name,
        email: profil.email,
        parent_email: profil.parent_email,
      });

      setIsLoadingUpdateProfile(false);
      setDisableSaveButtonProfile(true);
      Alert.alert('Berhasil', 'Profil telah diperbarui!');
      console.log('Success update: ', res.data);
    } catch (error) {
      setIsLoadingUpdateProfile(false);
      console.error(error);
    }
  };

  const [isLoadingUpdatePassword, setIsLoadingUpdatePassword] = useState(false);

  const handleUpdatePassword = async (profil: Profil) => {
    try {
      setIsLoadingUpdatePassword(true);
      const res = await axios.put(`${API_URL}/profil/password`, {
        password: profil.password,
        password_confirmation: profil.password_confirmation,
      });

      setIsLoadingUpdatePassword(false);
      setDisableSaveButtonPassword(true);
      Alert.alert('Berhasil', 'Password telah diperbarui!');
      console.log('Success update password: ', res.data);
    } catch (error) {
      setIsLoadingUpdatePassword(false);
      console.error(error);
    }
  };

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
            {flex: 1},
            styles.textPath,
            isDarkMode ? {color: '#0284C7'} : {color: '#ffffff'},
          ]}>
          Profil
        </Text>

        <TouchableOpacity
          onPress={onLogout}
          style={{justifyContent: 'center', alignItems: 'center'}}>
          <View
            style={[
              isDarkMode
                ? {backgroundColor: '#0284C7'}
                : {backgroundColor: '#FFFFFF'},
              {
                margin: 20,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 9999,
              },
            ]}>
            <Text
              style={[
                isDarkMode ? {color: '#FFFFFF'} : {color: '#DC2626'},
                {marginHorizontal: 8, fontWeight: 'bold'},
              ]}>
              Keluar
            </Text>
          </View>
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
            <View style={[styles.box, {marginBottom: 8}]}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Svg
                  viewBox="0 0 24 24"
                  width={100}
                  height={100}
                  fill="#0284C7">
                  <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                  />
                </Svg>
              </View>

              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    textTransform: 'capitalize',
                    fontSize: 18,
                    fontWeight: 'bold',
                  }}>
                  {profileData?.name}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 2,
                }}>
                <Text style={{fontStyle: 'italic'}}>{profileData?.email}</Text>
              </View>
            </View>

            <View>
              <Card>
                <View style={[styles.box, {flexDirection: 'row'}]}>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        margin: 2,
                        padding: 8,
                        borderRadius: 9999,
                        backgroundColor: '#DC2626',
                      }}>
                      <Svg
                        fill="none"
                        viewBox="0 0 24 24"
                        width={22}
                        height={22}
                        strokeWidth={2}
                        stroke="#FFFFFF">
                        <Path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
                        />
                      </Svg>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 0.5,
                      borderRightWidth: 0.5,
                    }}>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderBottomWidth: 0.5,
                      }}>
                      <Text
                        style={{
                          fontWeight: 'bold',
                        }}>
                        Total Pengeluaran
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text style={{fontSize: 12}}>
                        {totalPengeluaran.toLocaleString('id-ID', {
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
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginLeft: 0.5,
                      borderLeftWidth: 0.5,
                    }}>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderBottomWidth: 0.5,
                      }}>
                      <Text
                        style={{
                          fontWeight: 'bold',
                        }}>
                        Total Pemasukan
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text style={{fontSize: 12}}>
                        {totalPemasukan.toLocaleString('id-ID', {
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
                    }}>
                    <View
                      style={{
                        margin: 2,
                        padding: 8,
                        borderRadius: 9999,
                        backgroundColor: '#16A34A',
                      }}>
                      <Svg
                        fill="none"
                        viewBox="0 0 24 24"
                        width={22}
                        height={22}
                        strokeWidth={2}
                        stroke="#FFFFFF">
                        <Path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
                        />
                      </Svg>
                    </View>
                  </View>
                </View>
              </Card>
            </View>

            <View
              style={{
                marginBottom: 8,
                marginHorizontal: 4,
              }}>
              <TouchableOpacity
                onPress={toggleCardMonth}
                style={{
                  paddingVertical: 4,
                  paddingHorizontal: 8,
                  borderWidth: 1.5,
                  borderRadius: 8,
                  borderColor: '#0284C7',
                  backgroundColor: '#F0F9FF',
                  shadowColor: '#0284C7',
                  shadowOpacity: 0.25,
                  shadowRadius: 3.5,
                  shadowOffset: {width: 0, height: 10},
                  elevation: 3,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: '#0284C7',
                      marginHorizontal: 4,
                    }}>
                    {monthNames[selectedMonth]}
                  </Text>
                  <View
                    style={{
                      justifyContent: 'center',
                    }}>
                    <Svg
                      viewBox="0 0 320 512"
                      width={16}
                      height={16}
                      fill="#0284C7">
                      <Path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" />
                    </Svg>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {cardMonth && (
              <View
                style={{
                  position: 'absolute',
                  top: 275,
                  marginHorizontal: 1.5,
                  zIndex: 1,
                }}>
                <View style={{width: 380}}>
                  <Card>
                    <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                      {monthNames.map((month, index) => (
                        <TouchableOpacity
                          key={index}
                          onPress={() => handleMonthSelect(index)}
                          style={{
                            width: '33%',
                            paddingVertical: 4,
                          }}>
                          <Text
                            style={{
                              marginVertical: 2,
                              paddingVertical: 2,
                              textAlign: 'center',
                            }}>
                            {month}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </Card>
                </View>
              </View>
            )}

            <Card>
              <View style={[styles.box, {flexDirection: 'row'}]}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 2,
                  }}>
                  <Svg
                    viewBox="0 0 640 512"
                    width={30}
                    height={30}
                    fill="#0284C7">
                    <Path d="M224 0a128 128 0 1 1 0 256A128 128 0 1 1 224 0zM178.3 304h91.4c11.8 0 23.4 1.2 34.5 3.3c-2.1 18.5 7.4 35.6 21.8 44.8c-16.6 10.6-26.7 31.6-20 53.3c4 12.9 9.4 25.5 16.4 37.6s15.2 23.1 24.4 33c15.7 16.9 39.6 18.4 57.2 8.7v.9c0 9.2 2.7 18.5 7.9 26.3H29.7C13.3 512 0 498.7 0 482.3C0 383.8 79.8 304 178.3 304zM436 218.2c0-7 4.5-13.3 11.3-14.8c10.5-2.4 21.5-3.7 32.7-3.7s22.2 1.3 32.7 3.7c6.8 1.5 11.3 7.8 11.3 14.8v17.7c0 7.8 4.8 14.8 11.6 18.7c6.8 3.9 15.1 4.5 21.8 .6l13.8-7.9c6.1-3.5 13.7-2.7 18.5 2.4c7.6 8.1 14.3 17.2 20.1 27.2s10.3 20.4 13.5 31c2.1 6.7-1.1 13.7-7.2 17.2l-14.4 8.3c-6.5 3.7-10 10.9-10 18.4s3.5 14.7 10 18.4l14.4 8.3c6.1 3.5 9.2 10.5 7.2 17.2c-3.3 10.6-7.8 21-13.5 31s-12.5 19.1-20.1 27.2c-4.8 5.1-12.5 5.9-18.5 2.4l-13.8-7.9c-6.7-3.9-15.1-3.3-21.8 .6c-6.8 3.9-11.6 10.9-11.6 18.7v17.7c0 7-4.5 13.3-11.3 14.8c-10.5 2.4-21.5 3.7-32.7 3.7s-22.2-1.3-32.7-3.7c-6.8-1.5-11.3-7.8-11.3-14.8V467.8c0-7.9-4.9-14.9-11.7-18.9c-6.8-3.9-15.2-4.5-22-.6l-13.5 7.8c-6.1 3.5-13.7 2.7-18.5-2.4c-7.6-8.1-14.3-17.2-20.1-27.2s-10.3-20.4-13.5-31c-2.1-6.7 1.1-13.7 7.2-17.2l14-8.1c6.5-3.8 10.1-11.1 10.1-18.6s-3.5-14.8-10.1-18.6l-14-8.1c-6.1-3.5-9.2-10.5-7.2-17.2c3.3-10.6 7.7-21 13.5-31s12.5-19.1 20.1-27.2c4.8-5.1 12.4-5.9 18.5-2.4l13.6 7.8c6.8 3.9 15.2 3.3 22-.6c6.9-3.9 11.7-11 11.7-18.9V218.2zm92.1 133.5a48.1 48.1 0 1 0 -96.1 0 48.1 48.1 0 1 0 96.1 0z" />
                  </Svg>
                </View>
                <View
                  style={{
                    flex: 6,
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    marginHorizontal: 6,
                    paddingHorizontal: 6,
                  }}>
                  <View>
                    <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                      Perbarui Profil
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={toggleVisibilityProfile}>
                  {visibleProfile === false ? (
                    <Svg
                      fill="none"
                      viewBox="0 0 24 24"
                      width={24}
                      height={24}
                      strokeWidth={2}
                      stroke="#000000">
                      <Path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m8.25 4.5 7.5 7.5-7.5 7.5"
                      />
                    </Svg>
                  ) : (
                    <Svg
                      fill="none"
                      viewBox="0 0 24 24"
                      width={24}
                      height={24}
                      strokeWidth={2}
                      stroke="#000000">
                      <Path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m19.5 8.25-7.5 7.5-7.5-7.5"
                      />
                    </Svg>
                  )}
                </TouchableOpacity>
              </View>
            </Card>

            {isLoadingUpdateProfile ? (
              <Card>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#FFFFFF',
                    marginVertical: 8,
                  }}>
                  <ActivityIndicator size="large" color="#0284C7" />
                </View>
              </Card>
            ) : (
              visibleProfile && (
                <Card>
                  <View style={[styles.box, {flexDirection: 'row'}]}>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        marginHorizontal: 6,
                        paddingHorizontal: 6,
                      }}>
                      <View>
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: 'bold',
                            marginBottom: 6,
                          }}>
                          Nama
                        </Text>
                        <TextInput
                          style={{
                            width: 300,
                            backgroundColor: '#f2f2f2',
                            paddingHorizontal: 18,
                            marginHorizontal: 2,
                            borderRadius: 8,
                          }}
                          value={profileData?.name}
                          editable={editableName}
                          onChangeText={text => {
                            setProfileData(prevState => ({
                              ...prevState,
                              name: text,
                            }));
                            setDisableSaveButtonProfile(false);
                          }}
                        />
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={toggleEditableName}
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 30,
                        marginRight: 4,
                      }}>
                      <Svg
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="#0284C7"
                        width={20}
                        height={20}>
                        <Path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                        />
                      </Svg>
                    </TouchableOpacity>
                  </View>

                  <View style={{marginBottom: 4}}>
                    <LineBreak />
                  </View>

                  <View style={[styles.box, {flexDirection: 'row'}]}>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        marginHorizontal: 6,
                        paddingHorizontal: 6,
                      }}>
                      <View>
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: 'bold',
                            marginBottom: 6,
                          }}>
                          Email
                        </Text>
                        <TextInput
                          style={{
                            width: 300,
                            backgroundColor: '#f2f2f2',
                            paddingHorizontal: 18,
                            marginHorizontal: 2,
                            borderRadius: 8,
                          }}
                          value={profileData?.email}
                          editable={editableEmail}
                          onChangeText={text => {
                            setProfileData(prevState => ({
                              ...prevState,
                              email: text,
                            }));
                            setDisableSaveButtonProfile(false);
                          }}
                        />
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={toggleEditableEmail}
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 30,
                        marginRight: 4,
                      }}>
                      <Svg
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="#0284C7"
                        width={20}
                        height={20}>
                        <Path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                        />
                      </Svg>
                    </TouchableOpacity>
                  </View>

                  <View style={{marginBottom: 4}}>
                    <LineBreak />
                  </View>

                  <View style={[styles.box, {flexDirection: 'row'}]}>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        marginHorizontal: 6,
                        paddingHorizontal: 6,
                      }}>
                      <View>
                        <View style={{flexDirection: 'row'}}>
                          <Text
                            style={{
                              flex: 1,
                              fontSize: 12,
                              fontWeight: 'bold',
                              marginBottom: 6,
                            }}>
                            Email Orang Tua
                          </Text>
                          <TouchableOpacity
                            onPress={() => setInfoParentEmail(!infoParentEmail)}
                            style={{marginHorizontal: 6}}>
                            <Svg
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.8}
                              stroke="#0D6EFD"
                              width={16}
                              height={16}>
                              <Path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                              />
                            </Svg>
                          </TouchableOpacity>
                        </View>
                        {profileData.parent_email !== null ? (
                          <TextInput
                            style={{
                              width: 300,
                              backgroundColor: '#f2f2f2',
                              paddingHorizontal: 18,
                              marginHorizontal: 2,
                              borderRadius: 8,
                            }}
                            value={profileData?.parent_email}
                            editable={editableParentEmail}
                            onChangeText={text => {
                              setProfileData(prevState => ({
                                ...prevState,
                                parent_email: text,
                              }));
                              setDisableSaveButtonProfile(false);
                            }}
                          />
                        ) : (
                          <TextInput
                            style={{
                              width: 300,
                              backgroundColor: '#f2f2f2',
                              paddingHorizontal: 18,
                              marginHorizontal: 2,
                              borderRadius: 8,
                            }}
                            placeholder="Masukkan Email Orang Tua"
                            editable={editableParentEmail}
                            onChangeText={text => {
                              setProfileData(prevState => ({
                                ...prevState,
                                parent_email: text,
                              }));
                              setDisableSaveButtonProfile(false);
                            }}
                          />
                        )}
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={toggleEditableParentEmail}
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 30,
                        marginRight: 4,
                      }}>
                      <Svg
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="#0284C7"
                        width={20}
                        height={20}>
                        <Path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                        />
                      </Svg>
                    </TouchableOpacity>
                  </View>

                  <View style={{marginBottom: 4}}>
                    <LineBreak />
                  </View>

                  {disableSaveButtonProfile ? (
                    <View />
                  ) : (
                    <SubmitButton
                      textButton="Perbarui"
                      onPress={() => handleUpdateProfile(profileData)}
                      disabled={isLoadingUpdateProfile}
                    />
                  )}
                </Card>
              )
            )}

            <Modal
              transparent={true}
              animationType="fade"
              visible={infoParentEmail}>
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
                          Mohon cantumkan juga email orang tuamu. Email orang
                          tua dibutuhkan agar orang tua menerima notifikasi
                          hasil rekapitulasi pencatatan keuanganmu sehingga
                          catatan keuanganmu dapat dipantau oleh orang tuamu.
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
                    onPress={() => setInfoParentEmail(!infoParentEmail)}>
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
              <View style={[styles.box, {flexDirection: 'row'}]}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 2,
                  }}>
                  <Svg
                    viewBox="0 0 512 512"
                    width={24}
                    height={24}
                    fill="#0284C7">
                    <Path d="M336 352c97.2 0 176-78.8 176-176S433.2 0 336 0S160 78.8 160 176c0 18.7 2.9 36.8 8.3 53.7L7 391c-4.5 4.5-7 10.6-7 17v80c0 13.3 10.7 24 24 24h80c13.3 0 24-10.7 24-24V448h40c13.3 0 24-10.7 24-24V384h40c6.4 0 12.5-2.5 17-7l33.3-33.3c16.9 5.4 35 8.3 53.7 8.3zM376 96a40 40 0 1 1 0 80 40 40 0 1 1 0-80z" />
                  </Svg>
                </View>
                <View
                  style={{
                    flex: 6,
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    marginHorizontal: 6,
                    paddingHorizontal: 6,
                  }}>
                  <View>
                    <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                      Perbarui Password
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={toggleVisibilityNewPassword}>
                  {visibleNewPassword === false ? (
                    <Svg
                      fill="none"
                      viewBox="0 0 24 24"
                      width={24}
                      height={24}
                      strokeWidth={2}
                      stroke="#000000">
                      <Path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m8.25 4.5 7.5 7.5-7.5 7.5"
                      />
                    </Svg>
                  ) : (
                    <Svg
                      fill="none"
                      viewBox="0 0 24 24"
                      width={24}
                      height={24}
                      strokeWidth={2}
                      stroke="#000000">
                      <Path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m19.5 8.25-7.5 7.5-7.5-7.5"
                      />
                    </Svg>
                  )}
                </TouchableOpacity>
              </View>
            </Card>

            {isLoadingUpdatePassword ? (
              <Card>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#FFFFFF',
                    marginVertical: 8,
                  }}>
                  <ActivityIndicator size="large" color="#0284C7" />
                </View>
              </Card>
            ) : (
              visibleNewPassword && (
                <Card>
                  <View style={[styles.box, {flexDirection: 'row'}]}>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        marginHorizontal: 6,
                        paddingHorizontal: 6,
                      }}>
                      <View>
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: 'bold',
                            marginBottom: 6,
                          }}>
                          Password Baru
                        </Text>
                        <TextInput
                          style={{
                            width: 300,
                            backgroundColor: '#f2f2f2',
                            paddingHorizontal: 18,
                            marginHorizontal: 2,
                            borderRadius: 8,
                          }}
                          placeholder="Masukkan Password Baru"
                          secureTextEntry={secureNewPassword}
                          onChangeText={text => {
                            setProfileData(prevState => ({
                              ...prevState,
                              password: text,
                            }));
                            setDisableSaveButtonPassword(false);
                          }}
                        />
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={toggleSecureNewPassword}
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 30,
                        marginRight: 4,
                      }}>
                      {secureNewPassword === true ? (
                        <Svg
                          viewBox="0 0 24 24"
                          fill="#0284C7"
                          width={22}
                          height={22}>
                          <Path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
                          <Path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
                          <Path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
                        </Svg>
                      ) : (
                        <Svg
                          viewBox="0 0 24 24"
                          fill="#0284C7"
                          width={22}
                          height={22}>
                          <Path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                          <Path
                            fillRule="evenodd"
                            d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                            clipRule="evenodd"
                          />
                        </Svg>
                      )}
                    </TouchableOpacity>
                  </View>

                  <View style={{marginBottom: 4}}>
                    <LineBreak />
                  </View>

                  <View style={[styles.box, {flexDirection: 'row'}]}>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        marginHorizontal: 6,
                        paddingHorizontal: 6,
                      }}>
                      <View>
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: 'bold',
                            marginBottom: 6,
                          }}>
                          Konfirmasi Password Baru
                        </Text>
                        <TextInput
                          style={{
                            width: 300,
                            backgroundColor: '#f2f2f2',
                            paddingHorizontal: 18,
                            marginHorizontal: 2,
                            borderRadius: 8,
                          }}
                          placeholder="Konfirmasikan Password Baru"
                          secureTextEntry={secureNewPasswordConfirmation}
                          onChangeText={text => {
                            setProfileData(prevState => ({
                              ...prevState,
                              password_confirmation: text,
                            }));
                            setDisableSaveButtonPassword(false);
                          }}
                        />
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={toggleSecureNewPasswordConfirmation}
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 30,
                        marginRight: 4,
                      }}>
                      {secureNewPasswordConfirmation === true ? (
                        <Svg
                          viewBox="0 0 24 24"
                          fill="#0284C7"
                          width={22}
                          height={22}>
                          <Path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
                          <Path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
                          <Path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
                        </Svg>
                      ) : (
                        <Svg
                          viewBox="0 0 24 24"
                          fill="#0284C7"
                          width={22}
                          height={22}>
                          <Path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                          <Path
                            fillRule="evenodd"
                            d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                            clipRule="evenodd"
                          />
                        </Svg>
                      )}
                    </TouchableOpacity>
                  </View>

                  <View style={{marginBottom: 4}}>
                    <LineBreak />
                  </View>

                  {disableSaveButtonPassword ? (
                    <View />
                  ) : (
                    <SubmitButton
                      textButton="Simpan"
                      onPress={() => handleUpdatePassword(profileData)}
                      disabled={isLoadingUpdatePassword}
                    />
                  )}
                </Card>
              )
            )}

            {/* FAQ */}
            <Card>
              <View style={[styles.box, {flexDirection: 'row'}]}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 2,
                  }}>
                  <Svg
                    fill="#0284C7"
                    viewBox="0 0 24 24"
                    width={30}
                    height={30}>
                    <Path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 0 1-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 0 1-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 0 1-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584ZM12 18a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                    />
                  </Svg>
                </View>
                <View
                  style={{
                    flex: 6,
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    marginHorizontal: 6,
                    paddingHorizontal: 6,
                  }}>
                  <View>
                    <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                      Pertanyaan Umum
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={toggleVisibilityFAQ}>
                  {visibleFAQ === false ? (
                    <Svg
                      fill="none"
                      viewBox="0 0 24 24"
                      width={24}
                      height={24}
                      strokeWidth={2}
                      stroke="#000000">
                      <Path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m8.25 4.5 7.5 7.5-7.5 7.5"
                      />
                    </Svg>
                  ) : (
                    <Svg
                      fill="none"
                      viewBox="0 0 24 24"
                      width={24}
                      height={24}
                      strokeWidth={2}
                      stroke="#000000">
                      <Path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m19.5 8.25-7.5 7.5-7.5-7.5"
                      />
                    </Svg>
                  )}
                </TouchableOpacity>
              </View>
            </Card>

            {visibleFAQ && (
              <Card>
                <Card>
                  <View style={[styles.box, {flexDirection: 'row'}]}>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        marginHorizontal: 6,
                        paddingHorizontal: 6,
                      }}>
                      <Text style={{fontWeight: 'bold'}}>Apa itu NOTAKOS?</Text>
                    </View>
                  </View>

                  <View
                    style={{
                      justifyContent: 'center',
                      marginHorizontal: 12,
                      paddingHorizontal: 6,
                      marginVertical: 2,
                      paddingVertical: 2,
                    }}>
                    <Text style={{textAlign: 'justify'}}>
                      NOTAKOS adalah sebuah aplikasi yang bertujuan untuk
                      membantu mahasiswa indekos dalam mengelola keuangan
                      pribadinya dengan memanfaatkan sistem alokasi uang.
                      Sehingga, mahasiswa yang menggunakan aplikasi NOTAKOS
                      terbantu dalam proses pengelolaan keuangan.
                    </Text>
                  </View>
                </Card>

                <Card>
                  <View style={[styles.box, {flexDirection: 'row'}]}>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        marginHorizontal: 6,
                        paddingHorizontal: 6,
                      }}>
                      <Text style={{fontWeight: 'bold'}}>
                        Apa saja fitur NOTAKOS?
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      justifyContent: 'center',
                      marginHorizontal: 12,
                      paddingHorizontal: 6,
                      marginVertical: 2,
                      paddingVertical: 2,
                    }}>
                    <Text style={{textAlign: 'justify'}}>
                      NOTAKOS memberikan beberapa fitur yang dapat membantu
                      penggunanya untuk mengelola uang pribadinya, diantaranya
                      yaitu: fitur pencatatan, fitur alokasi uang, fitur
                      literatur, dan fitur profil.
                    </Text>
                  </View>
                </Card>
              </Card>
            )}
          </View>
        )}

        <View
          style={{
            alignItems: 'center',
            paddingTop: 10,
            paddingHorizontal: 20,
            backgroundColor: '#f2f2f2',
            height: 200,
          }}>
          <Text style={{fontWeight: 'bold', color: '#0284C7', marginTop: 40}}>
            &copy; 2024 NOTAKOS
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
    flexDirection: 'row',
  },
  textPath: {fontSize: 18, fontWeight: 'bold', padding: 30, flex: 1},
  container: {margin: 5},
  box: {
    marginVertical: 2,
    padding: 5,
  },
});

export default Profil;
