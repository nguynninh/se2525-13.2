import { ProductModel, CategoryModel } from '../models';
import * as fs from 'fs';
import * as path from 'path';

const createProducts = async () => {
    const filePath = path.join(__dirname, '../data/products.json');
    if (!fs.existsSync(filePath)) {
        console.log('products.json not found, skipping seed.');
        return;
    }
    
    const productsData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    for (const productData of productsData) {
        const category = await CategoryModel.findOne({ where: { name: productData.category_name } });

        if (category) {
            await ProductModel.findOrCreate({
                where: { name: productData.name },
                defaults: {
                    name: productData.name,
                    description: productData.description,
                    price: productData.price,
                    stock: productData.stock,
                    category_id: category.get('id'),
                },
            });
        } else {
            console.log(`Category "${productData.category_name}" not found for product "${productData.name}".`);
        }
    }
    console.log('Products seeded successfully.');
};

export default createProducts;
