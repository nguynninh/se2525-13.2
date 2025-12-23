'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();

        const customerEmails = ['customer1@example.com', 'customer2@example.com', 'customer3@example.com'];
        const shopSlugs = ['seller-one-shop', 'seller-two-shop'];

        const users = await queryInterface.sequelize.query(`SELECT id, email FROM users WHERE email IN (:emails)`, {
            replacements: { emails: customerEmails },
            type: Sequelize.QueryTypes.SELECT,
        });
        const shops = await queryInterface.sequelize.query(`SELECT id, slug FROM shops WHERE slug IN (:slugs)`, {
            replacements: { slugs: shopSlugs },
            type: Sequelize.QueryTypes.SELECT,
        });

        const byEmail = Object.fromEntries(users.map((u) => [u.email, u.id]));
        const bySlug = Object.fromEntries(shops.map((s) => [s.slug, s.id]));

        const rows = [
            { user_id: byEmail['customer1@example.com'], shop_id: bySlug['seller-one-shop'] },
            { user_id: byEmail['customer2@example.com'], shop_id: bySlug['seller-one-shop'] },
            { user_id: byEmail['customer2@example.com'], shop_id: bySlug['seller-two-shop'] },
            { user_id: byEmail['customer3@example.com'], shop_id: bySlug['seller-two-shop'] },
        ].map((r) => ({ ...r, created_at: now, updated_at: now }));

        await queryInterface.bulkInsert('favorite_shops', rows, {});
    },

    async down(queryInterface, Sequelize) {
        const customerEmails = ['customer1@example.com', 'customer2@example.com', 'customer3@example.com'];
        const shopSlugs = ['seller-one-shop', 'seller-two-shop'];

        const users = await queryInterface.sequelize.query(`SELECT id, email FROM users WHERE email IN (:emails)`, {
            replacements: { emails: customerEmails },
            type: Sequelize.QueryTypes.SELECT,
        });
        const shops = await queryInterface.sequelize.query(`SELECT id, slug FROM shops WHERE slug IN (:slugs)`, {
            replacements: { slugs: shopSlugs },
            type: Sequelize.QueryTypes.SELECT,
        });

        const byEmail = Object.fromEntries(users.map((u) => [u.email, u.id]));
        const bySlug = Object.fromEntries(shops.map((s) => [s.slug, s.id]));

        const pairs = [
            [byEmail['customer1@example.com'], bySlug['seller-one-shop']],
            [byEmail['customer2@example.com'], bySlug['seller-one-shop']],
            [byEmail['customer2@example.com'], bySlug['seller-two-shop']],
            [byEmail['customer3@example.com'], bySlug['seller-two-shop']],
        ].filter((p) => p[0] && p[1]);

        if (!pairs.length) return;

        const tupleList = pairs.map((_, idx) => `(:u${idx}, :s${idx})`).join(', ');
        const replacements = Object.fromEntries(
            pairs.flatMap((p, idx) => [
                [`u${idx}`, p[0]],
                [`s${idx}`, p[1]],
            ]),
        );

        await queryInterface.sequelize.query(`DELETE FROM favorite_shops WHERE (user_id, shop_id) IN (${tupleList})`, {
            replacements,
        });
    },
};
