package auth

import (
	"fmt"
	"strings"
	"testing"
	"time"
)

const (
	secret   = "xxxxxx"
	provider = "test"
)

func init() {
	fmt.Println("DEBUG")
	SetUp(secret, provider, 1)
}

func TestAuthJWTSignNormal(t *testing.T) {
	userID := "test_1"
	token := Sign(userID)
	fmt.Println(token)
	sepToken := strings.Split(token, " ")[1]
	claim := Verify(sepToken)
	fmt.Printf("claim=%v\n", claim)
	time.Sleep(10 * time.Second)
	claim2 := Verify(sepToken)
	fmt.Printf("claim2=%v\n", claim2)
}
