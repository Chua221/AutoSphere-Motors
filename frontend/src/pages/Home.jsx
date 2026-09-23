import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as carService from "../services/carService";
import CarCard from "../components/CarCard";
import DashboardGauge from "../components/DashboardGauge";
import { LoadingBlock, ErrorBlock } from "../components/StateBlocks";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  async function loadFeatured() {
    setStatus("loading");
    try {
      const cars = await carService.getCars({ sort: "listedOn", order: "desc" });
      setFeatured(cars.slice(0, 4));
      setStatus("ready");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  useEffect(() => {
    loadFeatured();
  }, []);

  return (
    <div className="page" id="top">
      <section className="hero">
        <div className="hero__inner">
          <div>
            <div className="hero__eyebrow">AutoSphere Motors · Used Car Marketplace</div>
            <h1>Find your next car without the guesswork.</h1>
            <p>
              Search verified listings by make, model, year and budget, then deal directly
              with the seller — no showroom pressure, no hidden mark-ups.
            </p>
            <div className="hero__actions">
              <Link to="/cars" className="btn btn--primary">Browse listings</Link>
              <Link to="/cars/new" className="btn btn--secondary" style={{ borderColor: "rgba(255,255,255,0.4)", color: "#fff" }}>
                List your car
              </Link>
            </div>

            <div className="hero__stats">
              <div>
                <div className="hero__stat-num">2,300+</div>
                <div className="hero__stat-label">buyers matched</div>
              </div>
              <div>
                <div className="hero__stat-num">4.7 / 5</div>
                <div className="hero__stat-label">seller rating</div>
              </div>
              <div>
                <div className="hero__stat-num">14</div>
                <div className="hero__stat-label">states covered</div>
              </div>
            </div>
          </div>
          <div className="hero__gauge">
            <DashboardGauge />
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section__head">
          <div>
            <h2>Newly listed</h2>
            <p>The latest cars added to the marketplace.</p>
          </div>
          <Link to="/cars" className="btn btn--secondary">View all cars</Link>
        </div>

        {status === "loading" && <LoadingBlock label="Fetching the newest listings…" />}
        {status === "error" && <ErrorBlock message={error} onRetry={loadFeatured} />}
        {status === "ready" && (
          <div className="car-grid">
            {featured.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </section>

      <section className="section--tight container">
        <div className="grid-2">
          <div className="panel">
            <h3>Buying with AutoSphere</h3>
            <p>
              Filter by make, model, registration year and price range to shortlist cars
              that fit your budget, then message the seller directly from the listing page.
            </p>
          </div>
          <div className="panel">
            <h3>Selling with AutoSphere</h3>
            <p>
              Create an account, add your car's details in minutes, and manage or update
              your listing any time from your profile.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
