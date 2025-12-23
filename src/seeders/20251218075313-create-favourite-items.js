'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();

        const customerEmails = ['customer1@example.com', 'customer2@example.com'];
        const productSlugs = ['nha-gia-kim', 'ao-polo-coolmate', 'macbook-air-m2'];

        const users = await queryInterface.sequelize.query(`SELECT id, email FROM users WHERE email IN (:emails)`, {
            replacements: { emails: customerEmails },
            type: Sequelize.QueryTypes.SELECT,
        });

        const products = await queryInterface.sequelize.query(`SELECT id, slug FROM products WHERE slug IN (:slugs)`, {
            replacements: { slugs: productSlugs },
            type: Sequelize.QueryTypes.SELECT,
        });

        const byEmail = Object.fromEntries(users.map((u) => [u.email, u.id]));
        const bySlug = Object.fromEntries(products.map((p) => [p.slug, p.id]));

        const rows = [
            { user_id: byEmail['customer1@example.com'], product_id: bySlug['nha-gia-kim'] },
            { user_id: byEmail['customer1@example.com'], product_id: bySlug['ao-polo-coolmate'] },
            { user_id: byEmail['customer2@example.com'], product_id: bySlug['macbook-air-m2'] },
            { user_id: byEmail['customer2@example.com'], product_id: bySlug['nha-gia-kim'] },
        ].map((r) => ({ ...r, created_at: now, updated_at: now }));

        await queryInterface.bulkInsert('favorite_items', rows, {});
    },

    async down(queryInterface, Sequelize) {
        const customerEmails = ['customer1@example.com', 'customer2@example.com'];
        const productSlugs = ['nha-gia-kim', 'ao-polo-coolmate', 'macbook-air-m2'];

        const users = await queryInterface.sequelize.query(`SELECT id, email FROM users WHERE email IN (:emails)`, {
            replacements: { emails: customerEmails },
            type: Sequelize.QueryTypes.SELECT,
        });

        const products = await queryInterface.sequelize.query(`SELECT id, slug FROM products WHERE slug IN (:slugs)`, {
            replacements: { slugs: productSlugs },
            type: Sequelize.QueryTypes.SELECT,
        });

        const byEmail = Object.fromEntries(users.map((u) => [u.email, u.id]));
        const bySlug = Object.fromEntries(products.map((p) => [p.slug, p.id]));

        const pairs = [
            [byEmail['customer1@example.com'], bySlug['nha-gia-kim']],
            [byEmail['customer1@example.com'], bySlug['ao-polo-coolmate']],
            [byEmail['customer2@example.com'], bySlug['macbook-air-m2']],
            [byEmail['customer2@example.com'], bySlug['nha-gia-kim']],
        ].filter((p) => p[0] && p[1]);

        if (!pairs.length) return;

        const tupleList = pairs.map((_, idx) => `(:u${idx}, :p${idx})`).join(', ');
        const replacements = Object.fromEntries(
            pairs.flatMap((p, idx) => [
                [`u${idx}`, p[0]],
                [`p${idx}`, p[1]],
            ]),
        );

        await queryInterface.sequelize.query(
            `DELETE FROM favorite_items WHERE (user_id, product_id) IN (${tupleList})`,
            { replacements },
        );
    },
};
