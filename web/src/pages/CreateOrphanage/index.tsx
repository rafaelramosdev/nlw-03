import { FormEvent, ChangeEvent, useState } from 'react';

import { MapContainer, Marker, TileLayer, useMapEvent  } from 'react-leaflet';

import Leaflet from 'leaflet';

import { useHistory } from 'react-router-dom';

import { FiPlus } from "react-icons/fi";

import api from '../../services/api';

import { Sidebar } from '../../components/Sidebar';

import mapMarkerImg from '../../assets/images/map-marker.svg';

import './styles.scss';

const mapIcon = Leaflet.icon({
  iconUrl: mapMarkerImg,
  iconSize: [58, 68],
  iconAnchor: [29, 68],
  popupAnchor: [170, 2],
})

export function CreateOrphanage() {
  const history = useHistory();

  const [position, setPosition] = useState({
    latitude: 0,
    longitude: 0,
  });

  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [instructions, setInstructions] = useState('');
  const [opening_hours, setOpeningHours] = useState('');
  const [open_on_weekends, setOpenOnWeekends] = useState(true);

  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  function LocationMarker() {
    const map = useMapEvent('click', (e) => {
      map.setView(e.latlng);

      setPosition({
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
      })
    })
  
    return (
      position.latitude !== 0 ? (
        <Marker interactive={false} icon={mapIcon} position={[position.latitude,position.longitude]} />
      ) : null
    );
  }

  function handleSelectImages(event: ChangeEvent<HTMLInputElement>) {
    if(!event.target.files)
      return;

    const selectedImages = Array.from(event.target.files);

    setImages([...images, ...selectedImages]);

    const selectedImagesPreview = selectedImages.map(image => {
      return URL.createObjectURL(image);
    })

    setPreviewImages([...previewImages, ...selectedImagesPreview]);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const { latitude, longitude } = position;

    const data = new FormData();

    data.append('name', name);
    data.append('about', about);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('instructions', instructions);
    data.append('opening_hours', opening_hours);
    data.append('open_on_weekends', String(open_on_weekends));

    images.forEach(image => {
      data.append('images', image);
    })

    await api.post('/orphanages', data);

    alert('Orfanato cadastrado com sucesso!');

    history.push('/app');
  }


  return (
    <div id="page-create-orphanage">
      
      <Sidebar />

      <main>
        <form onSubmit={handleSubmit} className="create-orphanage-form">
          <fieldset>
            <legend>Dados</legend>

            <MapContainer 
              center={[-23.5494117,-46.6296634]}
              style={{ width: '100%', height: 280 }}
              zoom={11} 
              onClick
            >
              <TileLayer 
                url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
              />

              <LocationMarker />
            </MapContainer>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input id="name" value={name} onChange={event => setName(event.target.value)} />
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea id="name" maxLength={300} value={about} onChange={event => setAbout(event.target.value)} />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">
                { previewImages.map(image => {
                  return (
                    <img key={image} src={image} alt={name} />
                  )
                }) }

                <label htmlFor="image[]" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
              </div>

              <input multiple onChange={handleSelectImages} type="file" id="image[]" />
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea id="instructions" value={instructions} onChange={event => setInstructions(event.target.value)} />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de funcionamento</label>
              <input id="opening_hours" value={opening_hours} onChange={event => setOpeningHours(event.target.value)}/>
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana?</label>

              <div className="button-select">
                <button type="button" className={open_on_weekends ? 'active' : ''} onClick={() => setOpenOnWeekends(true)}>Sim</button>
                <button type="button" className={!open_on_weekends ? 'active' : ''} onClick={() => setOpenOnWeekends(false)}>Não</button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}