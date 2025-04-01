package helpers

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"

	"golang.org/x/crypto/pbkdf2"
)

type (
	Password struct {
		Password string
		Salt     string
	}
)

func GenSalt(size int) string {
	b := make([]byte, size)
	if _, err := rand.Read(b); err != nil {
		return ""
	}
	return base64.StdEncoding.EncodeToString(b)
}

// String2Hash saltを使ってstringをハッシュ化
func String2Hash(str string, salt string, size int, iterations int) string {
	s := 1024
	if size > 0 {
		s = size
	}
	ite := 1000
	if iterations > 0 {
		ite = iterations
	}
	return hex.EncodeToString(pbkdf2.Key([]byte(str), []byte(salt), ite, s, sha256.New))
}

// GenPassword passwordをハッシュ化
func GenPassword(password string, salt string) *Password {
	s := salt
	if s == "" {
		s = GenSalt(128)
	}

	return &Password{
		Password: String2Hash(password, s, 0, 0),
		Salt:     s,
	}
}

// VerifyPassword passwordを検証する
func VerifyPassword(input string, hashed string, salt string) bool {
	return String2Hash(input, salt, 0, 0) == hashed
}
