module.exports = {
  // service definition models
  Users: require('./users'),
  UserBlogs: require('./user_blogs'),
  UserBlogEntries: require('./user_blog_entries'),

  // dmc definition models
  AdminRoles: require('./admin_roles'),
  AdminUsers: require('./admin_users'),
  AuditLogs: require('./audit_logs'),

  associations: require('./associations'),
};
