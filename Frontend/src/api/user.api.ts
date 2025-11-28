import api from './http';

// Lấy thông tin người dùng hiện tại
export const getUserInfoApi = async () => {
  const res = await api.get('/users/me');
  return res.data;
};

// Cập nhật thông tin người dùng
export const updateUserInfoApi = async (userId: number, data: any) => {
  const res = await api.put(`/users/${userId}`, data);
  return res.data;
};
