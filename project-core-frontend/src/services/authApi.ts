import axios from '../lib/axios';

// Note: The endpoint URLs are placeholders and will be adjusted as per your backend configuration.

export const register = async (data: any) => {
  const response = await axios.post('/auth/register', data);
  return response.data;
};

export const login = async (data: any) => {
  const response = await axios.post('/auth/login', data);
  return response.data;
};

export const verifyEmail = async (token: string) => {
  const response = await axios.get(`/auth/verify-email?token=${token}`);
  return response.data;
};

export const resendVerificationEmail = async (data: any) => {
  const response = await axios.post('/auth/resend-verification-email', data);
  return response.data;
};

export const forgotPassword = async (data: any) => {
  const response = await axios.post('/auth/forgot-password', data);
  return response.data;
};

export const resetPassword = async (data: any) => {
  const response = await axios.post('/auth/reset-password', data);
  return response.data;
};

export const changePassword = async (data: any) => {
  const response = await axios.post('/auth/change-password', data);
  return response.data;
};

export const logout = async () => {
  const response = await axios.post('/auth/logout');
  return response.data;
};

export const getMe = async () => {
  const response = await axios.get('/auth/me');
  return response.data;
};

