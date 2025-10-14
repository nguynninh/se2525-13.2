import { appInfo } from '../constants/appInfos';
import { authSelector } from '../redux/reducers/authReducer';
import store from '../redux/store';
import axiosClient from './axiosClient';

class HandleAPI {
  private getAccessToken = () => {
    return authSelector(store.getState())?.access_token || '';
  };

  handleApi = async (
    url: string,
    data?: any,
    method: 'get' | 'post' | 'put' | 'delete' = 'get'
  ) => {
    try {
      const accessToken = this.getAccessToken();
      const requestData = (data === null || data === undefined || (typeof data === 'object' && Object.keys(data).length === 0)) ? undefined : data;
      const response = await axiosClient(`${appInfo.BASE_URL}${url}`, {
        method,
        data: requestData,
        headers: {
          'Content-Type': 'application/json',
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
