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
	})
})
