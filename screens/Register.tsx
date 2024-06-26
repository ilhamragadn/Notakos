/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Path, Svg} from 'react-native-svg';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Card} from '../components/Card';
import {useAuth} from '../context/AuthContext';

type formRegis = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: string;
};

const Register = ({navigation}: any) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  const [secureText, setSecureText] = useState(true);
  const [secureTextConfirmPassword, setSecureTextConfirmPassword] =
    useState(true);
  const toggleSecureText = () => {
    setSecureText(!secureText);
  };
  const toggleSecureTextConfirmPassword = () => {
    setSecureTextConfirmPassword(!secureTextConfirmPassword);
  };

  const [postFormRegis, setPostFormRegis] = useState<formRegis>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'user',
  });

  console.log(postFormRegis);

  const {onRegister, onLogin} = useAuth();

  const login = async () => {
    const res = await onLogin!(postFormRegis.email, postFormRegis.password);
    if (res && res.error) {
      Alert.alert(res.message);
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  const submitFormRegister = async () => {
    if (postFormRegis.password !== postFormRegis.password_confirmation) {
      Alert.alert('Error', 'Password dan Konfirmasi Password tidak sama');
      return;
    } else if (
      postFormRegis.email === '' ||
      postFormRegis.name === '' ||
      postFormRegis.password === '' ||
      postFormRegis.password_confirmation === ''
    ) {
      Alert.alert('Error', 'Kolom tidak boleh kosong');
      return;
    }

    setIsLoading(true);

    const res = await onRegister!(
      postFormRegis.name,
      postFormRegis.email,
      postFormRegis.password,
      postFormRegis.password_confirmation,
      postFormRegis.role,
    );

    setIsLoading(false);

    if (res && res.error) {
      setIsLoading(false);
      Alert.alert(res.message);
    } else {
      login();
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
      {isLoading ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0284C7',
          }}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      ) : (
        <ScrollView style={{backgroundColor: '#0284C7'}}>
          <View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: 20,
              }}>
              <Text
                style={{fontWeight: 'bold', fontSize: 21, color: '#FFFFFF'}}>
                Daftar
              </Text>
            </View>

            <View style={{top: 40}}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginVertical: 20,
                }}>
                <Image
                  source={require('../assets/logo_notakos.png')}
                  style={styles.image}
                />
              </View>
            </View>
            <View style={{marginTop: 80}}>
              <Card>
                <View style={{margin: 8}}>
                  {/* ROLE */}
                  <TextInput
                    style={{display: 'none'}}
                    value={postFormRegis.role}
                  />

                  {/* USERNAME */}
                  <View style={{marginVertical: 6}}>
                    <Text style={{marginBottom: 6, fontWeight: '500'}}>
                      Nama Pengguna
                    </Text>
                    <TextInput
                      placeholder="Masukan Nama"
                      style={{
                        backgroundColor: '#f2f2f2',
                        paddingHorizontal: 18,
                        marginHorizontal: 2,
                        borderRadius: 8,
                      }}
                      value={postFormRegis.name}
                      onChangeText={text =>
                        setPostFormRegis({...postFormRegis, name: text})
                      }
                    />
                  </View>

                  {/* EMAIL */}
                  <View style={{marginVertical: 6}}>
                    <Text style={{marginBottom: 6, fontWeight: '500'}}>
                      Email
                    </Text>
                    <TextInput
                      placeholder="Masukan Email"
                      style={{
                        backgroundColor: '#f2f2f2',
                        paddingHorizontal: 18,
                        marginHorizontal: 2,
                        borderRadius: 8,
                      }}
                      value={postFormRegis.email}
                      onChangeText={text =>
                        setPostFormRegis({...postFormRegis, email: text})
                      }
                    />
                  </View>

                  {/* PASSWORD */}
                  <View style={{marginVertical: 6}}>
                    <Text style={{marginBottom: 6, fontWeight: '500'}}>
                      Password
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        backgroundColor: '#f2f2f2',
                        borderRadius: 8,
                      }}>
                      <TextInput
                        placeholder="Masukan Password"
                        style={{
                          paddingHorizontal: 18,
                          marginHorizontal: 2,
                          flex: 1,
                        }}
                        secureTextEntry={secureText}
                        value={postFormRegis.password}
                        onChangeText={text =>
                          setPostFormRegis({...postFormRegis, password: text})
                        }
                      />
                      <TouchableOpacity
                        onPress={toggleSecureText}
                        style={{
                          justifyContent: 'center',
                          marginHorizontal: 18,
                        }}>
                        {secureText === true ? (
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
                  </View>

                  {/* CONFIRM PASSWORD */}
                  <View style={{marginVertical: 6}}>
                    <Text style={{marginBottom: 6, fontWeight: '500'}}>
                      Konfirmasi Password
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        backgroundColor: '#f2f2f2',
                        borderRadius: 8,
                      }}>
                      <TextInput
                        placeholder="Konfirmasikan Password"
                        style={{
                          paddingHorizontal: 18,
                          marginHorizontal: 2,
                          flex: 1,
                        }}
                        secureTextEntry={secureTextConfirmPassword}
                        value={postFormRegis.password_confirmation}
                        onChangeText={text =>
                          setPostFormRegis({
                            ...postFormRegis,
                            password_confirmation: text,
                          })
                        }
                      />
                      <TouchableOpacity
                        onPress={toggleSecureTextConfirmPassword}
                        style={{
                          justifyContent: 'center',
                          marginHorizontal: 18,
                        }}>
                        {secureTextConfirmPassword === true ? (
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
                  </View>

                  <TouchableOpacity
                    style={{marginVertical: 6}}
                    onPress={submitFormRegister}
                    disabled={isLoading}>
                    <View
                      style={{
                        alignItems: 'center',
                        backgroundColor: '#0284C7',
                        borderRadius: 8,
                        padding: 12,
                        marginVertical: 10,
                        marginHorizontal: 5,
                        elevation: 4,
                        shadowColor: '#000000',
                        shadowOpacity: 0.5,
                        shadowRadius: 4,
                        shadowOffset: {
                          width: 0,
                          height: 10,
                        },
                      }}>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          color: '#FFFFFF',
                          fontSize: 16,
                        }}>
                        Masuk
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <View style={{marginBottom: 6}}>
                    <View
                      style={{flexDirection: 'row', justifyContent: 'center'}}>
                      <Text style={{}}>Sudah punya akun? {''}</Text>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('Login')}>
                        <Text style={{fontWeight: 'bold', color: '#0284C7'}}>
                          Masuk
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Card>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 150,
    height: 100,
  },
});

export default Register;
