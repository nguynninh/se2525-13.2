'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();

        // Seed payment methods (idempotent)
        await queryInterface.sequelize.query(
            `
            INSERT INTO payment_methods (id, code, name, is_active, created_at, updated_at)
            VALUES 
              (1, 'cod', 'Cash on Delivery', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
              (2, 'vnpay', 'VNPAY', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
              (3, 'momo', 'MOMO', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            ON CONFLICT (id) DO NOTHING;
            `,
        );

        const customerEmails = ['customer1@example.com', 'customer2@example.com'];
        const sellerEmails = ['seller1@example.com', 'seller2@example.com'];
        const shopSlugs = ['seller-one-shop', 'seller-two-shop'];
        const productSlugs = ['nha-gia-kim', 'ao-polo-coolmate', 'macbook-air-m2'];

        const users = await queryInterface.sequelize.query(
            `SELECT id, email FROM users WHERE email IN (:emails)`,
            { replacements: { emails: [...customerEmails, ...sellerEmails] }, type: Sequelize.QueryTypes.SELECT },
        );
        const shops = await queryInterface.sequelize.query(
            `SELECT id, slug FROM shops WHERE slug IN (:slugs)`,
            { replacements: { slugs: shopSlugs }, type: Sequelize.QueryTypes.SELECT },
        );
        const products = await queryInterface.sequelize.query(
            `SELECT id, slug FROM products WHERE slug IN (:slugs)`,
            { replacements: { slugs: productSlugs }, type: Sequelize.QueryTypes.SELECT },
        );
        const stocks = await queryInterface.sequelize.query(
            `SELECT id, sku FROM product_stocks WHERE sku IN ('BOOK-SOFT','BOOK-HARD','POLO-NV-L','POLO-NV-XL','MAC-8-256','MAC-8-512','MAC-16-512')`,
            { type: Sequelize.QueryTypes.SELECT },
        );
        const wards = await queryInterface.sequelize.query(
            `SELECT id, name FROM wards WHERE name IN (:names)`,
            { replacements: { names: ['Cầu Giấy', 'Bến Thành'] }, type: Sequelize.QueryTypes.SELECT },
        );

        const byEmail = Object.fromEntries(users.map((u) => [u.email, u.id]));
        const bySlug = Object.fromEntries(shops.map((s) => [s.slug, s.id]));
        const productMap = Object.fromEntries(products.map((p) => [p.slug, p.id]));
        const stockMap = Object.fromEntries(stocks.map((s) => [s.sku, s.id]));
        const wardMap = Object.fromEntries(wards.map((w) => [w.name, w.id]));

        if (Object.keys(byEmail).length < customerEmails.length || Object.keys(bySlug).length < shopSlugs.length) {
            throw new Error('Thiếu user hoặc shop để seed orders (customer1-2, seller1-2, seller-one/two-shop).');
        }

        if (Object.keys(productMap).length < productSlugs.length) {
            throw new Error('Thiếu products để seed order_items (nha-gia-kim, ao-polo-coolmate, macbook-air-m2).');
        }

        const rows = [
            {
                user_id: byEmail['customer1@example.com'],
                shop_id: bySlug['seller-one-shop'],
                code: 'OD20251220-0001',
                status: 'pending',
                payment_method_id: 1,
                payment_status: 'unpaid',
                item_count: 2,
                subtotal_amount: 350000,
                shipping_fee: 30000,
                discount_amount: 20000,
                total_amount: 360000,
                note: 'Giao giờ hành chính',
                created_at: now,
                updated_at: now,
            },
            {
                user_id: byEmail['customer2@example.com'],
                shop_id: bySlug['seller-two-shop'],
                code: 'OD20251220-0002',
                status: 'confirmed',
                payment_method_id: 2,
                payment_status: 'paid',
                item_count: 1,
                subtotal_amount: 26990000,
                shipping_fee: 0,
                discount_amount: 0,
                total_amount: 26990000,
                note: 'Giao nhanh trong ngày',
                created_at: now,
                updated_at: now,
            },
        ];

        await queryInterface.bulkInsert('orders', rows, {});

        const orders = await queryInterface.sequelize.query(
            `SELECT id, code FROM orders WHERE code IN (:codes)`,
            { replacements: { codes: rows.map((r) => r.code) }, type: Sequelize.QueryTypes.SELECT },
        );
        const byCode = Object.fromEntries(orders.map((o) => [o.code, o.id]));

        const items = [
            {
                order_id: byCode['OD20251220-0001'],
                product_id: productMap['nha-gia-kim'],
                product_name: 'Nhà Giả Kim (Tái Bản)',
                sku_id: stockMap['BOOK-SOFT'] ?? null,
                sku_name: stockMap['BOOK-SOFT'] ? 'BOOK-SOFT' : null,
                quantity: 1,
                unit_price: 79000,
                line_discount: 0,
                line_total: 79000,
                created_at: now,
            },
            {
                order_id: byCode['OD20251220-0001'],
                product_id: productMap['ao-polo-coolmate'],
                product_name: 'Áo Polo Nam Coolmate Basic',
                sku_id: stockMap['POLO-NV-L'] ?? null,
                sku_name: stockMap['POLO-NV-L'] ? 'POLO-NV-L' : null,
                quantity: 1,
                unit_price: 299000,
                line_discount: 20000,
                line_total: 279000,
                created_at: now,
            },
            {
                order_id: byCode['OD20251220-0002'],
                product_id: productMap['macbook-air-m2'],
                product_name: 'MacBook Air M2 2024',
                sku_id: stockMap['MAC-8-256'] ?? null,
                sku_name: stockMap['MAC-8-256'] ? 'MAC-8-256' : null,
                quantity: 1,
                unit_price: 26990000,
                line_discount: 0,
                line_total: 26990000,
                created_at: now,
            },
        ].filter((i) => i.order_id);

        if (items.length) {
            await queryInterface.bulkInsert('order_items', items, {});
        }

        const historyRows = [
            {
                order_id: byCode['OD20251220-0001'],
                old_status: null,
                new_status: 'pending',
                changed_by_user_id: byEmail['customer1@example.com'],
                changed_by_role: 'customer',
                reason: null,
                created_at: now,
            },
            {
                order_id: byCode['OD20251220-0002'],
                old_status: null,
                new_status: 'pending',
                changed_by_user_id: byEmail['customer2@example.com'],
                changed_by_role: 'customer',
                reason: null,
                created_at: now,
            },
            {
                order_id: byCode['OD20251220-0002'],
                old_status: 'pending',
                new_status: 'confirmed',
                changed_by_user_id: byEmail['seller2@example.com'],
                changed_by_role: 'seller',
                reason: 'Shop confirmed order',
                created_at: now,
            },
        ].filter((h) => h.order_id);

        if (historyRows.length) {
            await queryInterface.bulkInsert('order_status_history', historyRows, {});
        }

        const addressRows = [
            {
                order_id: byCode['OD20251220-0001'],
                ward_id: wardMap['Cầu Giấy'],
                type: 'shipping',
                receiver_name: 'Charlie Customer',
                receiver_phone: '5551234567',
                address_line: '123 Đường ABC, Cầu Giấy',
                created_at: now,
            },
            {
                order_id: byCode['OD20251220-0002'],
                ward_id: wardMap['Bến Thành'],
                type: 'shipping',
                receiver_name: 'Daisy Customer',
                receiver_phone: '5559876543',
                address_line: '456 Đường XYZ, Bến Thành',
                created_at: now,
            },
        ].filter((a) => a.order_id && a.ward_id);

        if (addressRows.length) {
            await queryInterface.bulkInsert('order_addresses', addressRows, {});
        }

        const payments = [
            {
                order_id: byCode['OD20251220-0001'],
                payment_method_id: 1,
                status: 'pending',
                amount: 360000,
                transaction_code: null,
                raw_payload: null,
                paid_at: null,
                created_at: now,
                updated_at: now,
            },
            {
                order_id: byCode['OD20251220-0002'],
                payment_method_id: 2,
                status: 'success',
                amount: 26990000,
                transaction_code: 'VNPAY-TXN-0002',
                raw_payload: JSON.stringify({ bank: 'VCB', channel: 'VNPAY', ref: '0002' }),
                paid_at: now,
                created_at: now,
                updated_at: now,
            },
        ].filter((p) => p.order_id);

        if (payments.length) {
            await queryInterface.bulkInsert('payments', payments, {});
        }

        const shipments = [
            {
                order_id: byCode['OD20251220-0001'],
                tracking_code: 'SHIP-0001',
                status: 'pending_pickup',
                fee: 30000,
                cod_amount: 360000,
                shipped_at: null,
                delivered_at: null,
                estimated_delivery_date: now.toISOString().slice(0, 10),
                created_at: now,
                updated_at: now,
            },
            {
                order_id: byCode['OD20251220-0002'],
                tracking_code: 'SHIP-0002',
                status: 'out_for_delivery',
                fee: 0,
                cod_amount: 0,
                shipped_at: now,
                delivered_at: null,
                estimated_delivery_date: now.toISOString().slice(0, 10),
                created_at: now,
                updated_at: now,
            },
        ].filter((s) => s.order_id);

        if (shipments.length) {
            await queryInterface.bulkInsert('shipments', shipments, {});
        }
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(
            `DELETE FROM shipments WHERE order_id IN (SELECT id FROM orders WHERE code IN ('OD20251220-0001','OD20251220-0002'))`,
        );
        await queryInterface.sequelize.query(
            `DELETE FROM order_addresses WHERE order_id IN (SELECT id FROM orders WHERE code IN ('OD20251220-0001','OD20251220-0002'))`,
        );
        await queryInterface.sequelize.query(
            `DELETE FROM payments WHERE order_id IN (SELECT id FROM orders WHERE code IN ('OD20251220-0001','OD20251220-0002'))`,
        );
        await queryInterface.sequelize.query(
            `DELETE FROM order_status_history WHERE order_id IN (SELECT id FROM orders WHERE code IN ('OD20251220-0001','OD20251220-0002'))`,
        );
        await queryInterface.sequelize.query(
            `DELETE FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE code IN ('OD20251220-0001','OD20251220-0002'))`,
        );
        await queryInterface.bulkDelete(
            'orders',
            { code: ['OD20251220-0001', 'OD20251220-0002'] },
            {},
        );

        await queryInterface.bulkDelete('payment_methods', { id: [1, 2, 3] }, {});
    },
};
