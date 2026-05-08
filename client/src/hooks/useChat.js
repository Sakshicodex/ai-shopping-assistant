import { useState, useCallback } from 'react';
import * as api from '../api/chatApi';

export default function useChat() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content: "Hey there! Welcome to ShopSmart. I can help you browse products, find deals, place orders, and track deliveries. What are you looking for today?",
    },
  ]);
  const [mode, setMode] = useState('chat'); // chat | phone | otp | calling
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pendingQuery, setPendingQuery] = useState(null);
  const [pendingResponse, setPendingResponse] = useState(null);

  const addMessage = useCallback((role, content, extra = {}) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role, content, ...extra },
    ]);
  }, []);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;
    setError(null);

    addMessage('user', text);
    setIsLoading(true);

    try {
      // Build conversation history, skipping the initial welcome message
      const history = messages
        .slice(1)
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({ role: m.role, content: m.content }));

      const { reply, offerCallback, orderItems } = await api.sendMessage(text, history);
      addMessage('assistant', reply, { offerCallback, orderItems });

      if (offerCallback) {
        setPendingQuery(text);
        setPendingResponse(reply);
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [messages, addMessage]);

  const requestCallback = useCallback(() => {
    setMode('phone');
    addMessage('assistant', "Sure! I'd be happy to call you and explain in detail. Please enter your phone number below.");
  }, [addMessage]);

  const submitPhone = useCallback(async (phone) => {
    setError(null);
    setPhoneNumber(phone);
    setIsLoading(true);

    try {
      await api.sendOtp(phone);
      setMode('otp');
      addMessage('assistant', `We've sent a verification code to ${phone}. Please enter it below.`);
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to send OTP. Please try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [addMessage]);

  const submitOtp = useCallback(async (otp) => {
    setError(null);
    setIsLoading(true);

    try {
      const { verified } = await api.verifyOtp(phoneNumber, otp);
      if (!verified) {
        setError('Invalid OTP. Please try again.');
        setIsLoading(false);
        return;
      }

      addMessage('assistant', 'Phone verified! Initiating your callback now...');
      setMode('calling');

      await api.initiateCallback(phoneNumber, pendingQuery, pendingResponse);
      addMessage('assistant', "We're calling you now! You'll receive a call shortly with a detailed explanation.");
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to initiate callback. Please try again.';
      setError(msg);
      setMode('chat');
    } finally {
      setIsLoading(false);
    }
  }, [phoneNumber, pendingQuery, pendingResponse, addMessage]);

  const confirmOrder = useCallback(async (orderItems) => {
    setError(null);
    setIsLoading(true);

    try {
      const { order } = await api.placeOrder(
        orderItems,
        'customer@shopsmart.com',
        '123 Customer Street, City'
      );
      addMessage('assistant',
        `Order placed successfully!\n\nOrder ID: ${order.orderId}\nTotal: $${order.total.toFixed(2)}\nStatus: ${order.status}\nEstimated Delivery: ${order.estimatedDelivery}\n\nYou can track your order anytime by asking me about order ${order.orderId}.`
      );
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to place order. Please try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [addMessage]);

  const dismissCall = useCallback(() => {
    setMode('chat');
    setPendingQuery(null);
    setPendingResponse(null);
    setPhoneNumber('');
    setError(null);
  }, []);

  return {
    messages,
    mode,
    phoneNumber,
    isLoading,
    error,
    sendMessage,
    requestCallback,
    confirmOrder,
    submitPhone,
    submitOtp,
    dismissCall,
  };
}
