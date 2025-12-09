import handleAPI from './handleApi';

const url = '/products';

const getMyProducts = async (params?: string) => {
    return await handleAPI(`${url}/my-products${params ? `?${params}` : ''}`, undefined, 'get');
};

const createProduct = async (data: any) => {
    return await handleAPI(`${url}`, data, 'post');
};

const productApi = {
    getMyProducts,
    createProduct,
};

export default productApi;
