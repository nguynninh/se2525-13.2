'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const [product] = await queryInterface.sequelize.query(
      `SELECT id FROM products WHERE slug = 'iphone-15-pro-max-256gb' LIMIT 1`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const [user] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email = 'customer1@example.com' LIMIT 1`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    const [seller] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email = 'seller1@example.com' LIMIT 1`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (!product || !user) return; 

    await queryInterface.bulkInsert('product_reviews', [
      {
        product_id: product.id,
        user_id: user.id,
        rating: 5,
        comment: 'Hàng chính hãng, giao nhanh 2h!',
        created_at: now
      }
    ]);

    await queryInterface.bulkInsert('product_questions', [
      {
        product_id: product.id,
        user_id: user.id,
        question: 'Bản này là VNA hay xách tay?',
        answer: 'Chào bạn, bên mình cam kết hàng VNA chính hãng ạ.',
        answered_by: seller ? seller.id : null,
        created_at: now,
        updated_at: now
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
     await queryInterface.bulkDelete('product_reviews', null, {});
     await queryInterface.bulkDelete('product_questions', null, {});
  }
};