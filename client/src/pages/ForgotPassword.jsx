import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const verifyEmail = async () => {
    setError("");
    setMessage("");
    if (!email.trim()) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setMessage("Sending verification email...");
    try {
      await axios.get(`http://localhost:9090/api/verifyEmail/${email}`);
      setMessage("✅ Email verified. Please check your inbox for OTP.");
      setStep(2);
    } catch (err) {
      setError("❌ Email not found or verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setError("");
    setMessage("");
    if (!otp.trim() || otp.length < 4) {
      setError("Please enter a valid OTP.");
      return;
    }
    setLoading(true);
    setMessage("Verifying OTP...");
    try {
      await axios.get(`http://localhost:9090/api/verifyOTP/${email}/${otp}`);
      setMessage("✅ OTP verified. Please set your new password.");
      setStep(3);
    } catch (err) {
      setError("❌ Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    setError("");
    setMessage("");
    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    setLoading(true);
    setMessage("Resetting password...");
    try {
      await axios.get(
        `http://localhost:9090/api/passwordReset/${email}/${otp}/${newPassword}`
      );
      setMessage("✅ Password reset successful. Redirecting to login...");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError("❌ Password reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light p-3">
      <div
        className="card shadow p-4 w-100"
        style={{ maxWidth: "480px", boxSizing: "border-box" }}
      >
        <h3 className="mb-4 text-center">Forgot Password</h3>

        {message && <div className="alert alert-info">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {step === 1 && (
          <>
            <div className="mb-3">
              <label htmlFor="emailInput" className="form-label fw-semibold">
                Email Address
              </label>
              <input
                id="emailInput"
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={loading}
                autoFocus
              />
            </div>
            <button
              className="btn btn-primary w-100"
              onClick={verifyEmail}
              disabled={loading || !email.trim()}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Sending...
                </>
              ) : (
                "Verify Email"
              )}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="mb-3">
              <label htmlFor="otpInput" className="form-label fw-semibold">
                Enter OTP
              </label>
              <input
                id="otpInput"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="form-control"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                disabled={loading}
                maxLength={6}
                autoFocus
              />
              <div className="form-text">
                Please check your email inbox (including spam).
              </div>
            </div>
            <button
              className="btn btn-primary w-100"
              onClick={verifyOtp}
              disabled={loading || otp.trim().length < 6}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <div className="mb-3 position-relative">
              <label htmlFor="newPasswordInput" className="form-label fw-semibold">
                New Password
              </label>
              <input
                id="newPasswordInput"
                type={showPassword ? "text" : "password"}
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                disabled={loading}
                autoFocus
                minLength={6}
              />
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary position-absolute top-50 end-0 translate-middle-y me-2"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
                style={{ userSelect: "none" }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
              <div className="form-text">Password must be at least 6 characters.</div>
            </div>
            <button
              className="btn btn-success w-100"
              onClick={resetPassword}
              disabled={loading || newPassword.length < 6}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
