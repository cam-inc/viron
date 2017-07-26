const Sequelize = require('sequelize');

const TABLE = 'admin_roles';

module.exports = sequelize => {
  const model = sequelize.define(TABLE,
    {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      role_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      method: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      resource: {
        type: Sequelize.STRING,
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
        {unique: false, fields: ['role_id']},
      ]
    }
  );
  return model;
};
