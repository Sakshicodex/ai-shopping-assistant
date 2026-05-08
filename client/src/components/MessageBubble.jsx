import React, { useState } from 'react';
import './MessageBubble.css';

export default function MessageBubble({ message, onRequestCallback, onConfirmOrder }) {
  const isUser = message.role === 'user';
  const [ordered, setOrdered] = useState(false);

  const handleOrder = () => {
    setOrdered(true);
    onConfirmOrder(message.orderItems);
  };

  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`bubble-row ${isUser ? 'user' : 'assistant'}`}>
      {!isUser && <div className="bubble-avatar bot">&#129302;</div>}
      <div>
        <div className={`bubble ${isUser ? 'bubble-user' : 'bubble-assistant'}`}>
          {message.content}
          {(message.orderItems || message.offerCallback) && (
            <div className="bubble-actions">
              {message.orderItems && !ordered && (
                <button className="order-btn" onClick={handleOrder}>
                  &#128722; Confirm Order
                </button>
              )}
              {ordered && (
                <span className="order-confirmed">&#10003; Order Submitted</span>
              )}
              {message.offerCallback && (
                <button className="callback-btn" onClick={onRequestCallback}>
                  &#128222; Request a Callback
                </button>
              )}
            </div>
          )}
        </div>
        <div className="bubble-time">{time}</div>
      </div>
      {isUser && <div className="bubble-avatar user-avatar">&#128100;</div>}
    </div>
  );
}
