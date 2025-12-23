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
};

export default userApi;
