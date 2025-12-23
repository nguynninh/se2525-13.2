'use strict';

const DATA = [
    // code, name, province_code
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
    { code: '00352', name: 'Phương Liệt', province_code: '01' },
    { code: '00364', name: 'Khương Đình', province_code: '01' },
    { code: '00367', name: 'Thanh Xuân', province_code: '01' },
    { code: '00592', name: 'Từ Liêm', province_code: '01' },
    { code: '00598', name: 'Thượng Cát', province_code: '01' },
    { code: '00602', name: 'Đông Ngạc', province_code: '01' },
    { code: '00611', name: 'Xuân Đỉnh', province_code: '01' },
    { code: '00613', name: 'Tây Tựu', province_code: '01' },
    { code: '00619', name: 'Phú Diễn', province_code: '01' },
    { code: '00622', name: 'Xuân Phương', province_code: '01' },
    { code: '00634', name: 'Tây Mỗ', province_code: '01' },
    { code: '00637', name: 'Đại Mỗ', province_code: '01' },
    { code: '00643', name: 'Thanh Liệt', province_code: '01' },
    { code: '09552', name: 'Kiến Hưng', province_code: '01' },
    { code: '09556', name: 'Hà Đông', province_code: '01' },
    { code: '09562', name: 'Yên Nghĩa', province_code: '01' },
    { code: '09568', name: 'Phú Lương', province_code: '01' },
    { code: '09574', name: 'Sơn Tây', province_code: '01' },
    { code: '09604', name: 'Tùng Thiện', province_code: '01' },
    { code: '09886', name: 'Dương Nội', province_code: '01' },

    // Block 2
    { code: '10015', name: 'Chương Mỹ', province_code: '01' },
    { code: '00376', name: 'Sóc Sơn', province_code: '01' },
    { code: '00382', name: 'Kim Anh', province_code: '01' },
    { code: '00385', name: 'Trung Giã', province_code: '01' },
    { code: '00430', name: 'Đa Phúc', province_code: '01' },
    { code: '00433', name: 'Nội Bài', province_code: '01' },
    { code: '00454', name: 'Đông Anh', province_code: '01' },
    { code: '00466', name: 'Phúc Thịnh', province_code: '01' },
    { code: '00475', name: 'Thư Lâm', province_code: '01' },
    { code: '00493', name: 'Thiên Lộc', province_code: '01' },
    { code: '00508', name: 'Vĩnh Thanh', province_code: '01' },
    { code: '00541', name: 'Phù Đổng', province_code: '01' },
    { code: '00562', name: 'Thuận An', province_code: '01' },
    { code: '00565', name: 'Gia Lâm', province_code: '01' },
    { code: '00577', name: 'Bát Tràng', province_code: '01' },
    { code: '00640', name: 'Thanh Trì', province_code: '01' },
    { code: '00664', name: 'Đại Thanh', province_code: '01' },
    { code: '00679', name: 'Ngọc Hồi', province_code: '01' },
    { code: '00685', name: 'Nam Phù', province_code: '01' },
    { code: '04930', name: 'Yên Xuân', province_code: '01' },
    { code: '08974', name: 'Quang Minh', province_code: '01' },
    { code: '08980', name: 'Yên Lãng', province_code: '01' },
    { code: '08995', name: 'Tiến Thắng', province_code: '01' },
    { code: '09022', name: 'Mê Linh', province_code: '01' },
    { code: '09616', name: 'Đoài Phương', province_code: '01' },
    { code: '09619', name: 'Quảng Oai', province_code: '01' },
    { code: '09634', name: 'Cổ Đô', province_code: '01' },
    { code: '09661', name: 'Minh Châu', province_code: '01' },
    { code: '09664', name: 'Vật Lại', province_code: '01' },
    { code: '09676', name: 'Bất Bạt', province_code: '01' },
    { code: '09694', name: 'Suối Hai', province_code: '01' },
    { code: '09700', name: 'Ba Vì', province_code: '01' },
    { code: '09706', name: 'Yên Bài', province_code: '01' },
    { code: '09715', name: 'Phúc Thọ', province_code: '01' },
    { code: '09739', name: 'Phúc Lộc', province_code: '01' },
    { code: '09772', name: 'Hát Môn', province_code: '01' },
    { code: '09784', name: 'Đan Phượng', province_code: '01' },
    { code: '09787', name: 'Liên Minh', province_code: '01' },
    { code: '09817', name: 'Ô Diên', province_code: '01' },
    { code: '09832', name: 'Hoài Đức', province_code: '01' },
    { code: '09856', name: 'Dương Hòa', province_code: '01' },
    { code: '09871', name: 'Sơn Đồng', province_code: '01' },
    { code: '09877', name: 'An Khánh', province_code: '01' },
    { code: '09895', name: 'Quốc Oai', province_code: '01' },
    { code: '09910', name: 'Kiều Phú', province_code: '01' },
    { code: '09931', name: 'Hưng Đạo', province_code: '01' },
    { code: '09952', name: 'Phú Cát', province_code: '01' },
    { code: '09955', name: 'Thạch Thất', province_code: '01' },
    { code: '09982', name: 'Hạ Bằng', province_code: '01' },
    { code: '09988', name: 'Hòa Lạc', province_code: '01' },
];

module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();

        // Map provinces.code -> provinces.id
        const provinceCodes = [...new Set(DATA.map((d) => d.province_code))];
        const rows = await queryInterface.sequelize.query(`SELECT id, code FROM provinces WHERE code IN (:codes)`, {
            replacements: { codes: provinceCodes },
            type: Sequelize.QueryTypes.SELECT,
        });
        const idByCode = Object.fromEntries(rows.map((r) => [r.code, r.id]));

        // Validate đủ province_id
        for (const d of DATA) {
            if (!idByCode[d.province_code]) {
                throw new Error(`[seed wards] Missing province_id for code=${d.province_code}`);
            }
        }

        // Build payload cho bảng wards (đúng schema hiện tại)
        const payload = DATA.map((d) => ({
            code: d.code,
            name: d.name,
            province_id: idByCode[d.province_code],
            created_at: now,
            updated_at: now,
        }));

        await queryInterface.bulkInsert('wards', payload, {});
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('wards', {
            code: DATA.map((d) => d.code),
        });
    },
};
