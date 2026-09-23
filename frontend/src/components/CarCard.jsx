import { Link } from "react-router-dom";
import CarThumbnail from "./CarThumbnail";
import { formatPrice, formatMileage } from "../utils/format";

export default function CarCard({ car }) {
  return (
    <Link to={`/cars/${car.id}`} className="car-card">
      <div className="car-card__media">
        <span className="car-card__badge">{car.bodyType}</span>
        <CarThumbnail seed={car.id} bodyType={car.bodyType} imageUrl={car.image} />
      </div>
      <div className="car-card__body">
        <h3 className="car-card__title">{car.make} {car.model} · {car.year}</h3>
        <div className="car-card__price">{formatPrice(car.price)}</div>
        <div className="car-card__meta">
          <span>{formatMileage(car.mileage)}</span>
          <span>{car.transmission}</span>
          <span>{car.fuelType}</span>
        </div>
        <div className="car-card__footer">
          <span>{car.location}</span>
        </div>
      </div>
    </Link>
  );
}
