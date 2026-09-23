const YEARS = Array.from({ length: 12 }, (_, i) => 2026 - i);

export default function SearchFilterBar({ filters, makes, onChange, onSubmit, onReset }) {
  function handleField(e) {
    onChange({ ...filters, [e.target.name]: e.target.value });
  }

  return (
    <form
      className="filter-bar"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="field">
        <label htmlFor="make">Make</label>
        <select id="make" name="make" value={filters.make} onChange={handleField}>
          <option value="">Any make</option>
          {makes.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="model">Model</label>
        <input
          id="model"
          name="model"
          type="text"
          placeholder="e.g. Vios"
          value={filters.model}
          onChange={handleField}
        />
      </div>

      <div className="field">
        <label htmlFor="year">Year</label>
        <select id="year" name="year" value={filters.year} onChange={handleField}>
          <option value="">Any year</option>
          {YEARS.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="minPrice">Min price (RM)</label>
        <input
          id="minPrice"
          name="minPrice"
          type="number"
          min="0"
          placeholder="0"
          value={filters.minPrice}
          onChange={handleField}
        />
      </div>

      <div className="field">
        <label htmlFor="maxPrice">Max price (RM)</label>
        <input
          id="maxPrice"
          name="maxPrice"
          type="number"
          min="0"
          placeholder="No limit"
          value={filters.maxPrice}
          onChange={handleField}
        />
      </div>

      <div className="field">
        <label htmlFor="registrationNumber">Registration</label>
        <input
          id="registrationNumber"
          name="registrationNumber"
          type="text"
          placeholder="e.g. PPV 1234"
          value={filters.registrationNumber}
          onChange={handleField}
        />
      </div>

      <div className="field" style={{ flexDirection: "row", gap: 8 }}>
        <button type="submit" className="btn btn--primary">Search</button>
        <button type="button" className="btn btn--secondary" onClick={onReset}>Reset</button>
      </div>
    </form>
  );
}
