package helpers

import (
	"testing"
)

func TestPassword(t *testing.T) {
	pass := "test"
	salt := ""
	password := GenPassword(pass, salt)
	if !VerifyPassword(pass, password.Password, password.Salt) {
		t.Failed()
	}
}
