import handleAPI from './handleApi';

const url = '/users';

const requestSeller = async () => {
    return await handleAPI(`${url}/request-seller`, {}, 'post');
};

const userApi = {
    requestSeller,
};

export default userApi;
