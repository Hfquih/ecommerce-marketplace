import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import '../styling/verifyEmail.css';
import ApiClient from "../API/apiClient";
const apiClient = new ApiClient();

export default function VerifyEmail() {
  const [alert, setAlert] = useState({ msg: '', field: false, success: false, error: false });
  const { token } = useParams();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const { data } = await apiClient.get(`/auth/verify-email/${token}`);
        setAlert({
          msg: data?.msg || 'Your email has been verified successfully.',
          field: true,
          success: true,
          error: false,
        });
      } catch (err) {
        const message = err?.response?.data?.msg || 'Verification failed. Please try again later.';
        setAlert({
          msg: message,
          field: true,
          success: false,
          error: true,
        });
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="verify-email-page">
      <div className={`verify-email-card ${alert.success ? 'verified' : alert.error ? 'failed' : 'pending'}`}>
        <div className="verify-email-icon">
          {alert.success ? '✓' : alert.error ? '✕' : '⌛'}
        </div>
        <h1 className="verify-email-title">
          {alert.success ? 'Email Verified' : alert.error ? 'Verification Failed' : 'Verifying Your Email'}
        </h1>
        <p className="verify-email-text">
          {alert.field ? alert.msg : 'Please wait while we confirm your email address.'}
        </p>
        <div className="verify-email-actions">
          {alert.success ? (
            <Link to="/login" className="verify-email-button">
              Continue to Login
            </Link>
          ) : alert.error ? (
            <Link to="/" className="verify-email-button secondary">
              Return Home
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
