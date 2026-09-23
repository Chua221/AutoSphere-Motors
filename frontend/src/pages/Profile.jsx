import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import * as carService from "../services/carService";
import * as userService from "../services/userService";
import CarThumbnail from "../components/CarThumbnail";
import { LoadingBlock, EmptyBlock } from "../components/StateBlocks";
import { formatPrice } from "../utils/format";

export default function Profile() {
  const { user, updateSessionUser } = useAuth();
  const [listings, setListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Task 1.1 Profile Management: only phone/address are editable here.
  // Name and email are fetched from the API and shown read-only below.
  const [profileForm, setProfileForm] = useState({
    phone: user.phone, address: user.address,
  });
  const [profileStatus, setProfileStatus] = useState("idle");
  const [profileError, setProfileError] = useState("");

  async function loadListings() {
    setLoadingListings(true);
    const cars = await carService.getCars({ sellerId: user.id });
    setListings(cars);
    setLoadingListings(false);
  }

  useEffect(() => {
    loadListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleProfileSubmit(e) {
    e.preventDefault();
    setProfileStatus("saving");
    setProfileError("");
    try {
      const updated = await userService.updateUser(user.id, profileForm);
      updateSessionUser(updated);
      setProfileStatus("saved");
      setTimeout(() => setProfileStatus("idle"), 2000);
    } catch (err) {
      setProfileError(err.message);
      setProfileStatus("idle");
    }
  }

  async function handleDeleteListing(id) {
    setDeletingId(id);
    try {
      await carService.deleteCar(id);
      setListings((prev) => prev.filter((c) => c.id !== id));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="page container section">
      <div className="profile-header">
        <div className="profile-avatar">{user.name.charAt(0).toUpperCase()}</div>
        <div>
          <h2 className="mt-0">{user.name}</h2>
          <p className="mt-0" style={{ marginBottom: 0 }}>{user.email}</p>
        </div>
      </div>

      <div className="details-layout">
        <div>
          <div className="panel">
            <div className="panel__head">
              <h3>My listings<span className="badge-count">{listings.length}</span></h3>
              <Link to="/cars/new" className="btn btn--primary btn--sm">+ Add listing</Link>
            </div>

            {loadingListings && <LoadingBlock label="Loading your listings…" />}

            {!loadingListings && listings.length === 0 && (
              <EmptyBlock
                title="You haven't listed any cars yet"
                description="List your first car to start reaching buyers on AutoSphere."
              />
            )}

            {!loadingListings && listings.map((car) => (
              <div className="listing-row" key={car.id}>
                <div className="listing-row__thumb">
                  <CarThumbnail seed={car.id} bodyType={car.bodyType} size="sm" imageUrl={car.image} />
                </div>
                <div className="listing-row__info">
                  <h4>{car.make} {car.model} · {car.year}</h4>
                  <p className="mt-0" style={{ marginBottom: 0 }}>{formatPrice(car.price)}</p>
                </div>
                <div className="listing-row__actions">
                  <Link to={`/cars/${car.id}`} className="btn btn--secondary btn--sm">View</Link>
                  <Link to={`/cars/${car.id}/edit`} className="btn btn--secondary btn--sm">Edit</Link>
                  <button
                    className="btn btn--danger btn--sm"
                    onClick={() => handleDeleteListing(car.id)}
                    disabled={deletingId === car.id}
                  >
                    {deletingId === car.id ? "Removing…" : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="panel">
            <h3>Account details</h3>
            {profileStatus === "saved" && <div className="form-success" style={{ marginBottom: 14 }}>Profile updated.</div>}
            {profileError && <div className="form-error" style={{ marginBottom: 14 }}>{profileError}</div>}

            <form className="form-stack" onSubmit={handleProfileSubmit}>
              <div className="field">
                <label>Full name</label>
                <input value={user.name} disabled readOnly title="Fetched from your account and cannot be changed here." />
              </div>
              <div className="field">
                <label>Email address</label>
                <input value={user.email} disabled readOnly title="Fetched from your account and cannot be changed here." />
              </div>
              <div className="field">
                <label htmlFor="phone">Phone number</label>
                <input id="phone" name="phone" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} />
              </div>
              <div className="field">
                <label htmlFor="address">Address</label>
                <input id="address" name="address" value={profileForm.address} onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })} />
              </div>
              <button type="submit" className="btn btn--dark" disabled={profileStatus === "saving"}>
                {profileStatus === "saving" ? "Saving…" : "Save changes"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
