import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { localized } from '../../utils/helpers';
import { useTranslation } from 'react-i18next';

// Custom red SVG pin
const makeIcon = (active) =>
  L.divIcon({
    className: 'chimboy-pin',
    html: `<div style="transform: translate(-50%, -100%); ${active ? 'animation: bounce 0.6s ease;' : ''}">
      <svg width="${active ? 40 : 32}" height="${active ? 40 : 32}" viewBox="0 0 24 24" fill="#D32F2F" stroke="#fff" stroke-width="1.5">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        <circle cx="12" cy="9" r="2.5" fill="#fff"/>
      </svg></div>`,
    iconSize: [32, 32],
    iconAnchor: [0, 0],
  });

function MapController({ selected }) {
  const map = useMap();
  useEffect(() => {
    if (selected) {
      map.flyTo([selected.lat, selected.lng], 13, { duration: 1 });
    }
  }, [selected, map]);
  return null;
}

MapController.propTypes = { selected: PropTypes.object };

export default function StoresMap({ stores, selected, onSelect }) {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith('ru') ? 'ru' : 'uz';

  const center = stores.length ? [stores[0].lat, stores[0].lng] : [41.3111, 69.2797];

  return (
    <MapContainer center={center} zoom={6} className="h-full w-full rounded-xl" scrollWheelZoom>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapController selected={selected} />
      {stores.map((store) => (
        <Marker
          key={store.id}
          position={[store.lat, store.lng]}
          icon={makeIcon(selected?.id === store.id)}
          eventHandlers={{ click: () => onSelect?.(store) }}
        >
          <Popup>
            <div className="text-sm">
              <strong>{localized(store, 'name', lang)}</strong>
              <br />
              {localized(store, 'address', lang)}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

StoresMap.propTypes = {
  stores: PropTypes.array.isRequired,
  selected: PropTypes.object,
  onSelect: PropTypes.func,
};
