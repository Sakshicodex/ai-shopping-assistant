import React, { useState } from 'react';
import './OtpVerify.css';

export default function OtpVerify({ onSubmit, disabled }) {
  const [otp, setOtp] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.length !== 6 || disabled) return;
    onSubmit(otp);
  };

  return (
    <form className="otp-verify" onSubmit={handleSubmit}>
      <label>Enter the 6-digit verification code:</label>
      <div className="otp-verify-row">
        <input
          type="text"
          placeholder="123456"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          disabled={disabled}
          maxLength={6}
        />
        <button type="submit" disabled={disabled || otp.length !== 6}>
          Verify
        </button>
      </div>
    </form>
  );
}
