// import { Request, Response } from 'express';
// import { ProductModel, CategoryModel } from '../models';
// import { asyncHandler } from '../utils/asyncHandler';
// import * as fs from 'fs';
// import * as path from 'path';

// export const createProductsFromFile = asyncHandler(async (req: Request, res: Response) => {
//     const filePath = path.join(__dirname, '../data/products.json');
//     const productsData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

//     for (const productData of productsData) {
//         const category = await CategoryModel.findOne({ where: { name: productData.category_name } });

//         if (category) {
//             await ProductModel.findOrCreate({
//                 where: { name: productData.name },
//                 defaults: {
//                     name: productData.name,
//                     description: productData.description,
//                     price: productData.price,
//                     stock: productData.stock,
//                     category_id: category.get('id'),
//                 },
//             });
//         }
//     }

//     res.status(201).json({ message: 'Products created successfully' });
// });

// export const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
//     const products = await ProductModel.findAll();
//     res.status(200).json(products);
// });
