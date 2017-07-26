const Users = require('../users');
const UserBlogs = require('../user_blogs');

/**
 * 1:1 table modle for `users` and `user_blogs`
 *
 * @param sequelize 接続しているストア(Sequelize) インスタンス
 * @returns {Sequelize.Model}
 */
module.exports = sequelize => {
  const Users2Blogs = Users(sequelize).hasOne(UserBlogs(sequelize), {
    foreignKey: 'user_id',
  });
  return Users2Blogs;
};
