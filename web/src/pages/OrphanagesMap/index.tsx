import { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import Leaflet from 'leaflet';

import { FiPlus, FiArrowRight } from 'react-icons/fi';

import api from '../../services/api';

import mapMarkerImg from '../../assets/images/map-marker.svg';

import './styles.scss';

const mapIcon = Leaflet.icon({
  iconUrl: mapMarkerImg,
  iconSize: [58, 68],
  iconAnchor: [29, 68],
  popupAnchor: [170, 2],
})

type Orphanage = {
  id: number;
  latitude: number;
  longitude: number;
  name: string;
}

export function OrphanagesMap() {
  const [ orphanages, setOrphanages ] = useState<Orphanage[]>([]);
  
  useEffect(() => {
    api.get('/orphanages').then(response => {
      setOrphanages(response.data);
    })
  }, []);

  return (
    <div id="page-map">
      <aside>
        <header>
          <img src={mapMarkerImg} alt="Happy" />

          <h2>Escolha um orfanato no mapa</h2>

          <p>Muitas crianças estão esperando a sua visita :)</p>
        </header>

        <footer>
          <strong>São Paulo</strong>

          <span>São Paulo</span>
        </footer>
      </aside>

      <MapContainer 
        center={[-23.5494117,-46.6296634]}
        zoom={11}
        style={{ width: '100%', height: '100%' }}
      >
        {/* <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" /> */}
        <TileLayer url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`} />

        {orphanages.map(orphanage => {
          return (
            <Marker 
              key={orphanage.id}
              icon={mapIcon}
              position={[orphanage.latitude,orphanage.longitude]}
            >
              <Popup closeButton={false} minWidth={240} maxWidth={240} className="map-popup">
                {orphanage.name}

                <Link to={`/orphanages/${orphanage.id}`}>
                  <FiArrowRight size={20} color="#ffffff" />
                </Link>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      <Link to="/orphanages/create" className="create-orphanage">
        <FiPlus size={32} color="#ffffff" />
      </Link>
    </div>
  );
}