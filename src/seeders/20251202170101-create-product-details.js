'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const products = await queryInterface.sequelize.query(
      `SELECT id, slug FROM products WHERE slug IN (
        'nha-gia-kim', 
        'ao-polo-coolmate', 
        'macbook-air-m2', 
        'son-3ce-cloud-lip', 
        'snack-lays-combo'
      )`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const pMap = Object.fromEntries(products.map(p => [p.slug, p.id]));

    if (Object.keys(pMap).length === 0) return;

    const images = [];
    for (const p of products) {
      images.push({ product_id: p.id, image_url: `https://placehold.co/600x600?text=${p.slug}-1`, is_main: true, created_at: now });
      images.push({ product_id: p.id, image_url: `https://placehold.co/600x600?text=${p.slug}-2`, is_main: false, created_at: now });
    }
    await queryInterface.bulkInsert('product_images', images);

    if (pMap['nha-gia-kim']) {
      const [vFormat] = await queryInterface.sequelize.query(
        `INSERT INTO product_variants (product_id, name, created_at, updated_at) VALUES ('${pMap['nha-gia-kim']}', 'Loại bìa', NOW(), NOW()) RETURNING id`,
        { type: Sequelize.QueryTypes.INSERT }
      );
      
      const [oSoft] = await queryInterface.sequelize.query(
        `INSERT INTO product_variant_options (variant_id, value, created_at) VALUES ('${vFormat[0].id}', 'Bìa mềm', NOW()) RETURNING id`,
        { type: Sequelize.QueryTypes.INSERT }
      );
      const [oHard] = await queryInterface.sequelize.query(
        `INSERT INTO product_variant_options (variant_id, value, created_at) VALUES ('${vFormat[0].id}', 'Bìa cứng', NOW()) RETURNING id`,
        { type: Sequelize.QueryTypes.INSERT }
      );

      await queryInterface.bulkInsert('product_stocks', [
        { product_id: pMap['nha-gia-kim'], option_ids: oSoft[0].id, sku: 'BOOK-SOFT', price: 79000, quantity: 400, created_at: now, updated_at: now },
        { product_id: pMap['nha-gia-kim'], option_ids: oHard[0].id, sku: 'BOOK-HARD', price: 159000, quantity: 100, created_at: now, updated_at: now }
      ]);
    }

    if (pMap['ao-polo-coolmate']) {
      const [vColor] = await queryInterface.sequelize.query(
        `INSERT INTO product_variants (product_id, name, created_at, updated_at) VALUES ('${pMap['ao-polo-coolmate']}', 'Màu sắc', NOW(), NOW()) RETURNING id`,
        { type: Sequelize.QueryTypes.INSERT }
      );
      const [vSize] = await queryInterface.sequelize.query(
        `INSERT INTO product_variants (product_id, name, created_at, updated_at) VALUES ('${pMap['ao-polo-coolmate']}', 'Size', NOW(), NOW()) RETURNING id`,
        { type: Sequelize.QueryTypes.INSERT }
      );

      const [oNavy] = await queryInterface.sequelize.query(
        `INSERT INTO product_variant_options (variant_id, value, created_at) VALUES ('${vColor[0].id}', 'Xanh Navy', NOW()) RETURNING id`,
        { type: Sequelize.QueryTypes.INSERT }
      );
      const [oBlack] = await queryInterface.sequelize.query(
        `INSERT INTO product_variant_options (variant_id, value, created_at) VALUES ('${vColor[0].id}', 'Đen', NOW()) RETURNING id`,
        { type: Sequelize.QueryTypes.INSERT }
      );
      
      const [oL] = await queryInterface.sequelize.query(
        `INSERT INTO product_variant_options (variant_id, value, created_at) VALUES ('${vSize[0].id}', 'L', NOW()) RETURNING id`,
        { type: Sequelize.QueryTypes.INSERT }
      );
      const [oXL] = await queryInterface.sequelize.query(
        `INSERT INTO product_variant_options (variant_id, value, created_at) VALUES ('${vSize[0].id}', 'XL', NOW()) RETURNING id`,
        { type: Sequelize.QueryTypes.INSERT }
      );

      await queryInterface.bulkInsert('product_stocks', [
        { product_id: pMap['ao-polo-coolmate'], option_ids: `${oNavy[0].id},${oL[0].id}`, sku: 'POLO-NV-L', price: 299000, quantity: 50, created_at: now, updated_at: now },
        { product_id: pMap['ao-polo-coolmate'], option_ids: `${oNavy[0].id},${oXL[0].id}`, sku: 'POLO-NV-XL', price: 299000, quantity: 50, created_at: now, updated_at: now },
        { product_id: pMap['ao-polo-coolmate'], option_ids: `${oBlack[0].id},${oL[0].id}`, sku: 'POLO-BK-L', price: 299000, quantity: 50, created_at: now, updated_at: now },
        { product_id: pMap['ao-polo-coolmate'], option_ids: `${oBlack[0].id},${oXL[0].id}`, sku: 'POLO-BK-XL', price: 299000, quantity: 50, created_at: now, updated_at: now }
      ]);
    }

    if (pMap['macbook-air-m2']) {
      const [vRam] = await queryInterface.sequelize.query(
        `INSERT INTO product_variants (product_id, name, created_at, updated_at) VALUES ('${pMap['macbook-air-m2']}', 'RAM', NOW(), NOW()) RETURNING id`,
        { type: Sequelize.QueryTypes.INSERT }
      );
      const [vSSD] = await queryInterface.sequelize.query(
        `INSERT INTO product_variants (product_id, name, created_at, updated_at) VALUES ('${pMap['macbook-air-m2']}', 'SSD', NOW(), NOW()) RETURNING id`,
        { type: Sequelize.QueryTypes.INSERT }
      );

      const [o8GB] = await queryInterface.sequelize.query(
        `INSERT INTO product_variant_options (variant_id, value, created_at) VALUES ('${vRam[0].id}', '8GB', NOW()) RETURNING id`,
        { type: Sequelize.QueryTypes.INSERT }
      );
      const [o16GB] = await queryInterface.sequelize.query(
        `INSERT INTO product_variant_options (variant_id, value, created_at) VALUES ('${vRam[0].id}', '16GB', NOW()) RETURNING id`,
        { type: Sequelize.QueryTypes.INSERT }
      );
      
      const [o256] = await queryInterface.sequelize.query(
        `INSERT INTO product_variant_options (variant_id, value, created_at) VALUES ('${vSSD[0].id}', '256GB', NOW()) RETURNING id`,
        { type: Sequelize.QueryTypes.INSERT }
      );
      const [o512] = await queryInterface.sequelize.query(
        `INSERT INTO product_variant_options (variant_id, value, created_at) VALUES ('${vSSD[0].id}', '512GB', NOW()) RETURNING id`,
        { type: Sequelize.QueryTypes.INSERT }
      );

      await queryInterface.bulkInsert('product_stocks', [
        { product_id: pMap['macbook-air-m2'], option_ids: `${o8GB[0].id},${o256[0].id}`, sku: 'MAC-8-256', price: 26990000, quantity: 20, created_at: now, updated_at: now },
        { product_id: pMap['macbook-air-m2'], option_ids: `${o8GB[0].id},${o512[0].id}`, sku: 'MAC-8-512', price: 31990000, quantity: 10, created_at: now, updated_at: now },
        { product_id: pMap['macbook-air-m2'], option_ids: `${o16GB[0].id},${o512[0].id}`, sku: 'MAC-16-512', price: 36990000, quantity: 10, created_at: now, updated_at: now }
      ]);
    }

    if (pMap['son-3ce-cloud-lip']) {
      const [vTone] = await queryInterface.sequelize.query(
        `INSERT INTO product_variants (product_id, name, created_at, updated_at) VALUES ('${pMap['son-3ce-cloud-lip']}', 'Màu sắc', NOW(), NOW()) RETURNING id`,
        { type: Sequelize.QueryTypes.INSERT }
      );

      const [oRed] = await queryInterface.sequelize.query(
        `INSERT INTO product_variant_options (variant_id, value, created_at) VALUES ('${vTone[0].id}', 'Đỏ Gạch', NOW()) RETURNING id`,
        { type: Sequelize.QueryTypes.INSERT }
      );
      const [oOrange] = await queryInterface.sequelize.query(
        `INSERT INTO product_variant_options (variant_id, value, created_at) VALUES ('${vTone[0].id}', 'Cam Đất', NOW()) RETURNING id`,
        { type: Sequelize.QueryTypes.INSERT }
      );

      await queryInterface.bulkInsert('product_stocks', [
        { product_id: pMap['son-3ce-cloud-lip'], option_ids: oRed[0].id, sku: '3CE-RED', price: 250000, quantity: 150, created_at: now, updated_at: now },
        { product_id: pMap['son-3ce-cloud-lip'], option_ids: oOrange[0].id, sku: '3CE-ORA', price: 250000, quantity: 150, created_at: now, updated_at: now }
      ]);
    }

    if (pMap['snack-lays-combo']) {
      const [vFlavor] = await queryInterface.sequelize.query(
        `INSERT INTO product_variants (product_id, name, created_at, updated_at) VALUES ('${pMap['snack-lays-combo']}', 'Vị', NOW(), NOW()) RETURNING id`,
        { type: Sequelize.QueryTypes.INSERT }
      );

      const [oClassic] = await queryInterface.sequelize.query(
        `INSERT INTO product_variant_options (variant_id, value, created_at) VALUES ('${vFlavor[0].id}', 'Tự Nhiên', NOW()) RETURNING id`,
        { type: Sequelize.QueryTypes.INSERT }
      );
      const [oSeaweed] = await queryInterface.sequelize.query(
        `INSERT INTO product_variant_options (variant_id, value, created_at) VALUES ('${vFlavor[0].id}', 'Tảo Biển', NOW()) RETURNING id`,
        { type: Sequelize.QueryTypes.INSERT }
      );

      await queryInterface.bulkInsert('product_stocks', [
        { product_id: pMap['snack-lays-combo'], option_ids: oClassic[0].id, sku: 'LAYS-CLS', price: 45000, quantity: 500, created_at: now, updated_at: now },
        { product_id: pMap['snack-lays-combo'], option_ids: oSeaweed[0].id, sku: 'LAYS-SW', price: 45000, quantity: 500, created_at: now, updated_at: now }
      ]);
    }
  },

  async down(queryInterface, Sequelize) {
    const slugs = ['nha-gia-kim', 'ao-polo-coolmate', 'macbook-air-m2', 'son-3ce-cloud-lip', 'snack-lays-combo'];
    const products = await queryInterface.sequelize.query(
        `SELECT id FROM products WHERE slug IN (:slugs)`,
        { replacements: { slugs }, type: Sequelize.QueryTypes.SELECT }
    );
    const productIds = products.map(p => p.id);

    if (productIds.length > 0) {
        await queryInterface.bulkDelete('product_stocks', { product_id: productIds }, {});
        await queryInterface.bulkDelete('product_variant_options', { 
            variant_id: { [Sequelize.Op.in]: Sequelize.literal(`(SELECT id FROM product_variants WHERE product_id IN ('${productIds.join("','")}'))`) }
        }, {});
        await queryInterface.bulkDelete('product_variants', { product_id: productIds }, {});
        await queryInterface.bulkDelete('product_images', { product_id: productIds }, {});
    }
  }
};