'use strict';

const DATA = [
    // ===== Lạng Sơn (20) =====
    { code: '06415', name: 'Vân Nham', province_code: '20' },
    { code: '06427', name: 'Cai Kinh', province_code: '20' },
    { code: '06436', name: 'Thiện Tân', province_code: '20' },
    { code: '06445', name: 'Tân Thành', province_code: '20' },
    { code: '06457', name: 'Tuấn Sơn', province_code: '20' },
    { code: '06463', name: 'Chi Lăng', province_code: '20' },
    { code: '06475', name: 'Bằng Mạc', province_code: '20' },
    { code: '06481', name: 'Chiến Thắng', province_code: '20' },
    { code: '06496', name: 'Nhân Lý', province_code: '20' },
    { code: '06505', name: 'Vạn Linh', province_code: '20' },
    { code: '06517', name: 'Quan Sơn', province_code: '20' },
    { code: '06526', name: 'Na Dương', province_code: '20' },
    { code: '06529', name: 'Lộc Bình', province_code: '20' },
    { code: '06541', name: 'Mẫu Sơn', province_code: '20' },
    { code: '06565', name: 'Khuất Xá', province_code: '20' },
    { code: '06577', name: 'Thống Nhất', province_code: '20' },
    { code: '06601', name: 'Lợi Bác', province_code: '20' },
    { code: '06607', name: 'Xuân Dương', province_code: '20' },
    { code: '06613', name: 'Đình Lập', province_code: '20' },
    { code: '06616', name: 'Thái Bình', province_code: '20' },
    { code: '06625', name: 'Kiên Mộc', province_code: '20' },
    { code: '06637', name: 'Châu Sơn', province_code: '20' },

    // ===== Quảng Ninh (22) =====
    { code: '06652', name: 'Hà Tu', province_code: '22' },
    { code: '06658', name: 'Cao Xanh', province_code: '22' },
    { code: '06661', name: 'Việt Hưng', province_code: '22' },
    { code: '06673', name: 'Bãi Cháy', province_code: '22' },
    { code: '06676', name: 'Hà Lầm', province_code: '22' },
    { code: '06685', name: 'Hồng Gai', province_code: '22' },
    { code: '06688', name: 'Hạ Long', province_code: '22' },
    { code: '06706', name: 'Tuần Châu', province_code: '22' },
    { code: '06709', name: 'Móng Cái 2', province_code: '22' },
    { code: '06712', name: 'Móng Cái 1', province_code: '22' },
    { code: '06736', name: 'Móng Cái 3', province_code: '22' },
    { code: '06760', name: 'Mông Dương', province_code: '22' },
    { code: '06778', name: 'Quang Hanh', province_code: '22' },
    { code: '06781', name: 'Cửa Ông', province_code: '22' },
    { code: '06793', name: 'Cẩm Phả', province_code: '22' },
    { code: '06811', name: 'Uông Bí', province_code: '22' },
    { code: '06820', name: 'Vàng Danh', province_code: '22' },
    { code: '06832', name: 'Yên Tử', province_code: '22' },
    { code: '07030', name: 'Hoành Bồ', province_code: '22' },
    { code: '07069', name: 'Mạo Khê', province_code: '22' },
    { code: '07081', name: 'Bình Khê', province_code: '22' },
    { code: '07090', name: 'An Sinh', province_code: '22' },
    { code: '07093', name: 'Đông Triều', province_code: '22' },
    { code: '07114', name: 'Hoàng Quế', province_code: '22' },
    { code: '07132', name: 'Quảng Yên', province_code: '22' },
    { code: '07135', name: 'Đông Mai', province_code: '22' },
    { code: '07147', name: 'Hiệp Hòa', province_code: '22' },
    { code: '07168', name: 'Hà An', province_code: '22' },
    { code: '07180', name: 'Liên Hòa', province_code: '22' },
    { code: '07183', name: 'Phong Cốc', province_code: '22' },

    // Quảng Ninh – xã (Commune)
    { code: '06724', name: 'Hải Sơn', province_code: '22' },
    { code: '06733', name: 'Hải Ninh', province_code: '22' },
    { code: '06757', name: 'Vĩnh Thực', province_code: '22' },
    { code: '06799', name: 'Hải Hòa', province_code: '22' },
    { code: '06838', name: 'Bình Liêu', province_code: '22' },
    { code: '06841', name: 'Hoành Mô', province_code: '22' },
    { code: '06856', name: 'Lục Hồn', province_code: '22' },
    { code: '06862', name: 'Tiên Yên', province_code: '22' },
    { code: '06874', name: 'Điền Xá', province_code: '22' },
    { code: '06877', name: 'Đông Ngũ', province_code: '22' },
    { code: '06886', name: 'Hải Lạng', province_code: '22' },
    { code: '06895', name: 'Đầm Hà', province_code: '22' },
    { code: '06913', name: 'Quảng Tân', province_code: '22' },
    { code: '06922', name: 'Quảng Hà', province_code: '22' },
    { code: '06931', name: 'Quảng Đức', province_code: '22' },
    { code: '06946', name: 'Đường Hoa', province_code: '22' },
    { code: '06967', name: 'Cái Chiên', province_code: '22' },
    { code: '06978', name: 'Ba Chẽ', province_code: '22' },
    { code: '06979', name: 'Kỳ Thượng', province_code: '22' },
    { code: '06985', name: 'Lương Minh', province_code: '22' },
    { code: '07054', name: 'Quảng La', province_code: '22' },
    { code: '07060', name: 'Thống Nhất', province_code: '22' },

    // Quảng Ninh – đặc khu (ghi chú: vẫn lưu vào wards như bình thường)
    { code: '06994', name: 'Vân Đồn', province_code: '22' },
    { code: '07192', name: 'Cô Tô', province_code: '22' },

    // ===== Bắc Giang / Bắc Ninh (24) =====
    // Phường
    { code: '07210', name: 'Bắc Giang', province_code: '24' },
    { code: '07228', name: 'Đa Mai', province_code: '24' },
    { code: '07525', name: 'Chũ', province_code: '24' },
    { code: '07612', name: 'Phượng Sơn', province_code: '24' },
    { code: '07681', name: 'Yên Dũng', province_code: '24' },
    { code: '07682', name: 'Tân An', province_code: '24' },
    { code: '07696', name: 'Tiền Phong', province_code: '24' },
    { code: '07699', name: 'Tân Tiến', province_code: '24' },
    { code: '07738', name: 'Cảnh Thụy', province_code: '24' },
    { code: '07774', name: 'Tự Lạn', province_code: '24' },
    { code: '07777', name: 'Việt Yên', province_code: '24' },
    { code: '07795', name: 'Nếnh', province_code: '24' },
    { code: '07798', name: 'Vân Hà', province_code: '24' },
    { code: '09169', name: 'Vũ Ninh', province_code: '24' },
    { code: '09187', name: 'Kinh Bắc', province_code: '24' },
    { code: '09190', name: 'Võ Cường', province_code: '24' },
    { code: '09247', name: 'Quế Võ', province_code: '24' },
    { code: '09253', name: 'Nhân Hòa', province_code: '24' },
    { code: '09265', name: 'Phương Liễu', province_code: '24' },
    { code: '09286', name: 'Nam Sơn', province_code: '24' },
    { code: '09295', name: 'Bồng Lai', province_code: '24' },
    { code: '09301', name: 'Đào Viên', province_code: '24' },
    { code: '09325', name: 'Hạp Lĩnh', province_code: '24' },
    { code: '09367', name: 'Từ Sơn', province_code: '24' },
    { code: '09370', name: 'Tam Sơn', province_code: '24' },
    { code: '09379', name: 'Phù Khê', province_code: '24' },
    { code: '09385', name: 'Đồng Nguyên', province_code: '24' },
    { code: '09400', name: 'Thuận Thành', province_code: '24' },
    { code: '09409', name: 'Mão Điền', province_code: '24' },
    { code: '09427', name: 'Trí Quả', province_code: '24' },
    { code: '09430', name: 'Trạm Lộ', province_code: '24' },
    { code: '09433', name: 'Song Liễu', province_code: '24' },
    { code: '09445', name: 'Ninh Xá', province_code: '24' },

    // Xã
    { code: '07246', name: 'Xuân Lương', province_code: '24' },
    { code: '07264', name: 'Tam Tiến', province_code: '24' },
    { code: '07282', name: 'Đồng Kỳ', province_code: '24' },
    { code: '07288', name: 'Yên Thế', province_code: '24' },
    { code: '07294', name: 'Bố Hạ', province_code: '24' },
    { code: '07306', name: 'Nhã Nam', province_code: '24' },
    { code: '07330', name: 'Phúc Hòa', province_code: '24' },
    { code: '07333', name: 'Quang Trung', province_code: '24' },
    { code: '07339', name: 'Tân Yên', province_code: '24' },
    { code: '07351', name: 'Ngọc Thiện', province_code: '24' },
    { code: '07375', name: 'Lạng Giang', province_code: '24' },
    { code: '07381', name: 'Tiên Lục', province_code: '24' },
    { code: '07399', name: 'Kép', province_code: '24' },
    { code: '07432', name: 'Tân Dĩnh', province_code: '24' },
    { code: '07444', name: 'Lục Nam', province_code: '24' },
    { code: '07450', name: 'Đông Phú', province_code: '24' },
    { code: '07462', name: 'Bảo Đài', province_code: '24' },
    { code: '07486', name: 'Nghĩa Phương', province_code: '24' },
    { code: '07489', name: 'Trường Sơn', province_code: '24' },
    { code: '07492', name: 'Lục Sơn', province_code: '24' },
    { code: '07498', name: 'Bắc Lũng', province_code: '24' },
    { code: '07519', name: 'Cẩm Lý', province_code: '24' },
    { code: '07531', name: 'Tân Sơn', province_code: '24' },
    { code: '07534', name: 'Sa Lý', province_code: '24' },
    { code: '07537', name: 'Biên Sơn', province_code: '24' },
    { code: '07543', name: 'Sơn Hải', province_code: '24' },
    { code: '07552', name: 'Kiên Lao', province_code: '24' },
    { code: '07573', name: 'Biển Động', province_code: '24' },
    { code: '07582', name: 'Lục Ngạn', province_code: '24' },
    { code: '07594', name: 'Đèo Gia', province_code: '24' },
    { code: '07603', name: 'Nam Dương', province_code: '24' },
    { code: '07615', name: 'Sơn Động', province_code: '24' },
    { code: '07616', name: 'Tây Yên Tử', province_code: '24' },
    { code: '07621', name: 'Vân Sơn', province_code: '24' },
    { code: '07627', name: 'Đại Sơn', province_code: '24' },
    { code: '07642', name: 'Yên Định', province_code: '24' },
    { code: '07654', name: 'An Lạc', province_code: '24' },
    { code: '07663', name: 'Tuấn Đạo', province_code: '24' },
    { code: '07672', name: 'Dương Hưu', province_code: '24' },
    { code: '07735', name: 'Đồng Việt', province_code: '24' },
    { code: '07822', name: 'Hoàng Vân', province_code: '24' },
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

        // Guard: thiếu province_id nào thì fail sớm
        for (const d of DATA) {
            if (!idByCode[d.province_code]) {
                throw new Error(`[seed wards-part6] Missing province_id for code=${d.province_code}`);
            }
        }

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
