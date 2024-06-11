/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {Path, Svg} from 'react-native-svg';

const formatDate = (date: any) => {
  const months = [
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
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

const FilterDate = ({onDateSelect}: any) => {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <View style={{marginVertical: 6}}>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        style={{
          borderWidth: 1,
          marginHorizontal: 4,
          padding: 6,
          borderRadius: 4,
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
          }}>
          <Text>
            {selectedDate ? formatDate(selectedDate) : 'Pilih tanggal'}
          </Text>
        </View>
        <View
          style={{
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}>
          <Svg viewBox="0 0 320 512" width={14} height={14} fill="#000000">
            <Path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" />
          </Svg>
        </View>
      </TouchableOpacity>

      <DatePicker
        modal
        open={open}
        date={date}
        mode="date"
        onConfirm={dates => {
          setOpen(false);
          setDate(dates);
          setSelectedDate(dates);
          onDateSelect(dates);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </View>
  );
};

export default FilterDate;
