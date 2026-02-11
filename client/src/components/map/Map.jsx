import { MapContainer, TileLayer } from "react-leaflet";
import "./map.scss";
import "leaflet/dist/leaflet.css";
import Pin from "../pin/Pin";

function Map({ items }) {
  let center = [52.4797, -1.90269]; // Default to Birmingham

  if (items.length > 0) {
    const validItems = items.filter(
      (item) => !isNaN(parseFloat(item.latitude)) && !isNaN(parseFloat(item.longitude))
    );

    if (validItems.length > 0) {
      const totalLat = validItems.reduce((sum, item) => sum + parseFloat(item.latitude), 0);
      const totalLng = validItems.reduce((sum, item) => sum + parseFloat(item.longitude), 0);
      center = [totalLat / validItems.length, totalLng / validItems.length];
    }
  }

  return (
    <MapContainer
      center={center}
      zoom={7}
      scrollWheelZoom={false}
      className="map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {items.map((item) => (
        <Pin item={item} key={item.id} />
      ))}
    </MapContainer>
  );
}

export default Map;
