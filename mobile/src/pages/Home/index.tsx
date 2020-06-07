import React, { useState, useEffect } from 'react';
import { StyleSheet, ImageBackground, View, Image, Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import PickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';
import { Feather as Icon } from '@expo/vector-icons';
import { Chevron } from 'react-native-shapes';
import axios from 'axios';

import styles from './styles'

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const Home = () => {  
  const navigation = useNavigation();
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedUf, setSelectedUf] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
 
    function handleNavigateToPoints(){

      navigation.navigate('Points', {
        uf: selectedUf,
        city: selectedCity
      });

    };

    useEffect(()=>{
      axios
        .get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
        .then(response => {
            const ufInitials = response.data.map(uf => uf.sigla)
            setUfs(ufInitials);
        })
    }, []);

  useEffect(()=>{
      axios
          .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios?orderBy=nome`)
          .then(response => {

          const city  = response.data.map(city => city.nome)

          setCities(city);
      })
  
  }, [selectedUf]);


  function handleSelectedUf(uf){
      setSelectedUf(uf);
  };

  function handleSelectedCity(city){
      setSelectedCity(city);
  };

    return (
      <ImageBackground 
            source={require('../../assets/home-background.png')}
            style={styles.container}
            imageStyle={{width: 274, height: 368}}
        >
            <View style={styles.main}>
                <Image source={require('../../assets/logo.png')}/>
                <Text style={styles.title}>Seu marketplace de coleta de resíduos.</Text>
                <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
            </View>
            <View style={styles.footer}>
              <PickerSelect
                placeholder={{label: 'Selecione um estado (UF)', value: null}}
                useNativeAndroidPickerStyle={false}
                style={pickerSelectStyles}
                Icon={() => {return <Chevron size={1.5} color="#A0A0B2" />;}}      
                onValueChange={handleSelectedUf}
                items={ufs.map(uf=>{return{label: uf, value: uf}})}
              />
              <PickerSelect key="cidade"
                placeholder={{
                  label: 'Selecione uma cidade',
                  value: null}}
                  useNativeAndroidPickerStyle={false}
                  style={pickerSelectStyles}
                  Icon={() => {return <Chevron size={1.5} color="#A0A0B2" />;}}      
                  onValueChange={handleSelectedCity}
                  items={cities.map(city=>{return{label: city, value: city}})}
              />
              <RectButton
                style={[styles.button, selectedCity !== null && selectedUf !== null? null : styles.buttonDisabled]}
                enabled={selectedCity !== null && selectedUf !== null}
                onPress={handleNavigateToPoints}>
                  <View style={styles.buttonIcon}>
                      <Icon name="arrow-right" color="#fff" size={24}/>
                  </View>
                  <Text style={styles.buttonText}>
                      Entrar
                  </Text>
              </RectButton>
            </View>
        </ImageBackground>
    )

};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    height: 60,    
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    fontFamily: 'Roboto_400Regular',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 14,
    lineHeight: 16,
    color: '#A0A0B2',
    paddingHorizontal: 24,
    marginBottom: 8,
    
  },
  iconContainer: {top: 25, right: 30},
});

export default Home;