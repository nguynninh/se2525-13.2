// // Nam

// import { DataTypes, Model } from 'sequelize';
// import sequelize from '../config/databaseClient';

// class CategoryModel extends Model {
//     public id!: number;
//     public name!: string;
// }

// CategoryModel.init(
//     {
//         id: {
//             type: DataTypes.INTEGER,
//             autoIncrement: true,
//             primaryKey: true,
//         },
//         name: {
//             type: DataTypes.STRING,
//             allowNull: false,
//             unique: true,
//         },
//     },
//     {
//         sequelize,
//         modelName: 'CategoryModel',
//         tableName: 'categories',
//         timestamps: false,
//     },
// );

// export default CategoryModel;
