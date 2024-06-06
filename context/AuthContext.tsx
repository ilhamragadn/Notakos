import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {Alert} from 'react-native';

interface AuthProps {
  authState?: {token: string | null; authenticated: boolean | null};
  onRegister?: (
    name: string,
    email: string,
    password: string,
    password_confirmation: string,
    role: string,
  ) => Promise<any>;
  onLogin?: (email: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
}

export const API_URL = 'https://notakos-test.my.id/api';
export const TOKEN_KEY = 'my-token';
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({children}: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
  }>({
    token: null,
    authenticated: null,
  });

  useEffect(() => {
    const loadToken = async () => {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      console.log('stored: ', token);

      if (token) {
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;

        setAuthState({
          token: token,
          authenticated: true,
        });
      }
    };

    loadToken();
  }, []);

  const register = async (
    name: string,
    email: string,
    password: string,
    password_confirmation: string,
    role: string,
  ) => {
    try {
      return await axios.post(`${API_URL}/register`, {
        name,
        email,
        password,
        password_confirmation,
        role,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error;
        Alert.alert(
          'Error',
          axiosError.response?.data?.message || axiosError.message,
        );
        console.error(
          'Axios error:',
          axiosError.response?.data || axiosError.message,
        );
      } else {
        console.error('Unknown error:', error);
      }
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      setAuthState({
        token: res.data.token,
        authenticated: true,
      });

      console.log(res.data.token);

      axios.defaults.headers.common.Authorization = `Bearer ${res.data.token}`;

      await AsyncStorage.setItem(TOKEN_KEY, res.data.token);

      return res;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error;
        Alert.alert(
          'Error',
          axiosError.response?.data?.message || axiosError.message,
        );
        console.error(
          'Axios error:',
          axiosError.response?.data || axiosError.message,
        );
        return;
      } else {
        console.error('Unknown error:', error);
      }
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);

    axios.defaults.headers.common.Authorization = '';

    setAuthState({
      token: null,
      authenticated: false,
    });
  };

  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    authState,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
