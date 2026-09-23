import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CarForm from "../components/CarForm";
import * as carService from "../services/carService";
import { useAuth } from "../context/AuthContext";

const emptyForm = {
  make: "", model: "", year: 2022, price: "", mileage: "",
  color: "", bodyType: "Sedan", transmission: "Automatic",
  fuelType: "Petrol", location: "", registrationNumber: "", description: "", image: "",
};

export default function AddCarListing() {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const car = await carService.createCar({
        ...form,
        year: Number(form.year),
        price: Number(form.price),
        mileage: Number(form.mileage),
        sellerId: user.id,
      });
      navigate(`/cars/${car.id}`);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="page container section" style={{ maxWidth: 720 }}>
      <div className="section__head">
        <div>
          <h2>List your car</h2>
          <p>Fill in the details below — accurate listings sell faster.</p>
        </div>
      </div>
      <div className="panel">
        <CarForm
          form={form}
          onChange={setForm}
          onSubmit={handleSubmit}
          submitting={submitting}
          submitLabel="Publish listing"
          error={error}
        />
      </div>
    </div>
  );
}
