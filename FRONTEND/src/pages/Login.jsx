import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          email: form.email,
          password: form.password,
        },
        {
          withCredentials: true,
        }
      );

      console.log("Login successful:", response.data);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <main className="auth-card">
        <h1>Sign in</h1>
        <p className="lead">Enter your credentials to continue.</p>

        <form onSubmit={handleSubmit} aria-label="Login form">
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                className="input"
                type="email"
                required
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@company.com"
                autoComplete="email"
                disabled={submitting}
              />
            </div>

            <div className="form-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                className="input"
                type="password"
                required
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={submitting}
              />
            </div>
          </div>

          <div className="hr" />

          <div className="actions">
            <button type="submit" className="btn" disabled={submitting}>
              {submitting ? "Signing in..." : "Sign in"}
            </button>
            <Link to="/register" className="helper">
              Create account
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
