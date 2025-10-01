import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchWithAuth } from "../utils/api";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const GarmentProductDetail = () => {
  const { garmentId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetchWithAuth(
          `https://ret.bijlicity.com/api/trace/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ search_id: garmentId }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          setProduct(data.data);
        } else {
          console.error("Failed to fetch product details");
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [garmentId]);

  useEffect(() => {
    if (product && !map) {
      // Initialize map only once
      const mapInstance = L.map("journey-map").setView([31.5204, 74.3587], 12);

      // Add OpenStreetMap tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance);

      // Define locations (using Lahore, Pakistan coordinates)
      const slaughterhouse = L.latLng(31.2831, 74.058);
      const tannery = L.latLng(32.5, 74.53);
      const garment = L.latLng(32.4793585, 74.3250695);
      const retailer = L.latLng(51.5153269, -0.2249259);

      // Create custom icons
      const createCustomIcon = (color) =>
        L.divIcon({
          className: "custom-icon",
          html: `
          <div style="
            background: ${color};
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            border: 2px solid white;
          "></div>
        `,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });

      // Add markers
      L.marker(slaughterhouse, {
        icon: createCustomIcon("#e74c3c"),
      })
        .addTo(mapInstance)
        .bindPopup("Slaughterhouse<br>Origin of the leather");

      L.marker(tannery, {
        icon: createCustomIcon("#27ae60"),
      })
        .addTo(mapInstance)
        .bindPopup("Tannery<br>Leather processing facility");

      L.marker(garment, {
        icon: createCustomIcon("#2980b9"),
      })
        .addTo(mapInstance)
        .bindPopup("Garment<br>Product production facility");

      L.marker(retailer, {
        icon: createCustomIcon("#f39c12"),
      })
        .addTo(mapInstance)
        .bindPopup("Retailer<br>Product distribution point");

      // Create a route line
      L.polyline([slaughterhouse, tannery, garment, retailer], {
        color: "#8e44ad",
        weight: 4,
        opacity: 0.9,
      }).addTo(mapInstance);

      // Fit bounds to show all markers
      mapInstance.fitBounds([slaughterhouse, tannery, garment, retailer]);

      setMap(mapInstance);
    }

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [product, map]);

  if (loading) {
    return <div className="text-center py-5">Loading product details...</div>;
  }

  if (!product) {
    return <div className="text-center py-5">Product not found</div>;
  }

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0 text-center">
            Garment Product: {product.garment_id}
          </h3>
        </div>
        <div className="card-body">
          <div className="row g-4">
            {/* Left Column: Production Details */}
            <div className="col-lg-6">
              <div>
                <h5 className="border-bottom pb-2 mb-3">Production Details</h5>
                <div className="bg-light p-3 mb-3 rounded">
                  <strong>Brand:</strong> {product.brand || "-"}
                </div>
                <div className="bg-light p-3 mb-3 rounded">
                  <strong>Product Types:</strong>{" "}
                  {product.product_types.split(",").join(", ")}
                  {product.other_product_type &&
                    ` (${product.other_product_type})`}
                </div>
                <div className="bg-light p-3 mb-3 rounded">
                  <strong>Leather Pieces:</strong> {product.num_pieces}
                </div>
              </div>

              <div className="mt-4">
                <h5 className="border-bottom pb-2 mb-3">Timestamps</h5>
                <div className="bg-light p-3 rounded">
                  <strong>Process Date:</strong>{" "}
                  {new Date(product.g_date).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Right Column: Product Image */}
            <div className="col-lg-6 d-flex flex-column align-items-center">
              <div className="bg-light p-4 rounded text-center">
                <img
                  src={`/images/${product.product_types.split(",")[0]}.jpg`}
                  alt={product.product_types.split(",")[0]}
                  className="img-fluid rounded"
                  style={{ maxHeight: "300px" }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/default.jpg";
                  }}
                />
                <p className="mt-2 fw-bold">
                  {product.product_types.split(",")[0]}
                </p>
              </div>
            </div>
          </div>

          <hr className="my-4" />

          {/* Animal Details Section */}
          <div>
            <h5 className="border-bottom pb-2 mb-3">Animal Details</h5>
            <div className="row row-cols-1 row-cols-md-2 g-4">
              {product.tags.map((tag, index) => (
                <div key={tag.new_tag} className="col">
                  <div className="card h-100">
                    <div className="card-header bg-primary text-white">
                      <div className="d-flex align-items-center">
                        <div className="bg-white rounded-circle p-2 me-2">
                          <i className="fas fa-tag text-primary"></i>
                        </div>
                        <h5 className="m-0">Leather Piece {index + 1}</h5>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6 mb-2">
                          <strong>Tag ID:</strong>
                          <div className="bg-light p-2 rounded">
                            {tag.new_tag}
                          </div>
                        </div>
                        <div className="col-md-6 mb-2">
                          <strong>Stamp Code:</strong>
                          <div className="bg-light p-2 rounded">
                            {tag.tannery_stamp_code || "N/A"}
                          </div>
                        </div>
                        <div className="col-md-6 mb-2">
                          <strong>Animal Type:</strong>
                          <div className="bg-light p-2 rounded">
                            {tag.hide_source || "-"}
                          </div>
                        </div>
                        <div className="col-md-6 mb-2">
                          <strong>Slaughter Date:</strong>
                          <div className="bg-light p-2 rounded">
                            {tag.datetime
                              ? new Date(tag.datetime).toLocaleDateString()
                              : "-"}
                          </div>
                        </div>
                        <div className="col-12 mb-2">
                          <strong>Origin:</strong>
                          <div className="bg-light p-2 rounded">
                            {tag.origin || "Lahore"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Supply Chain Map Section */}
          <div className="mt-5">
            <h5 className="border-bottom pb-2 mb-3">Supply Chain Journey</h5>
            <div
              id="journey-map"
              style={{ height: "400px", borderRadius: "8px" }}
            >
              <div
                className="bg-white p-2 rounded shadow-sm"
                style={{
                  position: "absolute",
                  top: "10px",
                  left: "10px",
                  zIndex: 1000,
                  maxWidth: "200px",
                }}
              >
                <strong>Supply Chain Route</strong>
                <div className="d-flex flex-wrap gap-2 mt-2">
                  <div className="d-flex align-items-center">
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        backgroundColor: "#e74c3c",
                        marginRight: "8px",
                        borderRadius: "4px",
                      }}
                    ></div>
                    <small>Slaughterhouse</small>
                  </div>
                  <div className="d-flex align-items-center">
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        backgroundColor: "#27ae60",
                        marginRight: "8px",
                        borderRadius: "4px",
                      }}
                    ></div>
                    <small>Tannery</small>
                  </div>
                  <div className="d-flex align-items-center">
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        backgroundColor: "#2980b9",
                        marginRight: "8px",
                        borderRadius: "4px",
                      }}
                    ></div>
                    <small>Garment</small>
                  </div>
                  <div className="d-flex align-items-center">
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        backgroundColor: "#f39c12",
                        marginRight: "8px",
                        borderRadius: "4px",
                      }}
                    ></div>
                    <small>Retailer</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tags Section */}
          <div className="mt-5">
            <h5 className="border-bottom pb-2 mb-3">Component Tags</h5>
            <div className="d-flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span key={tag.new_tag} className="badge bg-primary p-2">
                  <i className="fas fa-tag me-1"></i>
                  {tag.new_tag}
                </span>
              ))}
            </div>
          </div>

          {/* Stamp Codes Section */}
          <div className="mt-4">
            <h5 className="border-bottom pb-2 mb-3">Tannery Stamp Codes</h5>
            <div className="d-flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag.tannery_stamp_code}
                  className="badge bg-secondary p-2"
                >
                  <i className="fas fa-barcode me-1"></i>
                  {tag.tannery_stamp_code || "N/A"}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GarmentProductDetail;
