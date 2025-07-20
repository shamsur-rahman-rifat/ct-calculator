import { useEffect, useState } from "react";
import API, { setAuthToken } from "../services/api";

const ProfileUpdate = () => {
  const [email, setEmail] = useState("");
  const [roll, setRoll] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setError("❌ No token found. Please log in.");
      return;
    }

    setAuthToken(token);

    const fetchProfile = async () => {
      try {
        const res = await API.post("profileDetails");
        const profile = res.data?.data?.[0];

        if (profile) {
          setEmail(profile.email);
          setRoll(profile.roll); // ✅ Set roll from response
        } else {
          setError("❌ No profile data found.");
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError("❌ Failed to load profile.");
      }
    };

    fetchProfile();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const payload = password ? { email, password } : { email };
      await API.post("profileUpdate", payload);
      setMessage("✅ Profile updated successfully!");
      setPassword("");
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      setError("❌ Failed to update profile.");
    } finally {
      setLoading(false);
      setTimeout(() => {
        setError("");
        setMessage("");
      }, 4000);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 p-3 bg-light">
      <div className="card shadow-sm p-4 w-100 rounded-4" style={{ maxWidth: "520px" }}>
        <h3 className="text-center mb-4 text-primary fw-bold">Update Your Profile</h3>

        {message && (
          <div className="alert alert-success text-center fade show">{message}</div>
        )}
        {error && (
          <div className="alert alert-danger text-center fade show">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Roll Number</label>
            <input
              type="text"
              className="form-control"
              value={roll}
              readOnly
              disabled
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Email Address</label>
            <input
              type="email"
              className="form-control"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.com"
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">New Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
            />
            <div className="form-text">Leave blank to keep your current password.</div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 fw-semibold"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileUpdate;