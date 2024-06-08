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

type formLogin = {
  email: string;
  password: string;
};

const Login = ({navigation}: any) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  const [secureText, setSecureText] = useState(true);
  const toggleSecureText = () => {
    setSecureText(!secureText);
  };

  const [postFormLogin, setPostFormLogin] = useState<formLogin>({
    email: '',
    password: '',
  });

  console.log(postFormLogin);

  const {onLogin} = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  const submitFormLogin = async () => {
    if (postFormLogin.email === '' || postFormLogin.password === '') {
      Alert.alert('Error', 'Kolom tidak boleh kosong');
      return;
    }

    setIsLoading(true);
    const res = await onLogin!(postFormLogin.email, postFormLogin.password);
    setIsLoading(false);
    if (res && res.error) {
      setIsLoading(false);
      Alert.alert(res.message);
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
                Masuk
              </Text>
            </View>

            <View style={{top: 100}}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginVertical: 20,
                }}>
                <Image
                  source={require('../assets/logo_notakos.webp')}
                  style={styles.image}
                />
              </View>
            </View>
            <View style={{marginTop: 250}}>
              <Card>
                <View style={{margin: 8}}>
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
                      value={postFormLogin.email}
                      onChangeText={text =>
                        setPostFormLogin({...postFormLogin, email: text})
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
                        value={postFormLogin.password}
                        onChangeText={text =>
                          setPostFormLogin({...postFormLogin, password: text})
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

                  <TouchableOpacity
                    style={{marginVertical: 6}}
                    onPress={submitFormLogin}
                    disabled={isLoading}>
                    <View
                      style={{
                        alignItems: 'center',
                        backgroundColor: '#0284C7',
                        borderRadius: 8,
                        padding: 12,
                        marginVertical: 10,
                        marginHorizontal: 5,
                        elevation: 3,
                        shadowColor: '#000000',
                        shadowOpacity: 0.5,
                        shadowRadius: 4,
                        shadowOffset: {
                          width: 0,
                          height: 2,
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
                      <Text style={{}}>Belum punya akun? {''}</Text>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('Register')}>
                        <Text style={{fontWeight: 'bold', color: '#0284C7'}}>
                          Daftar
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

export default Login;
