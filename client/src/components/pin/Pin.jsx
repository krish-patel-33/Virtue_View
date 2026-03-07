import { Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";

function Pin({ item }) {
  return (
    <Marker position={[item.latitude, item.longitude]}>
      <Popup>
        <div className="flex gap-4">
          <img src={item.images[0]} alt="" className="w-16 h-12 object-cover rounded" />
          <div className="flex flex-col justify-between">
            <Link to={`/${item.id}`} className="font-medium text-[#2c3e50] hover:text-[#B8860B] transition-colors">{item.title}</Link>
            <b className="text-[#B8860B]">₹ {item.price}</b>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default Pin;
