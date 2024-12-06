// src/api/auth.ts
import axiosInstance from './axiosInstance';

export const register = async (username: string, password: string) => {
  try {
    const response = await axiosInstance.post('/register', {
      username,
      password,
    });

    return response.data;
  } catch (error: any) {
    if (error.response) {
      return error.response.data;
    } else if (error.request) {
    return error.request;
    } else {
      return error.message;
    }
  }
};

export const login = async (username: string, password: string) => {
  try {
    const response = await axiosInstance.post('/login', {
      username,
      password,
    });

    const token = response.data.token;

    return token;
  } catch (error: any) {
    if (error.response) {
      return error.response.data;
    } else if (error.request) {
      return error.request;
    } else {
      error.message;
    }
  }
};
