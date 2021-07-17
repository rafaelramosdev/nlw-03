import React, { useState } from 'react';

import { View, Text } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { RectButton } from 'react-native-gesture-handler';

import MapView, { MapEvent, Marker } from 'react-native-maps';

import mapMarkerImg from '../../../images/map-marker.png';

import styles from './styles';

export function SelectMapPosition() {
  const navigation = useNavigation();

  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });

  function handleSelectMapPosition(event: MapEvent) {
    setPosition(event.nativeEvent.coordinate);
  }

  function handleNextStep() {
    navigation.navigate('OrphanageData', { position });
  }

  return (
    <View style={styles.container}>
      <MapView 
        initialRegion={{
          latitude: -23.5494117,
          longitude: -46.6296634,
          latitudeDelta: 0.11,
          longitudeDelta: 0.11,
        }}
        onPress={handleSelectMapPosition}
        style={styles.mapStyle}
      >
        { !!position.latitude && (
          <Marker 
            icon={mapMarkerImg}
            coordinate={position}
          />
        )}
      </MapView>

      { !!position.latitude && (
        <RectButton style={styles.nextButton} onPress={handleNextStep}>
          <Text style={styles.nextButtonText}>Próximo</Text>
        </RectButton>
      )}
    </View>
  )
}