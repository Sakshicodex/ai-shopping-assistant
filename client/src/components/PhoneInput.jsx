import React, { useState } from 'react';
import './PhoneInput.css';

export default function PhoneInput({ onSubmit, disabled }) {
  const [phone, setPhone] = useState('+');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phone || phone.length < 8 || disabled) return;
    onSubmit(phone);
  };

  return (
    <form className="phone-input" onSubmit={handleSubmit}>
      <label>Enter your phone number (with country code):</label>
      <div className="phone-input-row">
        <input
          type="tel"
          placeholder="+1234567890"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={disabled}
        />
        <button type="submit" disabled={disabled || phone.length < 8}>
          Send OTP
        </button>
      </div>
    </form>
  );
}
