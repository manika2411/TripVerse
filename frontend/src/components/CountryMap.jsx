import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from 'react-leaflet'

import 'leaflet/dist/leaflet.css'

function CountryMap({
  lat,
  lng,
  name,
}) {
  return (
    <div className="rounded-3xl overflow-hidden">
      <MapContainer
        center={[lat, lng]}
        zoom={5}
        scrollWheelZoom={true}
        className="h-[450px] w-full"
      >
        <TileLayer
          attribution="OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[lat, lng]}>
          <Popup>{name}</Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}

export default CountryMap