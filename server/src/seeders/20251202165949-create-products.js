'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const [shop] = await queryInterface.sequelize.query(
      `SELECT id FROM shops WHERE slug = 'seller-one-shop' LIMIT 1`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const categories = await queryInterface.sequelize.query(
      `SELECT id, slug FROM categories WHERE slug IN (
        'nha-sach', 
        'thoi-trang-nam', 
        'laptop-may-vi-tinh', 
        'lam-dep-suc-khoe', 
        'bach-hoa-online'
      )`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const catMap = Object.fromEntries(categories.map(c => [c.slug, c.id]));

    if (!shop || Object.keys(catMap).length < 5) return;

    await queryInterface.bulkInsert('products', [
      {
        shop_id: shop.id,
        category_id: catMap['nha-sach'],
        name: 'Nhà Giả Kim (Tái Bản)',
        slug: 'nha-gia-kim',
        sku: 'BOOK-ALCHEMIST',
        description: 'Cuốn sách bán chạy nhất mọi thời đại.',
        status: 'active',
        price: 79000,
        quantity: 500,
        sold_count: 1200,
        rating_avg: 4.9,
        rating_count: 350,
        created_at: now,
        updated_at: now
      },
      {
        shop_id: shop.id,
        category_id: catMap['thoi-trang-nam'],
        name: 'Áo Polo Nam Coolmate Basic',
        slug: 'ao-polo-coolmate',
        sku: 'FASHION-POLO',
        description: 'Chất liệu Cotton Compact thoáng mát.',
        status: 'active',
        price: 299000,
        quantity: 200,
        sold_count: 85,
        rating_avg: 4.7,
        rating_count: 42,
        created_at: now,
        updated_at: now
      },
      {
        shop_id: shop.id,
        category_id: catMap['laptop-may-vi-tinh'],
        name: 'MacBook Air M2 2024',
        slug: 'macbook-air-m2',
        sku: 'TECH-MAC-M2',
        description: 'Siêu mỏng nhẹ, pin 18 tiếng.',
        status: 'active',
        price: 26990000,
        quantity: 50,
        sold_count: 10,
        rating_avg: 5.0,
        rating_count: 5,
        created_at: now,
        updated_at: now
      },
      {
        shop_id: shop.id,
        category_id: catMap['lam-dep-suc-khoe'],
        name: 'Son Kem Lì 3CE Cloud Lip Tint',
        slug: 'son-3ce-cloud-lip',
        sku: 'BEAUTY-3CE',
        description: 'Chất son mềm mịn như mây.',
        status: 'active',
        price: 250000,
        quantity: 300,
        sold_count: 500,
        rating_avg: 4.8,
        rating_count: 120,
        created_at: now,
        updated_at: now
      },
      {
        shop_id: shop.id,
        category_id: catMap['bach-hoa-online'],
        name: 'Combo 5 Gói Snack Lay\'s',
        slug: 'snack-lays-combo',
        sku: 'FOOD-LAYS',
        description: 'Khoai tây chiên giòn rụm.',
        status: 'active',
        price: 45000,
        quantity: 1000,
        sold_count: 2000,
        rating_avg: 4.6,
        rating_count: 80,
        created_at: now,
        updated_at: now
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', { 
      slug: ['nha-gia-kim', 'ao-polo-coolmate', 'macbook-air-m2', 'son-3ce-cloud-lip', 'snack-lays-combo'] 
    }, {});
  }
};