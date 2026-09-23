import axiosClient from "../api/axiosClient";

// GET /api/cars — Task 1.3 Search & Filter: Make, Model, Year, Registration
// and Price Range, plus sorting. Filtering itself happens on the Spring Boot
// side (JPA Specifications) so it stays correct as the dataset grows.
export async function getCars(filters = {}) {
  const params = {};

  if (filters.make) params.make = filters.make;
  if (filters.model) params.model = filters.model;
  if (filters.year) params.year = filters.year;
  if (filters.minPrice) params.minPrice = filters.minPrice;
  if (filters.maxPrice) params.maxPrice = filters.maxPrice;
  if (filters.registrationNumber) params.registrationNumber = filters.registrationNumber;
  if (filters.sellerId) params.sellerId = filters.sellerId;

  params.sort = filters.sort || "listedOn";
  params.order = filters.order || "desc";

  const { data } = await axiosClient.get("/cars", { params });
  return data;
}

// GET /api/cars/:id
export async function getCarById(id) {
  const { data } = await axiosClient.get(`/cars/${id}`);
  return data;
}

// POST /api/cars — create a new listing. The backend sets sellerId from the
// signed-in user's own token and listedOn to today, so the client can never
// forge either one.
export async function createCar(carData) {
  const { data } = await axiosClient.post("/cars", carData);
  return data;
}

// PUT /api/cars/:id — replace/update a listing (owner-only, enforced server-side).
export async function updateCar(id, carData) {
  const { data } = await axiosClient.put(`/cars/${id}`, carData);
  return data;
}

// PATCH /api/cars/:id — partial update (owner-only, enforced server-side).
export async function patchCar(id, partialData) {
  const { data } = await axiosClient.patch(`/cars/${id}`, partialData);
  return data;
}

// DELETE /api/cars/:id (owner-only, enforced server-side).
export async function deleteCar(id) {
  await axiosClient.delete(`/cars/${id}`);
  return true;
}

// GET /api/cars/makes — distinct makes, used to populate the search filter dropdown.
export async function getDistinctMakes() {
  const { data } = await axiosClient.get("/cars/makes");
  return data;
}
