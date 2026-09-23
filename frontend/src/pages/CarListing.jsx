import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import * as carService from "../services/carService";
import CarCard from "../components/CarCard";
import SearchFilterBar from "../components/SearchFilterBar";
import { LoadingBlock, ErrorBlock, EmptyBlock } from "../components/StateBlocks";

const emptyFilters = { make: "", model: "", year: "", minPrice: "", maxPrice: "", registrationNumber: "" };

export default function CarListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    make: searchParams.get("make") || "",
    model: searchParams.get("model") || "",
    year: searchParams.get("year") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    registrationNumber: searchParams.get("registrationNumber") || "",
  });
  const [cars, setCars] = useState([]);
  const [makes, setMakes] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  const runSearch = useCallback(async (activeFilters) => {
    setStatus("loading");
    try {
      const results = await carService.getCars(activeFilters);
      setCars(results);
      setStatus("ready");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    carService.getDistinctMakes().then(setMakes).catch(() => setMakes([]));
  }, []);

  useEffect(() => {
    const fromUrl = {
      make: searchParams.get("make") || "",
      model: searchParams.get("model") || "",
      year: searchParams.get("year") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      registrationNumber: searchParams.get("registrationNumber") || "",
    };
    setFilters(fromUrl);
    runSearch(fromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  function handleSubmit() {
    const params = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params[key] = value;
    });
    setSearchParams(params);
  }

  function handleReset() {
    setFilters(emptyFilters);
    setSearchParams({});
  }

  return (
    <div className="page container section">
      <div className="section__head">
        <div>
          <h2>Browse cars</h2>
          <p>Filter by make, model, year of registration, registration number and price range.</p>
        </div>
      </div>

      <SearchFilterBar
        filters={filters}
        makes={makes}
        onChange={setFilters}
        onSubmit={handleSubmit}
        onReset={handleReset}
      />

      {status === "loading" && <LoadingBlock label="Searching listings…" />}
      {status === "error" && <ErrorBlock message={error} onRetry={() => runSearch(filters)} />}
      {status === "ready" && cars.length === 0 && (
        <EmptyBlock
          title="No cars match your search"
          description="Try widening your price range or clearing a filter."
        />
      )}
      {status === "ready" && cars.length > 0 && (
        <>
          <p className="text-muted" style={{ marginBottom: 16 }}>{cars.length} car{cars.length !== 1 ? "s" : ""} found</p>
          <div className="car-grid">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
