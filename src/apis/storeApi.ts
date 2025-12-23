import axiosClient from './axiosClient';

class StoreApi {
    handleStore = async (
        url: string,
        data?: any,
        method: 'get' | 'post' | 'put' | 'delete' = 'get',
    ) => {
        return await axiosClient(`/stores${url}`, {
            method: method,
            data,
        });
    };

    registerStore = async (data: any) => {
        return await this.handleStore('/register', data, 'post');
    }
}

const storeApi = new StoreApi();
export default storeApi;
