import { useRef } from "react";
import CarThumbnail from "./CarThumbnail";

const BODY_TYPES = ["Sedan", "Hatchback", "SUV", "Pickup", "MPV", "Coupe"];
const TRANSMISSIONS = ["Automatic", "Manual"];
const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Electric"];
const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2MB, since the photo is stored as base64 in the JSON db

export default function CarForm({ form, onChange, onSubmit, submitting, submitLabel, error }) {
  const fileInputRef = useRef(null);

  function handleChange(e) {
    const { name, value } = e.target;
    onChange({ ...form, [name]: name === "year" || name === "price" || name === "mileage" ? value : value });
  }

  function handleImageSelect(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      window.alert("Please choose an image file.");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      window.alert("Image is too large. Please choose a photo under 2MB.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onChange({ ...form, image: reader.result });
    };
    reader.readAsDataURL(file);
  }

  function handleRemoveImage() {
    onChange({ ...form, image: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <form className="form-stack" onSubmit={onSubmit}>
      {error && <div className="form-error">{error}</div>}

      <div className="field-row">
        <div className="field">
          <label htmlFor="make">Make</label>
          <input id="make" name="make" required value={form.make} onChange={handleChange} placeholder="Toyota" />
        </div>
        <div className="field">
          <label htmlFor="model">Model</label>
          <input id="model" name="model" required value={form.model} onChange={handleChange} placeholder="Vios" />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="year">Year of registration</label>
          <input id="year" name="year" type="number" required min="1990" max="2026" value={form.year} onChange={handleChange} />
        </div>
        <div className="field">
          <label htmlFor="price">Price (RM)</label>
          <input id="price" name="price" type="number" required min="0" value={form.price} onChange={handleChange} />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="mileage">Mileage (km)</label>
          <input id="mileage" name="mileage" type="number" required min="0" value={form.mileage} onChange={handleChange} />
        </div>
        <div className="field">
          <label htmlFor="color">Colour</label>
          <input id="color" name="color" required value={form.color} onChange={handleChange} placeholder="Pearl White" />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="bodyType">Body type</label>
          <select id="bodyType" name="bodyType" value={form.bodyType} onChange={handleChange}>
            {BODY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="transmission">Transmission</label>
          <select id="transmission" name="transmission" value={form.transmission} onChange={handleChange}>
            {TRANSMISSIONS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="fuelType">Fuel type</label>
          <select id="fuelType" name="fuelType" value={form.fuelType} onChange={handleChange}>
            {FUEL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="location">Location</label>
          <input id="location" name="location" required value={form.location} onChange={handleChange} placeholder="Bukit Mertajam, Penang" />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="registrationNumber">Registration number</label>
          <input id="registrationNumber" name="registrationNumber" value={form.registrationNumber || ""} onChange={handleChange} placeholder="PPV 1234" />
        </div>
      </div>

      <div className="field">
        <label htmlFor="image">Photo</label>
        <div className="car-form__image-uploader">
          <div className="car-form__image-preview">
            <CarThumbnail seed={form.make + form.model || "preview"} bodyType={form.bodyType} imageUrl={form.image} />
          </div>
          <div className="car-form__image-actions">
            <input
              ref={fileInputRef}
              id="image"
              name="imageFile"
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
            />
            <div className="form-hint">JPG or PNG, up to 2MB. Leave empty to use a placeholder image.</div>
            {form.image && (
              <button type="button" className="btn btn--secondary btn--sm" onClick={handleRemoveImage}>
                Remove photo
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="field">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          rows="4"
          required
          value={form.description}
          onChange={handleChange}
          placeholder="Service history, condition, ownership, reason for selling…"
        />
      </div>

      <button type="submit" className="btn btn--primary" disabled={submitting}>
        {submitting ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
