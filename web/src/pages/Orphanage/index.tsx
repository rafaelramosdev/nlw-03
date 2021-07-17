import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import { MapContainer, Marker, TileLayer } from "react-leaflet";

import Leaflet from 'leaflet';

import { FiClock, FiInfo } from "react-icons/fi";

import api from "../../services/api";

import { Sidebar } from '../../components/Sidebar';

import mapMarkerImg from '../../assets/images/map-marker.svg';

import './styles.scss';

const happyMapIcon = Leaflet.icon({
  iconUrl: mapMarkerImg,
  iconSize: [58, 68],
  iconAnchor: [29, 68],
  popupAnchor: [0, -60]
})

type Image = {
  id: number;
  url: string;
}

type OrphanageProps = {
  latitude: number;
  longitude: number;
  name: string;
  about: string;
  instructions: string;
  opening_hours: string;
  open_on_weekends: boolean;
  images: Image[];
}

type OrphanageParams = {
  id: string;
}

export function Orphanage() {
  const params = useParams<OrphanageParams>();

  const [ orphanage, setOrphanage ] = useState<OrphanageProps>();
  const [ activeImageIndex, setActiveImageIndex ] = useState(0);

  const { id } = params;

  useEffect(() => {
    api.get(`/orphanages/${id}`).then(response => {
      setOrphanage(response.data);
    })
  }, [id]);

  if(!orphanage)
    return <p>Carregando...</p>

  return (
    <div id="page-orphanage">

      <Sidebar />

      <main>
        <div className="orphanage-details">
          <img src={orphanage.images[activeImageIndex].url} alt={orphanage.name} />

          <div className="images">
            
            {orphanage.images.map((image, index) => {
              return (
                <button key={image.id} className={activeImageIndex === index ? 'active' : ''} type="button" onClick={() => setActiveImageIndex(index)}>
                  <img src={image.url} alt={orphanage.name} />
                </button>
              )
            })}
          </div>
          
          <div className="orphanage-details-content">
            <h1>{orphanage.name}</h1>
            <p>{orphanage.about}</p>

            <div className="map-container">
              <MapContainer 
                center={[orphanage.latitude,orphanage.longitude]}
                zoom={11} 
                style={{ width: '100%', height: 280 }}
                dragging={false}
                touchZoom={false}
                zoomControl={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
              >
                <TileLayer 
                  url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
                />
                <Marker interactive={false} icon={happyMapIcon} position={[orphanage.latitude,orphanage.longitude]} />
              </MapContainer>

              <footer>
                <a href={`https://www.google.com/maps/dir/?api=1&destination=${orphanage.latitude},${orphanage.longitude}`} target="_blank" rel="noopener noreferrer" >Ver rotas no Google Maps</a>
              </footer>
            </div>

            <hr />

            <h2>Instruções para visita</h2>
            <p>{orphanage.instructions}</p>

            <div className="open-details">
              <div className="hour">
                <FiClock size={32} color="#15B6D6" />
                Segunda à Sexta <br />
                {orphanage.opening_hours}
              </div>
              {orphanage.open_on_weekends ? (
                <div className="open-on-weekends">
                  <FiInfo size={32} color="#39CC83" />
                  Atendemos <br />
                  fim de semana
                </div>
              ) : (
                <div className="dont-open-on-weekends">
                  <FiInfo size={32} color="#ff669d" />
                  Não atendemos <br />
                  fim de semana
                </div>
              )}
            </div>

            {/* <button type="button" className="contact-button">
              <FaWhatsapp size={20} color="#FFF" />
              Entrar em contato
            </button> */}
          </div>
        </div>
      </main>
    </div>
  );
}