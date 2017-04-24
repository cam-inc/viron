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

			Field("id", gorma.Integer, func() {
				PrimaryKey()
			})
			Field("name", gorma.String, func() {})
			//Field("createdAt", gorma.Timestamp, func() {})
			//Field("updatedAt", gorma.Timestamp, func() {})
		})

		Model("AdminUser", func() {
			Description("This is the admin-user model")

			BuildsFrom(func() {
				Payload("admin_user", "create")
				Payload("admin_user", "update")
			})

			RendersTo(AdminUserMediaType)

			Field("id", gorma.Integer, func() {
				PrimaryKey()
			})
			Field("login_id", gorma.String, func() {
				SQLTag("index")
				SQLTag("unique")
			})
			Field("password", gorma.String, func() {})
			Field("role_id", gorma.String, func() {})
			Field("salt", gorma.String, func() {})
		})

		Model("AdminRole", func() {
			Description("This is the admin-role model")

			BuildsFrom(func() {
				Payload("admin_role", "create")
				Payload("admin_role", "update")
			})

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
			Field("request_uri", gorma.String, func() {})
			Field("source_ip", gorma.String, func() {})
			Field("user_id", gorma.String, func() {})
			Field("request_body", gorma.String, func() {})
			Field("status_code", gorma.Integer, func() {})
			Field("created_at", gorma.Timestamp, func() {})
		})

	})
})
