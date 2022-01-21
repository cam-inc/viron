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

func getProvider() string {
	return provider
}

func TestAuthJWTSignNormal(t *testing.T) {
	userID := "test_1"
	token, err := Sign(userID)
	fmt.Println(err)
	fmt.Println(token)
	sepToken := strings.Split(token, " ")[1]
	claim, err := Verify(sepToken)
	fmt.Println(err)
	fmt.Printf("claim=%v\n", claim)
	time.Sleep(10 * time.Second)
	claim2, err := Verify(sepToken)
	fmt.Println(err)
	fmt.Printf("claim2=%v\n", claim2)
}
