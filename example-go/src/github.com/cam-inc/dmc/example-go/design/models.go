package design

import (
	"github.com/goadesign/gorma"
	. "github.com/goadesign/gorma/dsl"
)

var _ = StorageGroup("DmcStorageGroup", func() {
	Description("This is the global storage group")

	Store("mysql", gorma.MySQL, func() {
		Description("This is the mysql relational store")

		Model("User", func() {
			Description("This is the user model")

			BuildsFrom(func() {
				Payload("user", "create")
				Payload("user", "update")
			})

			RendersTo(UserMediaType)
			HasOne("UserBlog")

			Field("id", gorma.Integer, func() {
				PrimaryKey()
			})
			Field("name", gorma.String, func() {})
			Field("sex", gorma.String, func() {})
			Field("birthday", gorma.NullableTimestamp, func() {})
			Field("blood_type", gorma.String, func() {})
			Field("job", gorma.String, func() {})
			Field("home_town", gorma.String, func() {})
			Field("living_region", gorma.String, func() {})
			Field("married", gorma.Boolean, func() {})
			Field("appear_area", gorma.String, func() {})
			Field("school", gorma.String, func() {})
			Field("homepage", gorma.String, func() {})
			Field("created_at", gorma.Timestamp, func() {})
			Field("updated_at", gorma.Timestamp, func() {})
		})

		Model("UserBlog", func() {
			Description("This is the user_blog model")

			BuildsFrom(func() {
				Payload("user_blog", "create")
				Payload("user_blog", "update")
			})

			RendersTo(UserBlogMediaType)
			//HasMany("UserBlogEntries", "UserBlogEntry")

			Field("id", gorma.Integer, func() {
				PrimaryKey()
			})
			Field("user_id", gorma.Integer, func() {})
			Field("title", gorma.String, func() {})
			Field("sub_title", gorma.String, func() {})
			Field("genre", gorma.String, func() {})
			Field("design_id", gorma.String, func() {})
		})

		Model("AdminUser", func() {
			// Aliasを指定するとテーブル名を明示的に決定できる
			//Alias("admin_user")
			Description("This is the admin-user model")

			BuildsFrom(func() {
				Payload("admin_user", "create")
				Payload("admin_user", "update")
			})

			RendersTo(AdminUserMediaType)

			Field("id", gorma.Integer, func() {
				PrimaryKey()
			})
			Field("email", gorma.String, func() {
				SQLTag("index")
				SQLTag("unique")
			})
			Field("password", gorma.String, func() {})
			Field("role_id", gorma.String, func() {})
			Field("salt", gorma.String, func() {})
		})

		Model("AdminRole", func() {
			Description("This is the admin-role model")

			RendersTo(AdminRoleMediaType)

			Field("id", gorma.Integer, func() {
				PrimaryKey()
			})
			Field("role_id", gorma.String, func() {
				SQLTag("index")
			})
			Field("method", gorma.String, func() {})
			Field("resource", gorma.String, func() {})
		})

		Model("AuditLog", func() {
			Description("This is the audit-log model")

			RendersTo(AuditLogMediaType)

			Field("reuquest_method", gorma.String, func() {})
			Field("request_uri", gorma.String, func() {
				SQLTag("size:2048")
			})
			Field("source_ip", gorma.String, func() {})
			Field("user_id", gorma.String, func() {})
			Field("request_body", gorma.String, func() {
				SQLTag("type:text")
			})
			Field("status_code", gorma.Integer, func() {})
			Field("created_at", gorma.Timestamp, func() {})
		})

	})
})
