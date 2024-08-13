import axios from 'axios';
// import { toast } from 'react-toastify';

// Types
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

class Api {
  protected navigate = (url: string) => window.location.assign(url);
  private readonly baseURL = import.meta.env.VITE_BACKEND_BASE_URL || 'http://127.0.0.1:8000';
  private axiosInstance: AxiosInstance;

  constructor(endpointPrefix: string = '') {
    this.axiosInstance = axios.create({
      baseURL: `${this.baseURL}/${endpointPrefix}`,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  protected setAccessToken = (token: string) => {
    const accessToken = token.replace('Bearer ', '');
    sessionStorage.setItem('authorization', accessToken);
  };
  protected setRefreshToken = (token: string) => {
    const refreshToken = token.replace('Bearer ', '');
    localStorage.setItem('x-refresh-token', refreshToken);
  };
  protected getAccessToken = () => {
    return sessionStorage.getItem('authorization');
  };
  protected getRefreshToken = () => {
    return localStorage.getItem('x-refresh-token');
  };
  protected removeAccessToken = () => {
    localStorage.removeItem('authorization');
  };
  protected removeRefreshToken = () => {
    localStorage.removeItem('x-refresh-token');
  };

  protected get = async (url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> => {
    try {
      const response = await this.axiosInstance.get(url, config);
      return response;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  };

  protected post = async (
    url: string,
    data: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse> => {
    try {
      const response = await this.axiosInstance.post(url, data, config);
      return response;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  };

  protected patch = async (
    url: string,
    data: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse> => {
    try {
      const response = await this.axiosInstance.patch(url, data, config);
      return response;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  };

  protected put = async (
    url: string,
    data: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse> => {
    try {
      const response = await this.axiosInstance.put(url, data, config);
      return response;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  };

  protected delete = async (url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> => {
    try {
      const response = await this.axiosInstance.delete(url, config);
      return response;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private handleError = (error: any): void => {
    if (!error.response) {
      // Network error
      console.error('Network error:', error.message);

    } else if (error.response && error.response.data && error.response.data.message) {
      // Server error message
      console.error(error.response.data.message);

    } else {
      // General error
      console.error('Error:', error.message || error);

    }
  };
}

export default Api;