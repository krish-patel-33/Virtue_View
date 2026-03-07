import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";

function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await apiRequest.get("/posts");
        console.log("Properties fetched:", res.data);
        setProperties(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching properties:", err);
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const filteredProperties = selectedType === 'all'
    ? properties
    : properties.filter(property => property.type === selectedType);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-[#fece51] rounded-full [animation:spin_1s_linear_infinite]"></div>
            <p className="text-gray-500">Loading amazing properties...</p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
            {filteredProperties.length > 0 ? (
              filteredProperties.map((property) => (
                <Link to={`/${property.id}`} key={property.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1 no-underline text-inherit block">
                  <div className="relative h-[220px] overflow-hidden">
                    {property.images && property.images.length > 0 ? (
                      <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400">
                        <i className="fas fa-image text-3xl mb-2"></i>
                        <span className="text-sm">No image available</span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-[#fece51] text-white px-3 py-1 rounded-full font-semibold text-sm">
                      ₹{property.price.toLocaleString()}
                    </div>
                    {property.images && property.images.length > 1 && (
                      <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                        <i className="fas fa-images"></i>
                        <span>+{property.images.length - 1}</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-black/60 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                      <i className={`fas fa-${
                        property.type === 'house' ? 'house-user' :
                        property.type === 'apartment' ? 'building' :
                        property.type === 'villa' ? 'hotel' : 'home'
                      }`}></i>
                      <span>{property.type.charAt(0).toUpperCase() + property.type.slice(1)}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h2 className="font-semibold text-lg text-[#333] mb-1">{property.title}</h2>
                    <p className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                      <i className="fas fa-map-marker-alt"></i>
                      <span>{property.city}</span>
                    </p>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                        <i className="fas fa-bed"></i>
                        <span>{property.bedroom} beds</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                        <i className="fas fa-bath"></i>
                        <span>{property.bathroom} baths</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                        <i className="fas fa-ruler-combined"></i>
                        <span>{property.postDetail?.size || 'N/A'} sqft</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400">
                <i className="fas fa-search text-5xl mb-4"></i>
                <h3 className="text-xl font-semibold mb-2">No properties found</h3>
                <p className="text-sm">We couldn&apos;t find any properties matching your criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PropertiesPage;