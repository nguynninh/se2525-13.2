import handleAPI from './handleApi';

const url = 'https://api.hiki.io.vn/api/categories';

const getList = async () => {
    return await handleAPI(`${url}`, undefined, 'get');
};

const categoryApi = {
    getList,
};

export default categoryApi;
