'use strict';

const provinces = [
    { code: '01', name: 'Hà Nội' },
    { code: '04', name: 'Cao Bằng' },
    { code: '08', name: 'Tuyên Quang' },
    { code: '11', name: 'Điện Biên' },
    { code: '12', name: 'Lai Châu' },
    { code: '14', name: 'Sơn La' },
    { code: '15', name: 'Lào Cai' },
    { code: '19', name: 'Thái Nguyên' },
    { code: '20', name: 'Lạng Sơn' },
    { code: '22', name: 'Quảng Ninh' },
    { code: '24', name: 'Bắc Ninh' },
    { code: '25', name: 'Phú Thọ' },
    { code: '31', name: 'Hải Phòng' },
    { code: '33', name: 'Hưng Yên' },
    { code: '37', name: 'Ninh Bình' },
    { code: '38', name: 'Thanh Hóa' },
    { code: '40', name: 'Nghệ An' },
    { code: '42', name: 'Hà Tĩnh' },
    { code: '44', name: 'Quảng Trị' },
    { code: '46', name: 'Thừa Thiên Huế' },
    { code: '48', name: 'Đà Nẵng' },
    { code: '51', name: 'Quảng Ngãi' },
    { code: '52', name: 'Gia Lai' },
    { code: '56', name: 'Khánh Hòa' },
    { code: '66', name: 'Đắk Lắk' },
    { code: '68', name: 'Lâm Đồng' },
    { code: '75', name: 'Đồng Nai' },
    { code: '79', name: 'Hồ Chí Minh' },
    { code: '80', name: 'Tây Ninh' },
    { code: '82', name: 'Đồng Tháp' },
    { code: '86', name: 'Vĩnh Long' },
    { code: '91', name: 'An Giang' },
    { code: '92', name: 'Cần Thơ' },
    { code: '96', name: 'Cà Mau' },
];

const provinceCodes = provinces.map((p) => p.code);

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        const now = new Date();
        const rows = provinces.map((p) => ({ ...p, created_at: now, updated_at: now }));

        await queryInterface.bulkInsert('provinces', rows, {
            updateOnDuplicate: ['name', 'updated_at'],
            upsertKeys: ['code'], // needed for Postgres conflict target
        });
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('provinces', { code: provinceCodes });
    },
};
