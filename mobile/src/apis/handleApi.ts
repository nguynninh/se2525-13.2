import { appInfo } from '../constants/appInfos';
import { authSelector } from '../redux/reducers/authReducer';
import store from '../redux/store';
import axiosClient from './axiosClient';

class HandleAPI {
  private getAccessToken = () => {
    const authData = authSelector(store.getState());
    return authData?.accessToken || authData?.access_token || '';
  };

  handleApi = async (
    url: string,
    data?: any,
    method: 'get' | 'post' | 'put' | 'delete' | 'patch' = 'get'
  ) => {
    try {
      const accessToken = this.getAccessToken();
      const requestData = (data === null || data === undefined || (typeof data === 'object' && Object.keys(data).length === 0)) ? undefined : data;

      const isFormData = data instanceof FormData;

      const isAbsoluteUrl = url.startsWith('http://') || url.startsWith('https://');
      const finalUrl = isAbsoluteUrl ? url : `${appInfo.BASE_URL}${url}`;

      const response = await axiosClient(finalUrl, {
        method,
        data: requestData,
        headers: {
          'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      });
      return response;
    } catch (error: any) {
      throw new Error(error?.message);
    }
  };
}

const handleAPI = new HandleAPI();
export default handleAPI.handleApi;
