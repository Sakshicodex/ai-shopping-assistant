import React from 'react';
import './CallStatus.css';

export default function CallStatus({ onDismiss }) {
  return (
    <div className="call-status">
      <div className="call-status-animation">
        <span className="call-ring" />
        <span className="call-ring" />
        <span className="call-icon">&#9742;</span>
      </div>
      <p>Calling you now...</p>
      <button onClick={onDismiss}>Back to Chat</button>
    </div>
  );
}
