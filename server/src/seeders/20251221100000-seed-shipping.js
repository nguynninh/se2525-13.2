'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();

        // Seed shipping rates (idempotent)
        await queryInterface.sequelize.query(
            `
            INSERT INTO shipping_rates (id, same_province, shipping_method, fee, created_at, updated_at)
            VALUES
              (1, true, 'economy', 20000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
              (2, true, 'fast', 30000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
              (3, false, 'economy', 40000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
              (4, false, 'fast', 60000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            ON CONFLICT (id) DO NOTHING;
            `,
        );

        // Seed shipment status history for seeded shipments if any
        const shipments = await queryInterface.sequelize.query(
            `SELECT id, tracking_code, status FROM shipments WHERE tracking_code IN ('SHIP-0001','SHIP-0002')`,
            { type: Sequelize.QueryTypes.SELECT },
        );

        if (shipments.length > 0) {
            const rows = shipments.map((s) => ({
                shipment_id: s.id,
                old_status: null,
                new_status: s.status || 'pending_pickup',
                event_time: now,
                source: 'system',
                description: `Initial status for ${s.tracking_code || s.id}`,
                raw_payload: null,
                created_at: now,
            }));

            await queryInterface.bulkInsert('shipment_status_history', rows, {});
        }
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('shipment_status_history', null, {});
        await queryInterface.bulkDelete('shipping_rates', { id: [1, 2, 3, 4] }, {});
    },
};
