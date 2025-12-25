'use strict';

const DATA = [
    // ===== TUYÊN QUANG (08) =====
    { code: '01192', name: 'Liên Hiệp', province_code: '08' },
    { code: '01201', name: 'Hùng An', province_code: '08' },
    { code: '01216', name: 'Đồng Yên', province_code: '08' },
    { code: '01225', name: 'Tiên Nguyên', province_code: '08' },
    { code: '01234', name: 'Yên Thành', province_code: '08' },
    { code: '01237', name: 'Quang Bình', province_code: '08' },
    { code: '01243', name: 'Tân Trịnh', province_code: '08' },
    { code: '01246', name: 'Bằng Lang', province_code: '08' },
    { code: '01255', name: 'Xuân Giang', province_code: '08' },
    { code: '01261', name: 'Tiên Yên', province_code: '08' },
    { code: '02221', name: 'Nà Hang', province_code: '08' },
    { code: '02239', name: 'Thượng Nông', province_code: '08' },
    { code: '02245', name: 'Côn Lôn', province_code: '08' },
    { code: '02248', name: 'Yên Hoa', province_code: '08' },
    { code: '02260', name: 'Hồng Thái', province_code: '08' },
    { code: '02266', name: 'Lâm Bình', province_code: '08' },
    { code: '02269', name: 'Thượng Lâm', province_code: '08' },
    { code: '02287', name: 'Chiêm Hóa', province_code: '08' },
    { code: '02296', name: 'Bình An', province_code: '08' },
    { code: '02302', name: 'Minh Quang', province_code: '08' },
    { code: '02305', name: 'Trung Hà', province_code: '08' },
    { code: '02308', name: 'Tân Mỹ', province_code: '08' },
    { code: '02317', name: 'Yên Lập', province_code: '08' },
    { code: '02320', name: 'Tân An', province_code: '08' },
    { code: '02332', name: 'Kiên Đài', province_code: '08' },
    { code: '02350', name: 'Kim Bình', province_code: '08' },
    { code: '02353', name: 'Hòa An', province_code: '08' },
    { code: '02359', name: 'Tri Phú', province_code: '08' },
    { code: '02365', name: 'Yên Nguyên', province_code: '08' },
    { code: '02374', name: 'Hàm Yên', province_code: '08' },
    { code: '02380', name: 'Bạch Xa', province_code: '08' },
    { code: '02392', name: 'Phù Lưu', province_code: '08' },
    { code: '02398', name: 'Yên Phú', province_code: '08' },
    { code: '02404', name: 'Bình Xa', province_code: '08' },
    { code: '02407', name: 'Thái Sơn', province_code: '08' },
    { code: '02419', name: 'Thái Hòa', province_code: '08' },
    { code: '02425', name: 'Hùng Đức', province_code: '08' },
    { code: '02434', name: 'Lực Hành', province_code: '08' },
    { code: '02437', name: 'Kiến Thiết', province_code: '08' },
    { code: '02449', name: 'Xuân Vân', province_code: '08' },
    { code: '02455', name: 'Hùng Lợi', province_code: '08' },
    { code: '02458', name: 'Trung Sơn', province_code: '08' },
    { code: '02470', name: 'Tân Long', province_code: '08' },
    { code: '02473', name: 'Yên Sơn', province_code: '08' },
    { code: '02494', name: 'Thái Bình', province_code: '08' },
    { code: '02530', name: 'Nhữ Khê', province_code: '08' },
    { code: '02536', name: 'Sơn Dương', province_code: '08' },
    { code: '02545', name: 'Tân Trào', province_code: '08' },
    { code: '02548', name: 'Bình Ca', province_code: '08' },
    { code: '02554', name: 'Minh Thanh', province_code: '08' },
    { code: '02572', name: 'Đông Thọ', province_code: '08' },
    { code: '02578', name: 'Tân Thanh', province_code: '08' },
    { code: '02608', name: 'Hồng Sơn', province_code: '08' },
    { code: '02611', name: 'Phú Lương', province_code: '08' },
    { code: '02620', name: 'Sơn Thủy', province_code: '08' },
    { code: '02623', name: 'Trường Sinh', province_code: '08' },

    // ===== ĐIỆN BIÊN (11) =====
    { code: '03127', name: 'Điện Biên Phủ', province_code: '11' },
    { code: '03151', name: 'Mường Lay', province_code: '11' },
    { code: '03334', name: 'Mường Thanh', province_code: '11' },
    { code: '03158', name: 'Sín Thầu', province_code: '11' },
    { code: '03160', name: 'Mường Nhé', province_code: '11' },
    { code: '03162', name: 'Nậm Kè', province_code: '11' },
    { code: '03163', name: 'Mường Toong', province_code: '11' },
    { code: '03164', name: 'Quảng Lâm', province_code: '11' },
    { code: '03166', name: 'Mường Chà', province_code: '11' },
    { code: '03169', name: 'Nà Hỳ', province_code: '11' },
    { code: '03172', name: 'Na Sang', province_code: '11' },
    { code: '03175', name: 'Chà Tở', province_code: '11' },
    { code: '03176', name: 'Nà Bủng', province_code: '11' },
    { code: '03181', name: 'Mường Tùng', province_code: '11' },
    { code: '03193', name: 'Pa Ham', province_code: '11' },
    { code: '03194', name: 'Nậm Nèn', province_code: '11' },
    { code: '03199', name: 'Si Pa Phìn', province_code: '11' },
    { code: '03202', name: 'Mường Pồn', province_code: '11' },
    { code: '03203', name: 'Na Son', province_code: '11' },
    { code: '03208', name: 'Xa Dung', province_code: '11' },
    { code: '03214', name: 'Mường Luân', province_code: '11' },
    { code: '03217', name: 'Tủa Chùa', province_code: '11' },
    { code: '03220', name: 'Tủa Thàng', province_code: '11' },
    { code: '03226', name: 'Sín Chải', province_code: '11' },
    { code: '03241', name: 'Sính Phình', province_code: '11' },
    { code: '03244', name: 'Sáng Nhè', province_code: '11' },
    { code: '03253', name: 'Tuần Giáo', province_code: '11' },
    { code: '03256', name: 'Mường Ảng', province_code: '11' },
    { code: '03260', name: 'Pú Nhung', province_code: '11' },
    { code: '03268', name: 'Mường Mùn', province_code: '11' },
    { code: '03283', name: 'Chiềng Sinh', province_code: '11' },
    { code: '03295', name: 'Quài Tở', province_code: '11' },
    { code: '03301', name: 'Búng Lao', province_code: '11' },
    { code: '03313', name: 'Mường Lạn', province_code: '11' },
    { code: '03316', name: 'Nà Tấu', province_code: '11' },
    { code: '03325', name: 'Mường Phăng', province_code: '11' },
    { code: '03328', name: 'Thanh Nưa', province_code: '11' },
    { code: '03349', name: 'Thanh Yên', province_code: '11' },
    { code: '03352', name: 'Thanh An', province_code: '11' },
    { code: '03356', name: 'Sam Mứn', province_code: '11' },
    { code: '03358', name: 'Núa Ngam', province_code: '11' },
    { code: '03368', name: 'Mường Nhà', province_code: '11' },
    { code: '03370', name: 'Pu Nhi', province_code: '11' },
    { code: '03382', name: 'Phình Giàng', province_code: '11' },
    { code: '03385', name: 'Tìa Dình', province_code: '11' },

    // ===== LAI CHÂU (12) =====
    { code: '03388', name: 'Đoàn Kết', province_code: '12' },
    { code: '03408', name: 'Tân Phong', province_code: '12' },
    { code: '03390', name: 'Bình Lư', province_code: '12' },
    { code: '03394', name: 'Sin Suối Hồ', province_code: '12' },
    { code: '03405', name: 'Tả Lèng', province_code: '12' },
    { code: '03424', name: 'Bản Bo', province_code: '12' },
    { code: '03430', name: 'Khun Há', province_code: '12' },
    { code: '03433', name: 'Bum Tở', province_code: '12' },
    { code: '03434', name: 'Nậm Hàng', province_code: '12' },
    { code: '03439', name: 'Thu Lũm', province_code: '12' },
    { code: '03442', name: 'Pa Ủ', province_code: '12' },
    { code: '03445', name: 'Mường Tè', province_code: '12' },
    { code: '03451', name: 'Mù Cả', province_code: '12' },
    { code: '03460', name: 'Hua Bum', province_code: '12' },
    { code: '03463', name: 'Tà Tổng', province_code: '12' },
    { code: '03466', name: 'Bum Nưa', province_code: '12' },
    { code: '03472', name: 'Mường Mô', province_code: '12' },
    { code: '03478', name: 'Sìn Hồ', province_code: '12' },
    { code: '03487', name: 'Lê Lợi', province_code: '12' },
    { code: '03503', name: 'Pa Tần', province_code: '12' },
    { code: '03508', name: 'Hồng Thu', province_code: '12' },
    { code: '03517', name: 'Nậm Tăm', province_code: '12' },
    { code: '03529', name: 'Tủa Sín Chải', province_code: '12' },
    { code: '03532', name: 'Pu Sam Cáp', province_code: '12' },
    { code: '03538', name: 'Nậm Mạ', province_code: '12' },
    { code: '03544', name: 'Nậm Cuổi', province_code: '12' },
    { code: '03549', name: 'Phong Thổ', province_code: '12' },
    { code: '03562', name: 'Sì Lở Lầu', province_code: '12' },
    { code: '03571', name: 'Dào San', province_code: '12' },
    { code: '03583', name: 'Khổng Lào', province_code: '12' },
    { code: '03595', name: 'Than Uyên', province_code: '12' },
    { code: '03598', name: 'Tân Uyên', province_code: '12' },
    { code: '03601', name: 'Mường Khoa', province_code: '12' },
    { code: '03613', name: 'Nậm Sỏ', province_code: '12' },
    { code: '03616', name: 'Pắc Ta', province_code: '12' },
    { code: '03618', name: 'Mường Than', province_code: '12' },
    { code: '03637', name: 'Mường Kim', province_code: '12' },
    { code: '03640', name: 'Khoen On', province_code: '12' },

    // ===== SƠN LA (14) =====
    { code: '03646', name: 'Tô Hiệu', province_code: '14' },
    { code: '03664', name: 'Chiềng An', province_code: '14' },
    { code: '03670', name: 'Chiềng Cơi', province_code: '14' },
    { code: '03679', name: 'Chiềng Sinh', province_code: '14' },
    { code: '03979', name: 'Mộc Sơn', province_code: '14' },
    { code: '03980', name: 'Mộc Châu', province_code: '14' },
    { code: '03982', name: 'Thảo Nguyên', province_code: '14' },
    { code: '04033', name: 'Vân Sơn', province_code: '14' },
    { code: '03688', name: 'Mường Chiên', province_code: '14' },
    { code: '03694', name: 'Mường Giôn', province_code: '14' },
    { code: '03703', name: 'Quỳnh Nhai', province_code: '14' },
];

module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();

        // Lấy map code -> id từ provinces
        const provinceCodes = [...new Set(DATA.map((d) => d.province_code))];
        const rows = await queryInterface.sequelize.query(`SELECT id, code FROM provinces WHERE code IN (:codes)`, {
            replacements: { codes: provinceCodes },
            type: Sequelize.QueryTypes.SELECT,
        });
        const idByCode = Object.fromEntries(rows.map((r) => [r.code, r.id]));

        // Kiểm tra đủ province_id
        for (const d of DATA) {
            if (!idByCode[d.province_code]) {
                throw new Error(`[seed wards-part3] Missing province_id for code=${d.province_code}`);
            }
        }

        // Build payload đúng schema
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
