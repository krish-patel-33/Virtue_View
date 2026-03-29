import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Pin from "../pin/Pin";

function Map({ items }) {
  let center = [20.5937, 78.9629]; // Default to India center
  let zoomLevel = 5;

  if (items.length > 0) {
    const validItems = items.filter(
      (item) => !isNaN(parseFloat(item.latitude)) && !isNaN(parseFloat(item.longitude))
    );

    if (validItems.length === 1) {
      // Single property - zoom in closely to show exact location
      center = [parseFloat(validItems[0].latitude), parseFloat(validItems[0].longitude)];
      zoomLevel = 16;
    } else if (validItems.length > 1) {
      // Multiple properties - center on average and show all
      const totalLat = validItems.reduce((sum, item) => sum + parseFloat(item.latitude), 0);
      const totalLng = validItems.reduce((sum, item) => sum + parseFloat(item.longitude), 0);
      center = [totalLat / validItems.length, totalLng / validItems.length];
      zoomLevel = 12;
    }
  }

  return (
    <MapContainer
      center={center}
      zoom={zoomLevel}
      scrollWheelZoom={true}
      className="w-full h-full rounded-[20px]"
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
