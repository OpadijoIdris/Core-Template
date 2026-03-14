import axios from '../lib/axios';

export const getAllUsers = async () => {
  const response = await axios.get('/user');
  return response.data;
};

export const getUserById = async (id: string) => {
  const response = await axios.get(`/user/${id}`);
  return response.data;
};

export const updateUserProfile = async (data: { firstName: string | null; lastName: string | null }) => {
  const response = await axios.put('/user/profile', data);
  return response.data;
};

export const uploadUserAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append('avatar', file);
  const response = await axios.patch('/user/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
