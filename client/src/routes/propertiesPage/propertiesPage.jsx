import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";

function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("all");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await apiRequest.get("/posts");
        setProperties(res.data?.posts || []);
        setPagination(res.data?.pagination || null);
      } catch (err) {
        console.error("Error fetching properties:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const filteredProperties =
    selectedType === "all"
      ? properties
      : properties.filter((property) => property.type === selectedType);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {loading ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-[#fece51] rounded-full [animation:spin_1s_linear_infinite]"></div>
            <p className="text-gray-500">Loading amazing properties...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-semibold text-[#333]">Properties</h1>
                <p className="text-gray-500">
                  {pagination?.total ?? properties.length} properties available
                </p>
              </div>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm outline-none focus:border-[#fece51]"
              >
                <option value="all">All listings</option>
                <option value="buy">For sale</option>
                <option value="rent">For rent</option>
              </select>
            </div>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
              {filteredProperties.length > 0 ? (
                filteredProperties.map((property) => (
                  <Link
                    to={`/${property.id}`}
                    key={property.id}
                    className="block overflow-hidden rounded-xl bg-white text-inherit no-underline shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative h-[220px] overflow-hidden">
                      {property.images && property.images.length > 0 ? (
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center bg-gray-100 text-gray-400">
                          <i className="fas fa-image mb-2 text-3xl"></i>
                          <span className="text-sm">No image available</span>
                        </div>
                      )}

                      <div className="absolute right-3 top-3 rounded-full bg-[#fece51] px-3 py-1 text-sm font-semibold text-white">
                        Rs. {property.price.toLocaleString()}
                      </div>

                      {property.images && property.images.length > 1 && (
                        <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs text-white">
                          <i className="fas fa-images"></i>
                          <span>+{property.images.length - 1}</span>
                        </div>
                      )}

                      <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs text-white">
                        <i
                          className={`fas fa-${
                            property.property === "house"
                              ? "house-user"
                              : property.property === "apartment"
                                ? "building"
                                : property.property === "condo"
                                  ? "hotel"
                                  : "home"
                          }`}
                        ></i>
                        <span>
                          {property.property
                            ? property.property.charAt(0).toUpperCase() + property.property.slice(1)
                            : "Property"}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <h2 className="mb-1 text-lg font-semibold text-[#333]">{property.title}</h2>
                      <p className="mb-3 flex items-center gap-1 text-sm text-gray-500">
                        <i className="fas fa-map-marker-alt"></i>
                        <span>{property.city}</span>
                      </p>

                      <div className="flex gap-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                          <i className="fas fa-bed"></i>
                          <span>{property.bedroom} beds</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                          <i className="fas fa-bath"></i>
                          <span>{property.bathroom} baths</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                          <i className="fas fa-ruler-combined"></i>
                          <span>{property.postDetail?.size || "N/A"} sqft</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400">
                  <i className="fas fa-search mb-4 text-5xl"></i>
                  <h3 className="mb-2 text-xl font-semibold">No properties found</h3>
                  <p className="text-sm">We couldn&apos;t find any properties matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PropertiesPage;
