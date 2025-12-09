import { appInfo } from '../constants/appInfos';
import axiosClient from './axiosClient';

class CartApi {
    handleCart = async (
        url: string,
        data?: any,
        method: 'get' | 'post' | 'put' | 'delete' = 'get'
    ) => {
        return await axiosClient(`${appInfo.BASE_URL}/carts${url}`, {
            method,
            data,
            params: method === 'delete' ? data : undefined,
        });
    };
}

const cartApi = new CartApi();
export default cartApi;
