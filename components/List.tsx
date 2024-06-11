/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Path, Svg} from 'react-native-svg';
import {Card} from './Card';
import FilterDate from './FilterDate';
import LineBreak from './LineBreak';

const List = ({navigation, data, loading}: any) => {
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

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [cardFilter, setCardFilter] = useState(false);
  const toggleCardFilter = () => {
    setCardFilter(!cardFilter);
  };

  const filterByDateRange = (
    datas: any,
    start: Date | null,
    end: Date | null,
  ) => {
    if (start === null || end === null) {
      return datas;
    }
    return datas.filter((item: any) => {
      const itemDate = new Date(item.created_at);
      return itemDate >= start && itemDate <= end;
    });
  };

  const filteredData = data ? filterByDateRange(data, startDate, endDate) : [];

  const handleDateSelect = (type: 'start' | 'end') => (date: Date) => {
    if (type === 'start') {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const formatDate = (date: string) => {
    const dateObject = new Date(date);
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
    const month = monthNames[monthIndex];

    return `${day}, ${dayOfMonth} ${month} ${year}`;
  };

  const getFilterText = () => {
    if (startDate && endDate) {
      return `${formatDate(startDate.toString())} - ${formatDate(
        endDate.toString(),
      )}`;
    }
    return 'Semua Catatan';
  };

  if (loading) {
    return (
      <View
        style={{
          marginTop: 35,
          marginBottom: 25,
          justifyContent: 'center',
        }}>
        <ActivityIndicator size="large" color="#0284C7" />
      </View>
    );
  }

  return (
    <View>
      <View
        style={{
          marginVertical: 6,
        }}>
        <TouchableOpacity
          onPress={toggleCardFilter}
          style={{
            flexDirection: 'row',
            marginHorizontal: 24,
            padding: 8,
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
              flex: 1,
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                textAlign: 'center',
                color: '#0284C7',
              }}>
              {getFilterText()}
            </Text>
          </View>
          <View
            style={{
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}>
            <Svg viewBox="0 0 320 512" width={16} height={16} fill="#0284C7">
              <Path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" />
            </Svg>
          </View>
        </TouchableOpacity>
      </View>

      {cardFilter && (
        <View style={{position: 'absolute', top: 50, left: 22, zIndex: 1}}>
          <View style={{width: 350}}>
            <Card>
              <View style={{alignItems: 'center'}}>
                <Text
                  style={{fontSize: 13, fontWeight: 'bold', color: '#0284C7'}}>
                  Dari
                </Text>
              </View>
              <FilterDate onDateSelect={handleDateSelect('start')} />
              <LineBreak />
              <View style={{alignItems: 'center', marginTop: 4}}>
                <Text
                  style={{fontSize: 13, fontWeight: 'bold', color: '#0284C7'}}>
                  Sampai
                </Text>
              </View>
              <FilterDate onDateSelect={handleDateSelect('end')} />

              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  onPress={() => {
                    handleReset();
                    setCardFilter(false);
                  }}
                  style={{
                    flex: 1,
                    marginTop: 10,
                    marginHorizontal: 4,
                    padding: 6,
                    backgroundColor: '#64748B',
                    borderRadius: 4,
                    alignItems: 'center',
                  }}>
                  <Text style={{color: '#FFFFFF', fontSize: 12}}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={toggleCardFilter}
                  style={{
                    flex: 1,
                    marginTop: 10,
                    marginHorizontal: 4,
                    padding: 6,
                    backgroundColor: '#16A34A',
                    borderRadius: 4,
                    alignItems: 'center',
                  }}>
                  <Text style={{color: '#FFFFFF', fontSize: 12}}>Oke</Text>
                </TouchableOpacity>
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
            marginTop: 25,
            marginBottom: 15,
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontWeight: '500',
              fontStyle: 'italic',
            }}>
            Catatanmu kosong nih.
          </Text>
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
