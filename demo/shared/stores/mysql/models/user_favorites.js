const Sequelize = require('sequelize');

const TABLE = 'user_favorites';

module.exports = sequelize => {
  const model = sequelize.define(TABLE,
    {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      user_blog_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
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
