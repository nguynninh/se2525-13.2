'use strict';

/** @type {import('sequelize-cli').Migration} */

const SAMPLE_ADDRESSES = [
    { key: 'Hà Nội|Cầu Giấy', line: '123 Cầu Giấy' },
    { key: 'Hà Nội|Cầu Giấy', line: '456 Trần Duy Hưng' },
    { key: 'Hà Nội|Đống Đa', line: '78 Chùa Bộc' },
    { key: 'Hà Nội|Thanh Xuân', line: '99 Nguyễn Trãi' },

    { key: 'Hồ Chí Minh|Bến Thành', line: '135 Lê Lợi' },
    { key: 'Hồ Chí Minh|Bến Thành', line: '246 Phan Chu Trinh' },
    { key: 'Hồ Chí Minh|Tân Mỹ', line: '57 Tân Mỹ' },
    { key: 'Hồ Chí Minh|Tân Mỹ', line: '210 Nguyễn Văn Linh' },
];

module.exports = {
    async up(queryInterface, Sequelize) {
        const [wards] = await queryInterface.sequelize.query(`
            SELECT
                w.id   AS ward_id,
                w.name AS ward_name,
                p.name AS province_name
            FROM wards w
            JOIN provinces p ON w.province_id = p.id
            WHERE
                (p.name = 'Hà Nội' AND w.name IN ('Cầu Giấy', 'Đống Đa', 'Thanh Xuân'))
                OR
                (p.name = 'Hồ Chí Minh' AND w.name IN ('Bến Thành', 'Tân Mỹ'))
        `);

        const wardMap = new Map();
        for (const w of wards) {
            const key = `${w.province_name}|${w.ward_name}`;
            wardMap.set(key, w.ward_id);
        }

        for (const { key } of SAMPLE_ADDRESSES) {
            if (!wardMap.has(key)) {
                throw new Error(
                    `Không tìm thấy ward '${key}' trong bảng wards. ` +
                        `Kiểm tra lại seed/import provinces/wards (tên có thể khác, ví dụ thiếu dấu hoặc khác chính tả).`,
                );
            }
        }

        const now = new Date();
        const rows = SAMPLE_ADDRESSES.map(({ key, line }) => {
            const wardId = wardMap.get(key);
            return {
                id: Sequelize.literal('gen_random_uuid()'),
                address_line: line,
                ward_id: wardId,
                created_at: now,
                updated_at: now,
            };
        });

        await queryInterface.bulkInsert('addresses', rows, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete(
            'addresses',
            {
                address_line: {
                    [Sequelize.Op.in]: SAMPLE_ADDRESSES.map((a) => a.line),
                },
            },
            {},
        );
    },
};
