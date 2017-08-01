let lib = require('../../../../lib');

module.exports = {
  // service definition models
  Users: require('./users'),
  UserBlogs: require('./user_blogs'),
  UserBlogEntries: require('./user_blog_entries'),

  associations: require('./associations'),
};
