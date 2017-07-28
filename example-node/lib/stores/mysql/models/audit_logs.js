const Sequelize = require('sequelize');

const TABLE = 'audit_logs';

module.exports = sequelize => {
  const model = sequelize.define(TABLE,
    {
      request_method: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      request_uri: {
        type: Sequelize.STRING(2048),
        allowNull: true,
      },
      source_ip: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      user_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      request_body: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status_code: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      // underscored: true,
      // underscoredAll: true,
      // freezeTableName: false,
      // createdAt: true,
      // updatedAt: true,
      // deletedAt: true,
      charset: 'utf8',
      indexes: [
      ]
    }
  );
  return model;
};
