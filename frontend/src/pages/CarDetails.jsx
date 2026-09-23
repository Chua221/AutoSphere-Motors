import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as carService from "../services/carService";
import * as userService from "../services/userService";
import CarThumbnail from "../components/CarThumbnail";
import { LoadingBlock, ErrorBlock } from "../components/StateBlocks";
import { formatPrice, formatMileage, formatDate } from "../utils/format";
import { useAuth } from "../context/AuthContext";

export default function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [car, setCar] = useState(null);
  const [seller, setSeller] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function load() {
    setStatus("loading");
    try {
      const carData = await carService.getCarById(id);
      setCar(carData);
      if (carData.sellerId) {
        const sellerData = await userService.getUserById(carData.sellerId);
        setSeller(sellerData);
      }
      setStatus("ready");
    } catch (err) {
      setError(err.message || "This listing could not be found.");
      setStatus("error");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleDelete() {
    setDeleting(true);
    try {
      await carService.deleteCar(id);
      navigate("/profile");
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  }

  if (status === "loading") return <div className="page container section"><LoadingBlock label="Loading listing…" /></div>;
  if (status === "error") return <div className="page container section"><ErrorBlock message={error} onRetry={load} /></div>;

  const isOwner = isAuthenticated && user.id === car.sellerId;

  return (
    <div className="page container section">
      <div className="details-layout">
        <div>
          <div className="details-media">
            <CarThumbnail seed={car.id} bodyType={car.bodyType} size="lg" imageUrl={car.image} />
          </div>

          <div className="details-title-row">
            <div>
              <h1>{car.make} {car.model}</h1>
              <p className="text-muted mt-0">{car.year} · {car.bodyType} · {car.location}</p>
            </div>
            <div className="details-price">{formatPrice(car.price)}</div>
          </div>

          <div className="spec-grid">
            <div className="spec-item">
              <div className="spec-item__label">Mileage</div>
              <div className="spec-item__value">{formatMileage(car.mileage)}</div>
            </div>
            <div className="spec-item">
              <div className="spec-item__label">Transmission</div>
              <div className="spec-item__value">{car.transmission}</div>
            </div>
            <div className="spec-item">
              <div className="spec-item__label">Fuel type</div>
              <div className="spec-item__value">{car.fuelType}</div>
            </div>
            <div className="spec-item">
              <div className="spec-item__label">Colour</div>
              <div className="spec-item__value">{car.color}</div>
            </div>
            <div className="spec-item">
              <div className="spec-item__label">Registration year</div>
              <div className="spec-item__value">{car.year}</div>
            </div>
            <div className="spec-item">
              <div className="spec-item__label">Listed on</div>
              <div className="spec-item__value">{formatDate(car.listedOn)}</div>
            </div>
          </div>

          <div className="panel">
            <h3>Description</h3>
            <p>{car.description}</p>
          </div>
        </div>

        <div>
          <div className="panel">
            <h3>Seller</h3>
            {seller && (
              <>
                <div className="seller-card">
                  <div className="seller-card__avatar">{seller.name.charAt(0).toUpperCase()}</div>
                  <div>
                    <strong>{seller.name}</strong>
                    <p className="mt-0" style={{ marginBottom: 0 }}>{seller.address}</p>
                  </div>
                </div>
                <p className="text-muted">Member since {formatDate(seller.joined)}</p>
                {!isOwner && (
                  <a className="btn btn--primary btn--block" href={`tel:${seller.phone}`}>
                    Call {seller.phone}
                  </a>
                )}
              </>
            )}
          </div>

          {isOwner && (
            <div className="panel">
              <h3>Manage this listing</h3>
              <p>You created this listing. You can update the details or remove it from the marketplace.</p>
              <div style={{ display: "flex", gap: 10 }}>
                <Link to={`/cars/${car.id}/edit`} className="btn btn--secondary" style={{ flex: 1 }}>Edit</Link>
                <button
                  className="btn btn--danger"
                  style={{ flex: 1 }}
                  onClick={() => setShowConfirm(true)}
                >
                  Delete
                </button>
              </div>

              {showConfirm && (
                <div className="form-error" style={{ marginTop: 14 }}>
                  <p style={{ color: "inherit", marginBottom: 10 }}>
                    Delete this listing permanently? This cannot be undone.
                  </p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn btn--danger btn--sm" onClick={handleDelete} disabled={deleting}>
                      {deleting ? "Deleting…" : "Yes, delete"}
                    </button>
                    <button className="btn btn--secondary btn--sm" onClick={() => setShowConfirm(false)}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
