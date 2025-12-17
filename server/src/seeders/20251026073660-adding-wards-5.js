'use strict';

const DATA = [
    // ===== (15) =====
    { code: '04636', name: 'Gia Hội', province_code: '15' },
    { code: '04651', name: 'Sơn Lương', province_code: '15' },
    { code: '04660', name: 'Liên Sơn', province_code: '15' },
    { code: '04672', name: 'Văn Chấn', province_code: '15' },
    { code: '04693', name: 'Cát Thịnh', province_code: '15' },
    { code: '04699', name: 'Chấn Thịnh', province_code: '15' },
    { code: '04705', name: 'Thượng Bằng La', province_code: '15' },
    { code: '04711', name: 'Nghĩa Tâm', province_code: '15' },
    { code: '04714', name: 'Yên Bình', province_code: '15' },
    { code: '04717', name: 'Thác Bà', province_code: '15' },
    { code: '04726', name: 'Cảm Nhân', province_code: '15' },
    { code: '04744', name: 'Yên Thành', province_code: '15' },
    { code: '04750', name: 'Bảo Ái', province_code: '15' },

    // ===== (19) =====
    { code: '01840', name: 'Đức Xuân', province_code: '19' },
    { code: '01843', name: 'Bắc Kạn', province_code: '19' },
    { code: '05443', name: 'Phan Đình Phùng', province_code: '19' },
    { code: '05455', name: 'Quyết Thắng', province_code: '19' },
    { code: '05467', name: 'Gia Sàng', province_code: '19' },
    { code: '05482', name: 'Quan Triều', province_code: '19' },
    { code: '05500', name: 'Tích Lương', province_code: '19' },
    { code: '05518', name: 'Sông Công', province_code: '19' },
    { code: '05528', name: 'Bách Quang', province_code: '19' },
    { code: '05533', name: 'Bá Xuyên', province_code: '19' },
    { code: '05710', name: 'Linh Sơn', province_code: '19' },
    { code: '05857', name: 'Phúc Thuận', province_code: '19' },
    { code: '05860', name: 'Phổ Yên', province_code: '19' },
    { code: '05890', name: 'Vạn Xuân', province_code: '19' },
    { code: '05899', name: 'Trung Thành', province_code: '19' },

    { code: '01849', name: 'Phong Quang', province_code: '19' },
    { code: '01864', name: 'Bằng Thành', province_code: '19' },
    { code: '01879', name: 'Cao Minh', province_code: '19' },
    { code: '01882', name: 'Nghiên Loan', province_code: '19' },
    { code: '01894', name: 'Phúc Lộc', province_code: '19' },
    { code: '01906', name: 'Ba Bể', province_code: '19' },
    { code: '01912', name: 'Chợ Rã', province_code: '19' },
    { code: '01921', name: 'Thượng Minh', province_code: '19' },
    { code: '01933', name: 'Đồng Phúc', province_code: '19' },
    { code: '01936', name: 'Nà Phặc', province_code: '19' },
    { code: '01942', name: 'Bằng Vân', province_code: '19' },
    { code: '01954', name: 'Ngân Sơn', province_code: '19' },
    { code: '01957', name: 'Thượng Quan', province_code: '19' },
    { code: '01960', name: 'Hiệp Lực', province_code: '19' },
    { code: '01969', name: 'Phủ Thông', province_code: '19' },
    { code: '01981', name: 'Vĩnh Thông', province_code: '19' },
    { code: '02008', name: 'Cẩm Giàng', province_code: '19' },

    // (24) – chỉ 1 dòng trong batch này
    { code: '07420', name: 'Mỹ Thái', province_code: '24' },

    // quay lại (19)
    { code: '02014', name: 'Bạch Thông', province_code: '19' },
    { code: '02020', name: 'Chợ Đồn', province_code: '19' },
    { code: '02026', name: 'Nam Cường', province_code: '19' },
    { code: '02038', name: 'Quảng Bạch', province_code: '19' },
    { code: '02044', name: 'Yên Thịnh', province_code: '19' },
    { code: '02071', name: 'Nghĩa Tá', province_code: '19' },
    { code: '02083', name: 'Yên Phong', province_code: '19' },
    { code: '02086', name: 'Chợ Mới', province_code: '19' },
    { code: '02101', name: 'Thanh Mai', province_code: '19' },
    { code: '02104', name: 'Tân Kỳ', province_code: '19' },
    { code: '02107', name: 'Thanh Thịnh', province_code: '19' },
    { code: '02116', name: 'Yên Bình', province_code: '19' },
    { code: '02143', name: 'Văn Lang', province_code: '19' },
    { code: '02152', name: 'Cường Lợi', province_code: '19' },
    { code: '02155', name: 'Na Rì', province_code: '19' },
    { code: '02176', name: 'Trần Phú', province_code: '19' },
    { code: '02185', name: 'Côn Minh', province_code: '19' },
    { code: '02191', name: 'Xuân Dương', province_code: '19' },

    { code: '05488', name: 'Đại Phúc', province_code: '19' },
    { code: '05503', name: 'Tân Cương', province_code: '19' },
    { code: '05542', name: 'Lam Vỹ', province_code: '19' },
    { code: '05551', name: 'Kim Phượng', province_code: '19' },
    { code: '05563', name: 'Phượng Tiến', province_code: '19' },
    { code: '05569', name: 'Định Hóa', province_code: '19' },
    { code: '05581', name: 'Trung Hội', province_code: '19' },
    { code: '05587', name: 'Bình Yên', province_code: '19' },
    { code: '05602', name: 'Phú Đình', province_code: '19' },
    { code: '05605', name: 'Bình Thành', province_code: '19' },
    { code: '05611', name: 'Phú Lương', province_code: '19' },
    { code: '05620', name: 'Yên Trạch', province_code: '19' },
    { code: '05632', name: 'Hợp Thành', province_code: '19' },
    { code: '05641', name: 'Vô Tranh', province_code: '19' },
    { code: '05662', name: 'Trại Cau', province_code: '19' },
    { code: '05665', name: 'Văn Lăng', province_code: '19' },
    { code: '05674', name: 'Quang Sơn', province_code: '19' },
    { code: '05680', name: 'Văn Hán', province_code: '19' },
    { code: '05692', name: 'Đồng Hỷ', province_code: '19' },
    { code: '05707', name: 'Nam Hòa', province_code: '19' },
    { code: '05716', name: 'Võ Nhai', province_code: '19' },
    { code: '05719', name: 'Sảng Mộc', province_code: '19' },
    { code: '05722', name: 'Nghinh Tường', province_code: '19' },
    { code: '05725', name: 'Thần Sa', province_code: '19' },
    { code: '05740', name: 'La Hiên', province_code: '19' },
    { code: '05746', name: 'Tràng Xá', province_code: '19' },
    { code: '05755', name: 'Dân Tiến', province_code: '19' },
    { code: '05773', name: 'Phú Xuyên', province_code: '19' },
    { code: '05776', name: 'Đức Lương', province_code: '19' },
    { code: '05788', name: 'Phú Lạc', province_code: '19' },
    { code: '05800', name: 'Phú Thịnh', province_code: '19' },
    { code: '05809', name: 'An Khánh', province_code: '19' },
    { code: '05818', name: 'La Bằng', province_code: '19' },
    { code: '05830', name: 'Đại Từ', province_code: '19' },
    { code: '05845', name: 'Vạn Phú', province_code: '19' },
    { code: '05851', name: 'Quân Chu', province_code: '19' },
    { code: '05881', name: 'Thành Công', province_code: '19' },
    { code: '05908', name: 'Phú Bình', province_code: '19' },
    { code: '05917', name: 'Tân Khánh', province_code: '19' },
    { code: '05923', name: 'Tân Thành', province_code: '19' },
    { code: '05941', name: 'Điềm Thụy', province_code: '19' },
    { code: '05953', name: 'Kha Sơn', province_code: '19' },

    // ===== (20) =====
    { code: '05977', name: 'Đông Kinh', province_code: '20' },
    { code: '05983', name: 'Lương Văn Tri', province_code: '20' },
    { code: '05986', name: 'Tam Thanh', province_code: '20' },
    { code: '06187', name: 'Kỳ Lừa', province_code: '20' },
    { code: '06001', name: 'Đoàn Kết', province_code: '20' },
    { code: '06004', name: 'Quốc Khánh', province_code: '20' },
    { code: '06019', name: 'Tân Tiến', province_code: '20' },
    { code: '06037', name: 'Kháng Chiến', province_code: '20' },
    { code: '06040', name: 'Thất Khê', province_code: '20' },
    { code: '06046', name: 'Tràng Định', province_code: '20' },
    { code: '06058', name: 'Quốc Việt', province_code: '20' },
    { code: '06073', name: 'Hoa Thám', province_code: '20' },
    { code: '06076', name: 'Quý Hòa', province_code: '20' },
    { code: '06079', name: 'Hồng Phong', province_code: '20' },
    { code: '06085', name: 'Thiện Hòa', province_code: '20' },
    { code: '06091', name: 'Thiện Thuật', province_code: '20' },
    { code: '06103', name: 'Thiện Long', province_code: '20' },
    { code: '06112', name: 'Bình Gia', province_code: '20' },
    { code: '06115', name: 'Tân Văn', province_code: '20' },
    { code: '06124', name: 'Na Sầm', province_code: '20' },
    { code: '06148', name: 'Thụy Hùng', province_code: '20' },
    { code: '06151', name: 'Hội Hoan', province_code: '20' },
    { code: '06154', name: 'Văn Lãng', province_code: '20' },
    { code: '06172', name: 'Hoàng Văn Thụ', province_code: '20' },
    { code: '06184', name: 'Đồng Đăng', province_code: '20' },
    { code: '06196', name: 'Ba Sơn', province_code: '20' },
    { code: '06211', name: 'Cao Lộc', province_code: '20' },
    { code: '06220', name: 'Công Sơn', province_code: '20' },
    { code: '06253', name: 'Văn Quan', province_code: '20' },
    { code: '06280', name: 'Điềm He', province_code: '20' },
    { code: '06286', name: 'Khánh Khê', province_code: '20' },
    { code: '06298', name: 'Yên Phúc', province_code: '20' },
    { code: '06313', name: 'Tri Lễ', province_code: '20' },
    { code: '06316', name: 'Tân Đoàn', province_code: '20' },
    { code: '06325', name: 'Bắc Sơn', province_code: '20' },
    { code: '06337', name: 'Tân Tri', province_code: '20' },
    { code: '06349', name: 'Hưng Vũ', province_code: '20' },
    { code: '06364', name: 'Vũ Lễ', province_code: '20' },
    { code: '06367', name: 'Vũ Lăng', province_code: '20' },
    { code: '06376', name: 'Nhất Hòa', province_code: '20' },
    { code: '06385', name: 'Hữu Lũng', province_code: '20' },
    { code: '06391', name: 'Yên Bình', province_code: '20' },
    { code: '06400', name: 'Hữu Liên', province_code: '20' },

    // (25) – 1 dòng
    { code: '04978', name: 'Kim Bôi', province_code: '25' },
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

        for (const d of DATA) {
            if (!idByCode[d.province_code]) {
                throw new Error(`[seed wards-part5] Missing province_id for code=${d.province_code}`);
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
