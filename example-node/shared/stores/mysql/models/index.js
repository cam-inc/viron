let lib = require('../../../../lib');

module.exports = {
  // service definition models
  Users: require('./users'),
  UserBlogs: require('./user_blogs'),
  UserBlogEntries: require('./user_blog_entries'),
  BlogDesigns: require('./blog_design'),

  associations: require('./associations'),
};
