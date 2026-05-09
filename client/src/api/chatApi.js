import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export async function sendMessage(message, conversationHistory) {
  const { data } = await api.post('/chat', { message, conversationHistory });
  return data;
}

export async function sendOtp(phoneNumber) {
  const { data } = await api.post('/otp/send', { phoneNumber });
  return data;
}

export async function verifyOtp(phoneNumber, otp) {
  const { data } = await api.post('/otp/verify', { phoneNumber, otp });
  return data;
}

export async function initiateCallback(phoneNumber, query, aiResponse) {
  const { data } = await api.post('/callback/initiate', { phoneNumber, query, aiResponse });
  return data;
}

export async function placeOrder(items, customerEmail, shippingAddress) {
  const { data } = await api.post('/orders', { items, customerEmail, shippingAddress });
  return data;
}
