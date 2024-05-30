/* eslint-disable react-native/no-inline-styles */
// import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Path, Svg} from 'react-native-svg';
import apiClient from '../api/apiClient';
import {Card} from './Card';

export type ListItems = {
  kategori: string;
  deskripsi: string;
};

const List = ({navigation}: any) => {
  const [data, setData] = useState<ListItems>();

  // const urlBase = 'http://192.168.1.223:8000/api/';
  const urlKey = 'catatan/';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiClient.get(urlKey);
        if (res.data.success) {
          const dataCatatan = res.data.data;
          setData(dataCatatan);
          // console.log(dataCatatan);
        } else {
          console.error('Failed to fetch data: ', res.data.message);
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await apiClient.get(urlKey);
      if (res.data.success) {
        const dataCatatan = res.data.data;
        setData(dataCatatan);
        // console.log(dataCatatan);
      } else {
        console.error('Failed to fetch data: ', res.data.message);
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });
    return unsubscribe;
  }, [navigation]);

  const formatDateTime = (dateTimeString: string) => {
    const dateObject = new Date(dateTimeString);
    const dayIndex = dateObject.getDay();
    const dayNames = [
      'Minggu',
      'Senin',
      'Selasa',
      'Rabu',
      'Kamis',
      'Jumat',
      'Sabtu',
    ];
    const day = dayNames[dayIndex];
    const dayOfMonth = dateObject.getDate().toString().padStart(2, '0');
    const monthIndex = dateObject.getMonth();
    const year = dateObject.getFullYear();
    const hours = dateObject.getHours().toString().padStart(2, '0');
    const minutes = dateObject.getMinutes().toString().padStart(2, '0');

    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'Mei',
      'Juni',
      'Juli',
      'Ags',
      'Sep',
      'Okt',
      'Nov',
      'Des',
    ];
    const month = monthNames[monthIndex];

    return `${day}, ${dayOfMonth} ${month} ${year} • ${hours}:${minutes}`;
  };

  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [cardMonth, setCardMonth] = useState(false);
  const toggleCardMonth = () => {
    setCardMonth(!cardMonth);
  };

  const filterByMonth = (datas: any, month: number | null) => {
    if (month === null) {
      return datas;
    }
    return datas.filter((item: any) => {
      const itemMonth = new Date(item.created_at).getMonth() + 1;
      return itemMonth === month;
    });
  };

  console.log(data);

  const filteredData = data ? filterByMonth(data, selectedMonth) : [];

  const monthNames = [
    'Semua',
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mei',
    'Juni',
    'Juli',
    'Ags',
    'Sep',
    'Okt',
    'Nov',
    'Des',
  ];

  const handleMonthSelect = (month: number | null) => {
    setSelectedMonth(month);
    setCardMonth(false);
  };

  return (
    <View>
      <View style={{marginVertical: 6, alignItems: 'flex-start'}}>
        <TouchableOpacity
          onPress={toggleCardMonth}
          style={{
            width: 100,
            flexDirection: 'row',
            marginHorizontal: 24,
            paddingVertical: 12,
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
              flex: 2,
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                color: '#0284C7',
              }}>
              {selectedMonth === null ? 'Semua' : monthNames[selectedMonth]}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}>
            <Svg viewBox="0 0 320 512" width={16} height={16} fill="#0284C7">
              <Path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" />
            </Svg>
          </View>
        </TouchableOpacity>
      </View>

      {cardMonth && (
        <View style={{position: 'absolute', left: 22, top: 52, zIndex: 1}}>
          <View style={{width: 105}}>
            <Card>
              <View>
                {monthNames.map((month, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() =>
                      handleMonthSelect(index === 0 ? null : index)
                    }>
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

      {Array.isArray(filteredData) && filteredData.length > 0 ? (
        filteredData.map(item => (
          <Pressable
            key={item.id}
            style={({pressed}) => [
              {backgroundColor: pressed ? '#ffffff' : '#f2f2f2'},
            ]}
            onPress={
              item.kategori === 'Catatan Pemasukan'
                ? () =>
                    navigation.navigate('DetailNoteIncome', {itemId: item.id})
                : () =>
                    navigation.navigate('DetailNoteOutcome', {
                      itemId: item.id,
                    })
            }>
            <View style={styles.list}>
              <View style={[styles.listContent, {marginLeft: 24}]}>
                <Text
                  style={[
                    styles.nominal,
                    item.kategori === 'Catatan Pemasukan'
                      ? {color: '#16A34A'}
                      : {color: '#DC2626'},
                  ]}>
                  {item.kategori === 'Catatan Pemasukan' ? '+ ' : '- '}
                  {item.kategori === 'Catatan Pemasukan'
                    ? item.total_uang_masuk.toLocaleString('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })
                    : item.total_uang_keluar.toLocaleString('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                </Text>
                <Text style={{fontSize: 11}} numberOfLines={1}>
                  {item.deskripsi !== null
                    ? item.deskripsi
                    : 'Tidak ada deskripsi'}
                </Text>
              </View>
              <View style={[styles.listItem, {width: 120}]}>
                <Text style={{textAlign: 'left'}}>
                  {formatDateTime(item.created_at)}
                </Text>
              </View>
            </View>
          </Pressable>
        ))
      ) : (
        <View
          style={{
            marginVertical: 10,
            justifyContent: 'center',
          }}>
          <ActivityIndicator size="large" color="#0284C7" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
  },
  listItem: {
    padding: 5,
    marginHorizontal: 5,
  },
  listContent: {
    flex: 2,
    marginHorizontal: 2,
    padding: 5,
  },
  bgIconIncome: {backgroundColor: '#00d008', borderRadius: 20, padding: 5},
  nominal: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
});

export default List;
