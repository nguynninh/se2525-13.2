'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint c
    JOIN pg_class t ON t.oid = c.conrelid
    WHERE t.relname = 'seller_applications'
      AND c.conname = 'ck_rejection_reason_required'
  ) THEN
    ALTER TABLE seller_applications DROP CONSTRAINT ck_rejection_reason_required;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_constraint c
    JOIN pg_class t ON t.oid = c.conrelid
    WHERE t.relname = 'seller_applications'
      AND c.conname = 'ck_rejection_reason_only_when_rejected'
  ) THEN
    ALTER TABLE seller_applications DROP CONSTRAINT ck_rejection_reason_only_when_rejected;
  END IF;

  -- Thêm constraint mới nếu chưa có
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint c
    JOIN pg_class t ON t.oid = c.conrelid
    WHERE t.relname = 'seller_applications'
      AND c.conname = 'ck_reject_reason_required'
  ) THEN
    ALTER TABLE seller_applications
      ADD CONSTRAINT ck_reject_reason_required
      CHECK (status <> 'rejected' OR rejection_reason IS NOT NULL);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint c
    JOIN pg_class t ON t.oid = c.conrelid
    WHERE t.relname = 'seller_applications'
      AND c.conname = 'ck_reason_only_when_rejected'
  ) THEN
    ALTER TABLE seller_applications
      ADD CONSTRAINT ck_reason_only_when_rejected
      CHECK (status = 'rejected' OR rejection_reason IS NULL);
  END IF;
END$$;
    `);

        await queryInterface.sequelize.query(`
      DROP INDEX IF EXISTS ux_seller_applications_user_pending;
      CREATE UNIQUE INDEX IF NOT EXISTS ux_app_user_pending
        ON seller_applications(user_id)
        WHERE status = 'pending';
    `);

        await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS ix_app_updated_at
        ON seller_applications(updated_at);
    `);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
      DROP INDEX IF EXISTS ix_app_updated_at;
      DROP INDEX IF EXISTS ux_app_user_pending;
      -- Tạo lại index cũ nếu muốn quay về tên cũ
      CREATE UNIQUE INDEX IF NOT EXISTS ux_seller_applications_user_pending
        ON seller_applications(user_id)
        WHERE status = 'pending';
    `);

        await queryInterface.sequelize.query(`
DO $$
BEGIN
  -- Drop constraints tên mới nếu có
  IF EXISTS (
    SELECT 1 FROM pg_constraint c
    JOIN pg_class t ON t.oid = c.conrelid
    WHERE t.relname = 'seller_applications'
      AND c.conname = 'ck_reject_reason_required'
  ) THEN
    ALTER TABLE seller_applications DROP CONSTRAINT ck_reject_reason_required;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_constraint c
    JOIN pg_class t ON t.oid = c.conrelid
    WHERE t.relname = 'seller_applications'
      AND c.conname = 'ck_reason_only_when_rejected'
  ) THEN
    ALTER TABLE seller_applications DROP CONSTRAINT ck_reason_only_when_rejected;
  END IF;

  -- Tạo lại constraints tên cũ (nội dung tương đương)
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint c
    JOIN pg_class t ON t.oid = c.conrelid
    WHERE t.relname = 'seller_applications'
      AND c.conname = 'ck_rejection_reason_required'
  ) THEN
    ALTER TABLE seller_applications
      ADD CONSTRAINT ck_rejection_reason_required
      CHECK (status <> 'rejected' OR rejection_reason IS NOT NULL);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint c
    JOIN pg_class t ON t.oid = c.conrelid
    WHERE t.relname = 'seller_applications'
      AND c.conname = 'ck_rejection_reason_only_when_rejected'
  ) THEN
    ALTER TABLE seller_applications
      ADD CONSTRAINT ck_rejection_reason_only_when_rejected
      CHECK (status = 'rejected' OR rejection_reason IS NULL);
  END IF;
END$$;
    `);
    },
};
