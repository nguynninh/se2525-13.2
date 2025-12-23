'use strict';

/** @type {import('sequelize-cli').Migration} */

const APPLICANTS = [
    { email: 'customer1@example.com', status: 'pending', accepted_terms: true },

    {
        email: 'customer2@example.com',
        status: 'approved',
        accepted_terms: true,
        reviewed_by_email: 'admin@example.com',
    },

    {
        email: 'customer3@example.com',
        status: 'rejected',
        accepted_terms: true,
        reviewed_by_email: 'admin@example.com',
        rejection_reason: 'Không đủ giấy tờ hợp lệ',
    },
];

module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();

        const emailSet = new Set(APPLICANTS.map((a) => a.email));
        for (const a of APPLICANTS) if (a.reviewed_by_email) emailSet.add(a.reviewed_by_email);

        const users = await queryInterface.sequelize.query(`SELECT id, email FROM users WHERE email IN (:emails)`, {
            replacements: { emails: Array.from(emailSet) },
            type: Sequelize.QueryTypes.SELECT,
        });
        const idByEmail = Object.fromEntries(users.map((u) => [u.email, u.id]));

        for (const a of APPLICANTS) {
            if (!idByEmail[a.email]) {
                throw new Error(`[seed seller_applications] User not found for email=${a.email}`);
            }
            const needsReviewer = a.status === 'approved' || a.status === 'rejected';
            if (needsReviewer) {
                if (!a.reviewed_by_email) {
                    throw new Error(
                        `[seed seller_applications] status=${a.status} requires reviewed_by_email (email=${a.email})`,
                    );
                }
                if (!idByEmail[a.reviewed_by_email]) {
                    throw new Error(
                        `[seed seller_applications] Reviewer not found for reviewed_by_email=${a.reviewed_by_email} (email=${a.email})`,
                    );
                }
            }
            if (a.status === 'rejected' && !a.rejection_reason) {
                throw new Error(`[seed seller_applications] 'rejected' requires rejection_reason (email=${a.email})`);
            }
        }

        await queryInterface.sequelize.query(
            `DELETE FROM seller_applications sa
       USING users u
       WHERE sa.user_id = u.id
         AND u.email IN (:emails)`,
            { replacements: { emails: APPLICANTS.map((a) => a.email) } },
        );

        const rows = APPLICANTS.map((a) => ({
            user_id: idByEmail[a.email],
            status: a.status,
            accepted_terms: !!a.accepted_terms,
            rejection_reason: a.rejection_reason ?? null,
            reviewed_by: a.status === 'approved' || a.status === 'rejected' ? idByEmail[a.reviewed_by_email] : null,
            created_at: now,
            updated_at: now,
        }));

        await queryInterface.bulkInsert('seller_applications', rows, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(
            `DELETE FROM seller_applications sa
       USING users u
       WHERE sa.user_id = u.id
         AND u.email IN (:emails)`,
            { replacements: { emails: APPLICANTS.map((a) => a.email) } },
        );
    },
};
