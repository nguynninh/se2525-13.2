import axiosClient from './axiosClient';

class HandleAPI {
  handleApi = async (
    url: string,
    data?: any,
    method: 'get' | 'post' | 'put' | 'delete' = 'get',
    token?: string,
  ) => {
    try {
      const response = await axiosClient(url, {
        method,
        data,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      return response;
    } catch (error: any) {
      throw new Error(error?.message || 'Request failed');
    }
  };
}

const handleAPI = new HandleAPI();
export default handleAPI.handleApi;
