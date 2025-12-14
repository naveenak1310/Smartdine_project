import { useEffect, useState } from "react";
import "../App.css";
import "./Admin.css";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: "",
    cuisine: "",
    priceRange: "",
    location: "",
    area: "",
    latitude: "",
    longitude: "",
    description: "",
    tags: "",
    imageUrl: ""
  });

  useEffect(() => {
    fetchUsers();
    fetchRestaurants();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch("http://localhost:8080/api/admin/users");
    const data = await res.json();
    setUsers(data.filter(u => u.email !== "admin@smartdine.com"));
  };

  const fetchRestaurants = async () => {
    const res = await fetch("http://localhost:8080/api/restaurants");
    const data = await res.json();
    setRestaurants(data);
  };

  const saveRestaurant = async () => {
    const payload = {
      name: form.name,
      cuisine: form.cuisine,
      priceRange: form.priceRange,
      location: form.location,
      area: form.area,
      latitude: form.latitude || null,
      longitude: form.longitude || null,
      description: form.description,
      tags: form.tags,
      images: form.imageUrl || null
    };

    if (editing) {
      await fetch(`http://localhost:8080/api/restaurants/${editing}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } else {
      await fetch("http://localhost:8080/api/restaurants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }

    setEditing(null);
    setForm({
      name: "",
      cuisine: "",
      priceRange: "",
      location: "",
      area: "",
      latitude: "",
      longitude: "",
      description: "",
      tags: "",
      imageUrl: ""
    });

    fetchRestaurants();
  };

  const startEdit = (r) => {
    setEditing(r.id);
    setForm({
      name: r.name || "",
      cuisine: r.cuisine || "",
      priceRange: r.priceRange || "",
      location: r.location || "",
      area: r.area || "",
      latitude: r.latitude || "",
      longitude: r.longitude || "",
      description: r.description || "",
      tags: r.tags || "",
      imageUrl: r.images || ""
    });
  };

  return (
    <section className="home-page admin-page">
      <div className="home-card">
        <h2>Admin Dashboard</h2>

        <section>
          <h3>Users & History</h3>
          <table className="simple-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Bookings</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    {u.bookings?.length
                      ? u.bookings.map(b => (
                          <div key={b.id}>{b.date} {b.time}</div>
                        ))
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section style={{ marginTop: 20 }}>
          <h3>{editing ? "Edit Restaurant" : "Add Restaurant"}</h3>

          <div className="form-grid">
            <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <input placeholder="Cuisine" value={form.cuisine} onChange={e => setForm({ ...form, cuisine: e.target.value })} />
            <input placeholder="Price Range (cheap / medium / expensive)" value={form.priceRange} onChange={e => setForm({ ...form, priceRange: e.target.value })} />
            <input placeholder="City" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
            <input placeholder="Area" value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} />
            <input placeholder="Latitude" value={form.latitude} onChange={e => setForm({ ...form, latitude: e.target.value })} />
            <input placeholder="Longitude" value={form.longitude} onChange={e => setForm({ ...form, longitude: e.target.value })} />
            <input placeholder="Tags" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
            <input placeholder="Image URL" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} />
            <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>

          <button onClick={saveRestaurant}>
            {editing ? "Save Changes" : "Create Restaurant"}
          </button>
        </section>

        <hr />

        <h3>Existing Restaurants</h3>
        <div className="restaurant-grid">
          {restaurants.map(r => (
            <div key={r.id} className="restaurant-card">
              <h3>{r.name}</h3>
              <p><b>Cuisine:</b> {r.cuisine}</p>
              <p><b>Price:</b> {r.priceRange}</p>
              <p><b>Location:</b> {r.area}, {r.location}</p>
              <p>{r.description}</p>
              <button onClick={() => startEdit(r)}>Edit</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
