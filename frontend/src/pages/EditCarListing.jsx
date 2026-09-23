import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import CarForm from "../components/CarForm";
import * as carService from "../services/carService";
import { LoadingBlock, ErrorBlock } from "../components/StateBlocks";
import { useAuth } from "../context/AuthContext";

export default function EditCarListing() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [forbidden, setForbidden] = useState(false);

  async function load() {
    setStatus("loading");
    try {
      const car = await carService.getCarById(id);
      if (car.sellerId !== user.id) {
        setForbidden(true);
        return;
      }
      setForm(car);
      setStatus("ready");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (forbidden) return <Navigate to="/profile" replace />;
  if (status === "loading") return <div className="page container section"><LoadingBlock label="Loading listing…" /></div>;
  if (status === "error") return <div className="page container section"><ErrorBlock message={error} onRetry={load} /></div>;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await carService.updateCar(id, {
        ...form,
        year: Number(form.year),
        price: Number(form.price),
        mileage: Number(form.mileage),
      });
      navigate(`/cars/${id}`);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="page container section" style={{ maxWidth: 720 }}>
      <div className="section__head">
        <div>
          <h2>Edit listing</h2>
          <p>Update the details of your {form.make} {form.model}.</p>
        </div>
      </div>
      <div className="panel">
        <CarForm
          form={form}
          onChange={setForm}
          onSubmit={handleSubmit}
          submitting={submitting}
          submitLabel="Save changes"
          error={error}
        />
      </div>
    </div>
  );
}
