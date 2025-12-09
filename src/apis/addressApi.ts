import handleAPI from './handleApi';

const url = '/address';

const getProvinces = async () => {
    return await handleAPI(`${url}/provinces`, undefined, 'get');
};

const getWards = async (provinceCode: string) => {
    return await handleAPI(`${url}/wards?province_code=${provinceCode}`, undefined, 'get');
};

const addNewAddress = async (data: any) => {
    return await handleAPI(`${url}/add`, data, 'post');
};

const getAllAddresses = async () => {
    return await handleAPI(`${url}/get-all`, undefined, 'get');
};

const updateAddress = async (id: string, data: any) => {
    return await handleAPI(`${url}/update?id=${id}`, data, 'put');
};

const deleteAddress = async (id: string) => {
    return await handleAPI(`${url}/delete?id=${id}`, undefined, 'delete');
};

const addressApi = {
    getProvinces,
    getWards,
    addNewAddress,
    getAllAddresses,
    updateAddress,
    deleteAddress,
};

export default addressApi;
