/* eslint-disable react-native/no-inline-styles */
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export type ListItems = {
  kategori: string;
  deskripsi: string;
};

const List = ({navigation}: any) => {
  const [data, setData] = useState<ListItems>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const urlBase = 'http://192.168.43.129:8000/api/';
        const urlKey = 'catatan/';
        const res = await axios.get(urlBase + urlKey);
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

  // console.log(data);

  const formatDateTime = (dateTimeString: string) => {
    const dateObject = new Date(dateTimeString);
    const day = dateObject.getDate().toString().padStart(2, '0');
    const monthIndex = dateObject.getMonth();
    const year = dateObject.getFullYear();
    const hours = dateObject.getHours().toString().padStart(2, '0');
    const minutes = dateObject.getMinutes().toString().padStart(2, '0');

    // Nama bulan dalam bahasa Inggris
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

    return `${day} ${month} ${year} • ${hours}:${minutes}`;
  };

  return (
    <View>
      {Array.isArray(data) && data.length > 0 ? (
        data.map(item => (
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
              {/* <View style={[styles.listItem, {alignItems: 'center'}]}>
                {item.kategori === 'Catatan Pemasukan' ? (
                  <View
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: 20,
                      padding: 5,
                    }}>
                    <Svg
                      viewBox="0 0 24 24"
                      width={30}
                      height={30}
                      fill="#198754">
                      <Path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M15.22 6.268a.75.75 0 0 1 .968-.431l5.942 2.28a.75.75 0 0 1 .431.97l-2.28 5.94a.75.75 0 1 1-1.4-.537l1.63-4.251-1.086.484a11.2 11.2 0 0 0-5.45 5.173.75.75 0 0 1-1.199.19L9 12.312l-6.22 6.22a.75.75 0 0 1-1.06-1.061l6.75-6.75a.75.75 0 0 1 1.06 0l3.606 3.606a12.695 12.695 0 0 1 5.68-4.974l1.086-.483-4.251-1.632a.75.75 0 0 1-.432-.97Z"
                      />
                    </Svg>
                  </View>
                ) : (
                  <View
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: 20,
                      padding: 5,
                    }}>
                    <Svg
                      viewBox="0 0 24 24"
                      width={30}
                      height={30}
                      fill="#DC3545">
                      <Path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M1.72 5.47a.75.75 0 0 1 1.06 0L9 11.69l3.756-3.756a.75.75 0 0 1 .985-.066 12.698 12.698 0 0 1 4.575 6.832l.308 1.149 2.277-3.943a.75.75 0 1 1 1.299.75l-3.182 5.51a.75.75 0 0 1-1.025.275l-5.511-3.181a.75.75 0 0 1 .75-1.3l3.943 2.277-.308-1.149a11.194 11.194 0 0 0-3.528-5.617l-3.809 3.81a.75.75 0 0 1-1.06 0L1.72 6.53a.75.75 0 0 1 0-1.061Z"
                      />
                    </Svg>
                  </View>
                )}
              </View> */}
              <View style={[styles.listContent, {marginLeft: 24}]}>
                <Text
                  style={[
                    styles.nominal,
                    item.kategori === 'Catatan Pemasukan'
                      ? {color: '#198754'}
                      : {color: '#DC3545'},
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
              <View style={[styles.listItem, {width: 110}]}>
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
          <ActivityIndicator size="large" color="#845FAC" />
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
