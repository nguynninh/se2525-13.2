import { CategoryModel } from '../models';

const createCategories = async () => {
    const categories = [
        { name: 'Electronics' },
        { name: 'Books' },
        { name: 'Clothing' },
        { name: 'Home Goods' },
    ];

    for (const category of categories) {
        await CategoryModel.findOrCreate({
            where: { name: category.name },
            defaults: category,
        });
    }
};

export default createCategories;
