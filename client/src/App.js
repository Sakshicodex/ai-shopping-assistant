import React from 'react';
import ChatWidget from './components/ChatWidget';
import './App.css';

function App() {
  return (
    <div className="app">
      <div className="app-hero">
        <div className="app-hero-logo">&#128722;</div>
        <h1>ShopSmart AI</h1>
        <p>Your intelligent shopping companion</p>
        <div className="app-features">
          <div className="app-feature-tag"><span>&#128269;</span> Product Search</div>
          <div className="app-feature-tag"><span>&#127991;</span> Live Deals</div>
          <div className="app-feature-tag"><span>&#128230;</span> Order Tracking</div>
          <div className="app-feature-tag"><span>&#128222;</span> Voice Callback</div>
        </div>
      </div>
      <ChatWidget />
      <div id="recaptcha-container"></div>
    </div>
  );
}

export default App;
