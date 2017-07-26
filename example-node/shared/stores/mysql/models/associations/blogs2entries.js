const UserBlogs = require('../user_blogs');
const UserBlogEntries = require('../user_blog_entries');

/**
 * 1:1 table modle for `user_blogs` and `user_blog_entries`
 *
 * @param sequelize 接続しているストア(Sequelize) インスタンス
 * @returns {Sequelize.Model}
 */
module.exports = sequelize => {
  const Blogs2Entries = UserBlogs(sequelize).hasMany(UserBlogEntries(sequelize), {
    foreignKey: 'user_blog_id',
  });
  return Blogs2Entries;
};
