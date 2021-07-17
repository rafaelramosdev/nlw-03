import React, { useState } from 'react';

import { View, Text } from 'react-native';

import { RectButton } from 'react-native-gesture-handler';

import { Feather } from '@expo/vector-icons';

import { useNavigation, useFocusEffect } from '@react-navigation/native';

import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';

import api from '../../services/api';

import styles from './styles';

import mapMarkerImg from '../../images/map-marker.png';

type OrphanageProps = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export function OrphanagesMap() {
  const navigation = useNavigation();

  const [orphanages, setOrphanages] = useState<OrphanageProps[]>([])

  function handleNavigateToCreateOrphanage() {
    navigation.navigate('SelectMapPosition');
  }

  function handleNavigateToOrphanageDetails(id: number) {
    navigation.navigate('OrphanageDetails', { id });
  }

  useFocusEffect(() => {
    api.get('orphanages').then(response => {
      setOrphanages(response.data);
    });
  });

  return (
    <View style={styles.container}>
      <MapView 
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: -23.5494117,
          longitude: -46.6296634,
          latitudeDelta: 0.11,
          longitudeDelta: 0.11,
        }} 
        style={styles.mapStyle}
      >
        { orphanages.map(orphanage => {
            return (
              <Marker 
                key={orphanage.id}
                icon={mapMarkerImg}
                calloutAnchor={{ x: 2.7, y: 0.8 }}
                coordinate={{ 
                  latitude: orphanage.latitude,
                  longitude: orphanage.longitude
                }}
              >
                <Callout tooltip onPress={() => handleNavigateToOrphanageDetails(orphanage.id)}>
                  <View style={styles.calloutContainer}>
                    <Text style={styles.calloutText}>{orphanage.name}</Text>
                  </View>
                </Callout>
              </Marker>
            )
        }) }
      </MapView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>{orphanages.length} orfanatos encontrados</Text>
        <RectButton style={styles.createOrphanage} onPress={handleNavigateToCreateOrphanage}>
          <Feather name="plus" size={20} color="#FFF" />
        </RectButton>
      </View>
    </View>
  );
}

