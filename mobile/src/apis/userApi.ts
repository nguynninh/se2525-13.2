import handleAPI from './handleApi';

const url = '/user';

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
    },
    registerSellerApplication: async () => {
        return await handleAPI(`https://api.hiki.io.vn/api/seller-applications`, { accepted_terms: true }, 'post');
    }
};

export default userApi;
