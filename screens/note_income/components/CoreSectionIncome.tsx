/* eslint-disable react-native/no-inline-styles */
import {CheckBox} from '@rneui/themed';
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {Card} from '../../../components/Card';
import LineBreak from '../../../components/LineBreak';

const CoreSectionIncome = () => {
  const formatCurrency = (value: string): string => {
    const amountValue = value.replace(/[^\d]/g, '');
    const amount = parseInt(amountValue, 10);
    if (isNaN(amount)) {
      return 'Rp ';
    }
    return amount.toLocaleString('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const [sections, setSections] = useState([{nominal: '0'}]);
  const addSection = () => {
    setSections([...sections, {nominal: '0'}]);
  };

  const removeSection = (index: number) => {
    const updatedSections = [...sections];
    updatedSections.splice(index, 1);
    setSections(updatedSections);
  };

  const handleNominalChange = (index: number, newTotal: string) => {
    const updatedSections = [...sections];
    updatedSections[index].nominal = newTotal;
    setSections(updatedSections);
  };

  const calculateTotal = () => {
    let total = 0;
    sections.forEach(section => {
      total += parseInt(section.nominal.replace(/[^\d]/g, ''), 10);
    });
    return formatCurrency(total.toString());
  };

  const [selectedCategory, setCategory] = useState(0);

  const [sourceIncome, setSourceIncome] = useState('');

  const sectionIncome = () => {
    return sections.map((section, index) => (
      <View key={index}>
        <View
          style={{
            marginRight: 6,
            marginTop: 4,
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
          }}>
          <TouchableOpacity
            onPress={() => removeSection(index)}
            style={{
              backgroundColor: '#FF0D00',
              borderRadius: 6,
              paddingHorizontal: 8,
              paddingVertical: 2,
            }}>
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
        </View>
        <View style={{flexDirection: 'row'}}>
          <Card>
            <View style={styles.box}>
              <Text style={styles.label}>Sumber Uang Masuk</Text>
              <TextInput
                value={sourceIncome}
                onChangeText={setSourceIncome}
                placeholder="Orang tua, gaji"
                style={styles.input_source}
                multiline={true}
                numberOfLines={4}
              />
            </View>
          </Card>
          <Card>
            <View style={styles.box}>
              <Text style={styles.label}>Kategori Uang Masuk</Text>
              <View style={styles.input_category}>
                <CheckBox
                  title="Cash"
                  checked={selectedCategory === 0}
                  onPress={() => setCategory(0)}
                  checkedIcon={
                    <Svg viewBox="0 0 512 512" width={20} height={20}>
                      <Path
                        fill="#0D6EFD"
                        d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256-96a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"
                      />
                    </Svg>
                  }
                  uncheckedIcon={
                    <Svg viewBox="0 0 512 512" width={20} height={20}>
                      <Path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z" />
                    </Svg>
                  }
                />
              </View>
              <View style={styles.input_category}>
                <CheckBox
                  title="Cashless"
                  checked={selectedCategory === 1}
                  onPress={() => setCategory(1)}
                  checkedIcon={
                    <Svg viewBox="0 0 512 512" width={20} height={20}>
                      <Path
                        fill="#0D6EFD"
                        d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256-96a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"
                      />
                    </Svg>
                  }
                  uncheckedIcon={
                    <Svg viewBox="0 0 512 512" width={20} height={20}>
                      <Path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z" />
                    </Svg>
                  }
                />
              </View>
            </View>
          </Card>
        </View>
        <Card>
          <View style={styles.box}>
            <Text style={styles.label}>Nominal Uang Masuk</Text>
            <View style={styles.card}>
              <TextInput
                placeholder="1.000.000"
                inputMode="numeric"
                style={{flex: 1, height: 40, marginLeft: 4}}
                onChangeText={newTotal => handleNominalChange(index, newTotal)}
                defaultValue={formatCurrency(section.nominal)}
              />
            </View>
          </View>
        </Card>
        <LineBreak />
      </View>
    ));
  };
  // return components;

  return (
    <View>
      {sectionIncome()}
      <View style={{alignItems: 'center', marginBottom: 12}}>
        <TouchableOpacity onPress={addSection} style={styles.addButton}>
          <View
            style={{
              alignItems: 'center',
            }}>
            <Svg
              width={20}
              height={20}
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="#000000">
              <Path
                d="M12 4.5v15m7.5-7.5h-15"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
        </TouchableOpacity>
      </View>
      <Card>
        <View style={[styles.box, {width: 360}]}>
          <Text style={{fontSize: 16, fontWeight: 'bold'}}>Total</Text>
          <View style={styles.card}>
            <TextInput
              style={styles.input_total}
              readOnly={true}
              inputMode="numeric"
              value={calculateTotal()}
              defaultValue={calculateTotal()}
            />
          </View>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    marginVertical: 2,
    padding: 5,
  },
  label: {
    fontWeight: '500',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 6,
    borderBottomWidth: 2,
    borderBottomColor: '#845FAC',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  input_primary: {
    height: 40,
    width: 340,
    margin: 5,
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#845FAC',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  input_source: {
    height: 80,
    width: 150,
    margin: 5,
    padding: 10,
    borderWidth: 2,
    borderColor: '#845FAC',
    borderRadius: 10,
    textAlignVertical: 'top',
  },
  input_category: {
    height: 40,
    width: 160,
  },
  input_total: {
    flex: 1,
    height: 40,
    marginRight: 8,
    color: '#000000',
    fontSize: 17,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#dddddd',
    padding: 8,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    alignItems: 'center',
    width: 50,
  },
  addButtonText: {
    color: '#000000',
    fontWeight: 'bold',
  },
});

export default CoreSectionIncome;
