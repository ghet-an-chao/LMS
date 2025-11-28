import api from "./http";

export const loginApi = async (data: {
  email: string;
  password: string;
}) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const registerApi = async (data: {
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  email: string;
  role: "student" | "teacher";
}) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const logoutApi = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};
