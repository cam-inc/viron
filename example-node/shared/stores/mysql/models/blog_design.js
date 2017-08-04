const Sequelize = require('sequelize');

const TABLE = 'blog_designs';

module.exports = sequelize => {
  const model = sequelize.define(TABLE,
    {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      background_image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      base_color: {
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
      ]
    }
  );
  return model;
};
