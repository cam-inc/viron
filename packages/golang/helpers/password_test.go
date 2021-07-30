package helpers

import (
	"fmt"
	"testing"
)

func TestPassword(t *testing.T) {
	pass := "test"
	salt := "testtesttest"
	password := GenPassword(pass, salt)
	fmt.Println(password.Password, password.Salt)
	if !VerifyPassword(pass, password.Password, password.Salt) {
		t.Failed()
	}
}
