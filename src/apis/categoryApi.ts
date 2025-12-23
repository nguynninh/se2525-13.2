import handleAPI from './handleApi';

const url = '/categories';

const getList = async () => {
    return await handleAPI(`${url}`, undefined, 'get');
};

const categoryApi = {
    getList,
};

export default categoryApi;
