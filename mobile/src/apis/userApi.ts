import handleAPI from './handleApi';

const url = '/users';

const requestSeller = async () => {
    return await handleAPI(`${url}/request-seller`, {}, 'post');
};

const getProfile = async () => {
    return await handleAPI(`${url}/me`, {}, 'get');
};

const userApi = {
    requestSeller,
    getProfile,
    getShippingAddresses: async () => {
        return await handleAPI(`https://api.hiki.io.vn/api/user/me/shipping-addresses`, undefined, 'get');
    }
};

export default userApi;
