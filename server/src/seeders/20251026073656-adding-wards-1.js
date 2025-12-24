'use strict';

/** @type {import('sequelize-cli').Migration} */

const DATA = [
    { code: '00004', name: 'Ba Đình', province_code: '01' },
    { code: '00008', name: 'Ngọc Hà', province_code: '01' },
    { code: '00025', name: 'Giảng Võ', province_code: '01' },
    { code: '00070', name: 'Hoàn Kiếm', province_code: '01' },
    { code: '00082', name: 'Cửa Nam', province_code: '01' },
    { code: '00091', name: 'Phú Thượng', province_code: '01' },
    { code: '00097', name: 'Hồng Hà', province_code: '01' },
    { code: '00103', name: 'Tây Hồ', province_code: '01' },
    { code: '00118', name: 'Bồ Đề', province_code: '01' },
    { code: '00127', name: 'Việt Hưng', province_code: '01' },
    { code: '00136', name: 'Phúc Lợi', province_code: '01' },
    { code: '00145', name: 'Long Biên', province_code: '01' },
    { code: '00160', name: 'Nghĩa Đô', province_code: '01' },
    { code: '00166', name: 'Cầu Giấy', province_code: '01' },
    { code: '00175', name: 'Yên Hòa', province_code: '01' },
    { code: '00190', name: 'Ô Chợ Dừa', province_code: '01' },
    { code: '00199', name: 'Láng', province_code: '01' },
    { code: '00226', name: 'Văn Miếu - Quốc Tử Giám', province_code: '01' },
    { code: '00229', name: 'Kim Liên', province_code: '01' },
    { code: '00235', name: 'Đống Đa', province_code: '01' },
    { code: '00256', name: 'Hai Bà Trưng', province_code: '01' },
    { code: '00283', name: 'Vĩnh Tuy', province_code: '01' },
    { code: '00292', name: 'Bạch Mai', province_code: '01' },
    { code: '00301', name: 'Vĩnh Hưng', province_code: '01' },
    { code: '00316', name: 'Định Công', province_code: '01' },
    { code: '00322', name: 'Tương Mai', province_code: '01' },
    { code: '00328', name: 'Lĩnh Nam', province_code: '01' },
    { code: '00331', name: 'Hoàng Mai', province_code: '01' },
    { code: '00337', name: 'Hoàng Liệt', province_code: '01' },
    { code: '00340', name: 'Yên Sở', province_code: '01' },
    // Extra ward for Hồ Chí Minh (needed by shop seeder)
    { code: 'HCM001', name: 'Bến Thành', province_code: '79' },
];

module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();

        const provinceCodes = [...new Set(DATA.map((d) => d.province_code))];
        const rows = await queryInterface.sequelize.query(`SELECT id, code FROM provinces WHERE code IN (:codes)`, {
            replacements: { codes: provinceCodes },
            type: Sequelize.QueryTypes.SELECT,
        });
        const idByCode = Object.fromEntries(rows.map((r) => [String(r.code), r.id]));

        const payload = DATA.map((d) => ({
            code: d.code,
            name: d.name,
            province_id: idByCode[d.province_code],
            created_at: now,
            updated_at: now,
        })).filter((d) => d.province_id);

        if (payload.length === 0) return;

        await queryInterface.bulkInsert('wards', payload, { ignoreDuplicates: true });
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('wards', { code: DATA.map((d) => d.code) });
    },
};
