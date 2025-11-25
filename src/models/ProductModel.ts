// // Nam

// import { DataTypes, Model } from 'sequelize';
// import sequelize from '../config/databaseClient';

// class ProductModel extends Model {
//     public id!: number;
//     public name!: string;
//     public description!: string;
//     public price!: number;
//     public stock!: number;
//     public category_id!: number;
// }

// ProductModel.init(
//     {
//         id: {
//             type: DataTypes.INTEGER,
//             autoIncrement: true,
//             primaryKey: true,
//         },
//         name: {
//             type: DataTypes.STRING,
//             allowNull: false,
//         },
//         description: {
//             type: DataTypes.TEXT,
//             allowNull: false,
//         },
//         price: {
//             type: DataTypes.DECIMAL(10, 2),
//             allowNull: false,
//         },
//         stock: {
//             type: DataTypes.INTEGER,
//             allowNull: false,
//         },
//         category_id: {
//             type: DataTypes.INTEGER,
//             allowNull: false,
//         },
//     },
//     {
//         sequelize,
//         modelName: 'ProductModel',
//         tableName: 'products',
//         timestamps: false,
//     },
// );

// export default ProductModel;
