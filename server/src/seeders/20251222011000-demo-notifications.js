'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM users;`
    );

    const userRows = users[0];

    if (userRows.length > 0) {
      const notifications = userRows.map(user => ({
        id: Sequelize.literal('gen_random_uuid()'),
        user_id: user.id,
        type: 'system',
        scope: 'broadcast', 
        title: 'Thông báo toàn hệ thống',
        content: 'Chào mừng tất cả mọi người đã tham gia hệ thống Hiki!',
        data: JSON.stringify({ version: '1.0.0' }),
        is_read: false,
        created_at: new Date(),
        updated_at: new Date()
      }));

      return queryInterface.bulkInsert('notifications', notifications);
    }
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('notifications', null, {});
  }
};