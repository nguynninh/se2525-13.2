import handleAPI from './handleApi';

const url = '/address';

const getProvinces = async () => {
    return await handleAPI(`https://api.hiki.io.vn/api/location/provinces`, undefined, 'get');
};

const getWards = async (provinceCode: string) => {
    return await handleAPI(`https://api.hiki.io.vn/api/location/provinces/${provinceCode}/wards`, undefined, 'get');
};

const addNewAddress = async (data: any) => {
    return await handleAPI(`https://api.hiki.io.vn/api/user/me/shipping-addresses`, data, 'post');
};

const getAllAddresses = async () => {
    return await handleAPI(`${url}/get-all`, undefined, 'get');
};

const updateAddress = async (id: string, data: any) => {
    return await handleAPI(`https://api.hiki.io.vn/api/user/me/shipping-addresses/${id}`, data, 'patch');
};

const deleteAddress = async (id: string) => {
    return await handleAPI(`https://api.hiki.io.vn/api/user/me/shipping-addresses/${id}`, undefined, 'delete');
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
