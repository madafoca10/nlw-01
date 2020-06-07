import React, { useState, useEffect } from 'react';
import { StyleSheet, ImageBackground, View, Image, Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import PickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';
import { Feather as Icon } from '@expo/vector-icons';
import { Chevron } from 'react-native-shapes';
import axios from 'axios';
import Picker from 'react-native-picker-select';

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const Home = () => {  
    const navigation = useNavigation();
    const [ufs, setUfs] = useState<string[]>([]);
    const [city, setCity] = useState<string[]>([]);
    const [selectedUf, setSelectedUf] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
 
    function handleNavigateToPoints(){
      if (!selectedUf){
        alert ('Selecione uma UF.');
        return;
      };
      if (!selectedCity){
        alert ('Selecione uma cidade.');
        return;
      };

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
      if(selectedUf==='0'){
          return;
      }
      axios
          .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios?orderBy=nome`)
          .then(response => {
          const city  = response.data.map(city => city.nome)
          setCity(city);
      })
  
  }, [selectedUf]);

  //function handleSelectedUf(event: ChangeEvent<HTMLSelectElement>){
  //    const uf = event.target.value;
  //    setSelectedUf(uf);
  //};

  //function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>){
  //    const city = event.target.value;
  //    setSelectedCity(city);
  //};

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
                onValueChange={(value) => setSelectedUf(value)}
                items={[
                  {label: 'SP', value: 'SP'},
                ]}
              />
              <PickerSelect
                placeholder={{
                  label: 'Selecione uma cidade',
                  value: null}}
                  useNativeAndroidPickerStyle={false}
                  style={pickerSelectStyles}
                  Icon={() => {return <Chevron size={1.5} color="#A0A0B2" />;}}      
                  onValueChange={(value) => setSelectedCity(value)}
                  items={[
                    {label: 'Caçapava', value: 'Caçapava'},
                    {label: 'Jacareí', value: 'Jacareí'},
                    {label: 'São José dos Campos', value: 'São José dos Campos'}]}/>
              <RectButton style={styles.button} onPress={handleNavigateToPoints}>
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
//home-background.png
//logo.png

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

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32,
    },
  
    main: {
      flex: 1,
      justifyContent: 'center',
    },
  
    title: {
      color: '#322153',
      fontSize: 32,
      fontFamily: 'Ubuntu_700Bold',
      maxWidth: 300,
      marginTop: 64,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 16,
      fontFamily: 'Roboto_400Regular',
      maxWidth: 300,
      lineHeight: 24,
    },
  
    footer: {},
  
    button: {
      backgroundColor: '#34CB79',
      height: 60,
      flexDirection: 'row',
      borderRadius: 10,
      overflow: 'hidden',
      alignItems: 'center',
      marginTop: 8,
    },
  
    buttonIcon: {
      height: 60,
      width: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    buttonText: {
      flex: 1,
      justifyContent: 'center',
      textAlign: 'center',
      color: '#FFF',
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    }
  });

  export default Home;