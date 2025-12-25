'use strict';

/** @type {import('sequelize-cli').Migration} */

const wardTuples = `
  -- Tỉnh code 92
  ('31726','Gia Hòa','92'),
  ('31741','Tân Long','92'),
  ('31756','Phú Lộc','92'),
  ('31759','Lâm Tân','92'),
  ('31777','Vĩnh Lợi','92'),
  ('31795','Vĩnh Hải','92'),
  ('31810','Lai Hòa','92'),

  -- Tỉnh code 96 - phường
  ('31825','Bạc Liêu','96'),
  ('31834','Vĩnh Trạch','96'),
  ('31840','Hiệp Thành','96'),
  ('31942','Giá Rai','96'),
  ('31951','Láng Tròn','96'),
  ('32002','An Xuyên','96'),
  ('32014','Lý Văn Lâm','96'),
  ('32025','Tân Thành','96'),
  ('32041','Hòa Thành','96'),

  -- Tỉnh code 96 - xã
  ('31843','Hồng Dân','96'),
  ('31849','Ninh Quới','96'),
  ('31858','Vĩnh Lộc','96'),
  ('31864','Ninh Thạnh Lợi','96'),
  ('31867','Phước Long','96'),
  ('31876','Vĩnh Phước','96'),
  ('31882','Vĩnh Thanh','96'),
  ('31885','Phong Hiệp','96'),
  ('31891','Hòa Bình','96'),
  ('31894','Châu Thới','96'),
  ('31900','Vĩnh Lợi','96'),
  ('31906','Hưng Hội','96'),
  ('31918','Vĩnh Mỹ','96'),
  ('31927','Vĩnh Hậu','96'),
  ('31957','Phong Thạnh','96'),
  ('31972','Gành Hào','96'),
  ('31975','Đông Hải','96'),
  ('31985','Long Điền','96'),
  ('31988','An Trạch','96'),
  ('31993','Định Thành','96'),
  ('32044','Nguyễn Phích','96'),
  ('32047','U Minh','96'),
  ('32059','Khánh An','96'),
  ('32062','Khánh Lâm','96'),
  ('32065','Thới Bình','96'),
  ('32069','Biển Bạch','96'),
  ('32071','Trí Phải','96'),
  ('32083','Tân Lộc','96'),
  ('32092','Hồ Thị Kỷ','96'),
  ('32095','Trần Văn Thời','96'),
  ('32098','Sông Đốc','96'),
  ('32104','Đá Bạc','96'),
  ('32110','Khánh Bình','96'),
  ('32119','Khánh Hưng','96'),
  ('32128','Cái Nước','96'),
  ('32134','Lương Thế Trân','96'),
  ('32137','Tân Hưng','96'),
  ('32140','Hưng Mỹ','96'),
  ('32152','Đầm Dơi','96'),
  ('32155','Tạ An Khương','96'),
  ('32161','Trần Phán','96'),
  ('32167','Tân Thuận','96'),
  ('32182','Quách Phẩm','96'),
  ('32185','Thanh Tùng','96'),
  ('32188','Tân Tiến','96'),
  ('32191','Năm Căn','96'),
  ('32201','Đất Mới','96'),
  ('32206','Tam Giang','96'),
  ('32212','Cái Đôi Vàm','96'),
  ('32214','Phú Mỹ','96'),
  ('32218','Phú Tân','96'),
  ('32227','Nguyễn Việt Khái','96'),
  ('32236','Tân Ân','96'),
  ('32244','Phan Ngọc Hiển','96'),
  ('32248','Đất Mũi','96')
`;

module.exports = {
    async up(queryInterface, Sequelize) {
        // Chèn wards, map province_code -> provinces.id
        await queryInterface.sequelize.query(`
      INSERT INTO wards (id, code, name, province_id, created_at, updated_at)
      SELECT gen_random_uuid(), w.code, w.name, p.id, NOW(), NOW()
      FROM (VALUES
        ${wardTuples}
      ) AS w(code, name, province_code)
      JOIN provinces p ON p.code = w.province_code;
    `);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
      DELETE FROM wards
      WHERE code IN (
        SELECT code FROM (VALUES
          ${wardTuples}
        ) AS w(code, name, province_code)
      );
    `);
    },
};
