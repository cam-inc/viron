package auth

import (
	"fmt"
	"net/http"
	"strings"
	"testing"
	"time"
)

const (
	secret   = "xxxxxx"
	provider = "test"
	clientID = "testClientId"
)

func init() {
	fmt.Println("DEBUG")
	SetUp(secret, getProvider, 1)
}

func getProvider(r *http.Request) (string, []string, error) {
	return provider, []string{clientID}, nil
}

func TestAuthJWTSignNormal(t *testing.T) {
	userID := "test_1"
	r, err := http.NewRequest("GET", "", nil)
	fmt.Println(err)
	token, err := Sign(r, userID)
	fmt.Println(err)
	fmt.Println(token)
	sepToken := strings.Split(token, " ")[1]
	claim, err := Verify(r, sepToken)
	fmt.Println(err)
	fmt.Printf("claim=%v\n", claim)
	time.Sleep(10 * time.Second)
	claim2, err := Verify(r, sepToken)
	fmt.Println(err)
	fmt.Printf("claim2=%v\n", claim2)
}
