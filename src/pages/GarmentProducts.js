import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchWithAuth } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import Pagination from "../components/Pagination";
import { QRCodeSVG } from "qrcode.react";

const GarmentProducts = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!user) {
        console.error("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        let url = `https://ret.bijlicity.com/api/garment/products/?page=${currentPage}`;
        if (searchQuery) {
          url += `&search=${encodeURIComponent(searchQuery)}`;
        }

        const response = await fetchWithAuth(url);
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products);
          setTotalPages(data.total_pages);
          setIsAdmin(data.is_admin);
        } else {
          console.error("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, searchQuery, user]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handlePrint = async (garmentId) => {
    window.open(
      `https://ret.bijlicity.com/api/garment/print-qr/${garmentId}/`,
      "_blank"
    );
  };

  if (loading) {
    return <div className="text-center py-5">Loading products...</div>;
  }

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">
        <i className="fas fa-qrcode me-2"></i>
        QR Codes Generate
      </h2>

      <form onSubmit={handleSearch} className="mb-5">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Garment ID or Tag ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">
            <i className="fas fa-search me-2"></i>
            Search
          </button>
        </div>
      </form>

      <div className="row">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.garment_id}
              className="col-12 col-sm-6 col-lg-4 col-xl-3 mb-4"
            >
              <div className="card h-100 shadow-sm">
                {isAdmin && (
                  <div className="position-absolute top-0 end-0 m-2 bg-light text-dark p-1 rounded">
                    {product.user.username}
                  </div>
                )}
                <div className="card-body d-flex flex-column">
                  <div className="text-center mb-3">
                    <QRCodeSVG
                      value={`https://ret.bijlicity.com/api/display-data/${product.garment_id}/`}
                      size={150}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  <h5 className="card-title text-center mb-3">
                    <strong>{product.garment_id}</strong>
                  </h5>
                  <div className="mb-3">
                    <p>
                      <strong>Brand:</strong> {product.brand || "-"}
                    </p>
                    <p>
                      <strong>Pieces:</strong> {product.num_pieces}
                    </p>
                    <p>
                      <strong>Product Types:</strong>
                      <small className="d-block">
                        {product.product_types.split(",").join(", ")}
                        {product.other_product_type &&
                          ` (${product.other_product_type})`}
                      </small>
                    </p>
                    <p>
                      <strong>Component Tags:</strong>
                    </p>
                    <div className="d-flex flex-wrap gap-1">
                      {product.tags.length > 0 ? (
                        product.tags.map((tag) => (
                          <span
                            key={tag.new_tag}
                            className="badge bg-secondary"
                          >
                            <i className="fas fa-tag me-1"></i>
                            {tag.new_tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted">No tags associated</span>
                      )}
                    </div>
                  </div>
                  <div className="mt-auto d-flex gap-2">
                    <button
                      className="btn btn-sm btn-primary flex-grow-1"
                      onClick={() => handlePrint(product.garment_id)}
                    >
                      <i className="fas fa-print me-1"></i>
                      Print
                    </button>
                    <Link
                      to={`/garment-products/${product.garment_id}`}
                      className="btn btn-sm btn-outline-primary flex-grow-1"
                    >
                      <i className="fas fa-info-circle me-1"></i>
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <i className="fas fa-box-open fa-3x mb-3 text-muted"></i>
            <h3>No Products Found</h3>
            {searchQuery && <p>No results for "{searchQuery}"</p>}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default GarmentProducts;
