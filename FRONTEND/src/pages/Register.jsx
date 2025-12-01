import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/register",
        form,
        { withCredentials: true }
      );

      console.log("Registration successful:", res.data);
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <main className="auth-card">
        <h1>Create account</h1>
        <p className="lead">Quickly create your account. We'll never share your info.</p>

        <form onSubmit={handleSubmit} aria-label="Register form">

          <div className="form-grid two-col">
            <div className="form-field">
              <label htmlFor="firstName">First name</label>
              <input
                id="firstName"
                name="firstName"
                className="input"
                value={form.firstName}
                onChange={handleChange}
                placeholder="John"
                required
                disabled={submitting}
                autoComplete="given-name"
              />
            </div>

            <div className="form-field">
              <label htmlFor="lastName">Last name</label>
              <input
                id="lastName"
                name="lastName"
                className="input"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Doe"
                required
                disabled={submitting}
                autoComplete="family-name"
              />
            </div>
          </div>

          <div className="form-grid" style={{ marginTop: 12 }}>
            <div className="form-field" style={{ gridColumn: "1 / -1" }}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                className="input"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@company.com"
                required
                disabled={submitting}
                autoComplete="email"
              />
            </div>

            <div className="form-field" style={{ gridColumn: "1 / -1" }}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                className="input"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                required
                disabled={submitting}
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="hr" />

          <div className="actions">
            <button type="submit" className="btn" disabled={submitting}>
              {submitting ? "Creating..." : "Create account"}
            </button>

            <Link to="/login" className="helper">
              Have an account? Sign in
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
