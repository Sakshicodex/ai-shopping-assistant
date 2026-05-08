import React, { useRef, useEffect } from 'react';
import useChat from '../hooks/useChat';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import PhoneInput from './PhoneInput';
import OtpVerify from './OtpVerify';
import CallStatus from './CallStatus';
import './ChatWidget.css';

export default function ChatWidget() {
  const {
    messages,
    mode,
    isLoading,
    error,
    sendMessage,
    requestCallback,
    confirmOrder,
    submitPhone,
    submitOtp,
    dismissCall,
  } = useChat();

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, mode]);

  return (
    <div className="chat-widget">
      <div className="chat-header">
        <div className="chat-header-avatar">&#129302;</div>
        <div className="chat-header-info">
          <div className="chat-header-name">ShopSmart AI</div>
          <div className="chat-header-status">
            <div className="chat-header-dot" />
            <span>Online — Ready to help</span>
          </div>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            onRequestCallback={requestCallback}
            onConfirmOrder={confirmOrder}
          />
        ))}
        {isLoading && (
          <div className="typing-indicator">
            <span /><span /><span />
          </div>
        )}
        {error && <div className="chat-error">{error}</div>}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-footer">
        {mode === 'chat' && <ChatInput onSend={sendMessage} disabled={isLoading} />}
        {mode === 'phone' && <PhoneInput onSubmit={submitPhone} disabled={isLoading} />}
        {mode === 'otp' && <OtpVerify onSubmit={submitOtp} disabled={isLoading} />}
        {mode === 'calling' && <CallStatus onDismiss={dismissCall} />}
      </div>
      <div className="chat-powered">POWERED BY SHOPSMART AI</div>
    </div>
  );
}
