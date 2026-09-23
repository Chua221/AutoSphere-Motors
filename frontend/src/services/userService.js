import axiosClient from "../api/axiosClient";

// GET /api/users/:id
export async function getUserById(id) {
  const { data } = await axiosClient.get(`/users/${id}`);
  return data;
}

// PUT /api/users/:id — Task 1.1 Profile Management.
// Only phone/address are ever sent (and only phone/address are ever applied
// server-side) — name and email always come straight back from the API and
// stay read-only, exactly as the assignment requires.
export async function updateUser(id, { phone, address }) {
  const { data } = await axiosClient.put(`/users/${id}`, { phone, address });
  return data;
}
