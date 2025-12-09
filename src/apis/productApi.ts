import handleAPI from './handleApi';

const url = '/products';

const getMyProducts = async (params?: string) => {
    return await handleAPI(`${url}/my-products${params ? `?${params}` : ''}`, undefined, 'get');
};

const createProduct = async (data: any) => {
    return await handleAPI(`${url}`, data, 'post');
};

const getProducts = async (params?: string) => {
    return await handleAPI(`${url}${params ? `?${params}` : ''}`, undefined, 'get');
};

const productApi = {
    getMyProducts,
    createProduct,
    getProducts,
};

export default productApi;
