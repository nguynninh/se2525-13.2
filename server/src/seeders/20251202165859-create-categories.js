'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    
    const categories = [
      { name: 'Nhà Sách', slug: 'nha-sach' },
      { name: 'Nha Cửa - Đời Sống', slug: 'nha-cua-doi-song' },
      { name: 'Điện Thoại - Máy Tính Bảng', slug: 'dien-thoai-may-tinh-bang' },
      { name: 'Đồ Chơi - Mẹ & Bé', slug: 'do-choi-me-be' },
      { name: 'Thiết Bị Số - Phụ Kiện Số', slug: 'thiet-bi-so-phu-kien-so' },
      { name: 'Điện Gia Dụng', slug: 'dien-gia-dung' },
      { name: 'Làm Đẹp - Sức Khỏe', slug: 'lam-dep-suc-khoe' },
      { name: 'Ô Tô - Xe Máy - Xe Đạp', slug: 'o-to-xe-may-xe-dap' },
      { name: 'Thời trang nữ', slug: 'thoi-trang-nu' },
      { name: 'Bách Hóa Online', slug: 'bach-hoa-online' },
      { name: 'Thể Thao - Dã Ngoại', slug: 'the-thao-da-ngoai' },
      { name: 'Thời trang nam', slug: 'thoi-trang-nam' },
      { name: 'Cross Border - Hàng Quốc Tế', slug: 'cross-border-hang-quoc-te' },
      { name: 'Laptop - Máy Vi Tính', slug: 'laptop-may-vi-tinh' },
      { name: 'Linh kiện', slug: 'linh-kien' }
    ];

    await queryInterface.bulkInsert('categories', categories.map(c => ({
      ...c,
      parent_id: null,
      created_at: now,
      updated_at: now
    })));
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});
  }
};