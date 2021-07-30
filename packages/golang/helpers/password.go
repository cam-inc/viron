package helpers

import (
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"math/rand"
	"time"

	"golang.org/x/crypto/pbkdf2"
)

type (
	Password struct {
		Password string
		Salt     string
	}
)

func GenSalt(size int) string {
	//crypto.Hash()
	b := make([]byte, size)
	rand.Seed(time.Now().UnixNano())
	if _, err := rand.Read(b); err != nil {
		return ""
	}
	return base64.StdEncoding.EncodeToString(b)
}

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

/*
// パスワードをハッシュ化する
export const genPasswordHash = (
  password: string,
  salt = genSalt()
): HashedPasswordWithSalt => {
  return { password: str2hash(password, salt), salt };
};
*/
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

/*
// パスワードを検証する
export const verifyPassword = (
  password: string,
  hashedPassword: string,
  salt: string
): boolean => {
  return str2hash(password, salt) === hashedPassword;
};
*/

func VerifyPassword(input string, hashed string, salt string) bool {
	return String2Hash(input, salt, 0, 0) == hashed
}

/*
// saltを生成する
const genSalt = (len = 128): string => randomBytes(len).toString('base64');

// saltを用いてstrをハッシュ化する
const str2hash = (
  str: string,
  salt: string,
  len = 1024, // 返されるハッシュの文字列長
  iterations = 1000 // 暗号化のストレッチング回数. 多いほど復号が難しくなる
): string => {
  return pbkdf2Sync(
    str,
    salt,
    iterations,
    Math.floor(len / 2), // 16進数にしたときにlenになる必要があるので半分にしておく
    'sha512'
  ).toString('hex');
};

export interface HashedPasswordWithSalt {
  password: string;
  salt: string;
}





*/
