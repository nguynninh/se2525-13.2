'use strict';

/** @type {import('sequelize-cli').Migration} */

const TARGETS = [
    { province: 'Hà Nội', ward: 'Cầu Giấy', line: '123 Cầu Giấy' },
    { province: 'Hồ Chí Minh', ward: 'Bến Thành', line: '246 Phan Chu Trinh' },
    { province: 'Hà Nội', ward: 'Tây Hồ', line: '789 Lake View' },
    { province: 'Hà Nội', ward: 'Long Biên', line: '101 River Side' },
];

// Lines used in older versions of this seeder (cleanup support on reset)
const LEGACY_LINES = [
    '123 Sample Street',
    '456 Market Road',
    '789 Lake View',
    '101 River Side',
    '202 Hill Top',
    '303 Green Park',
    '404 Sunset Blvd',
    '505 Sunrise Ave',
];

module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();

        const provinces = [...new Set(TARGETS.map((t) => t.province))];
        const wardNames = [...new Set(TARGETS.map((t) => t.ward))];

        const wardRows = await queryInterface.sequelize.query(
            `
            SELECT w.id, w.name AS ward_name, p.name AS province_name
            FROM wards w
            JOIN provinces p ON p.id = w.province_id
            WHERE p.name IN (:provinces) AND w.name IN (:wardNames)
            `,
            {
                replacements: { provinces, wardNames },
                type: Sequelize.QueryTypes.SELECT,
            },
        );

        const wardIdByKey = new Map();
        for (const w of wardRows) {
            wardIdByKey.set(`${w.province_name}|${w.ward_name}`, w.id);
        }

        for (const t of TARGETS) {
            if (!wardIdByKey.has(`${t.province}|${t.ward}`)) {
                throw new Error(
                    `Missing ward '${t.ward}' in province '${t.province}'. Seed wards (including Bến Thành) before addresses.`,
                );
            }
        }

        const rows = TARGETS.map((t) => ({
            id: Sequelize.literal('gen_random_uuid()'),
            address_line: t.line,
            ward_id: wardIdByKey.get(`${t.province}|${t.ward}`),
            created_at: now,
            updated_at: now,
        }));

        await queryInterface.bulkInsert('addresses', rows, {});
    },

    async down(queryInterface, Sequelize) {
        // For reset: simply remove all shipping_addresses then addresses to avoid FK issues with wards
        await queryInterface.bulkDelete('shipping_addresses', {}, {});
        await queryInterface.bulkDelete('addresses', {}, {});
    },
};
