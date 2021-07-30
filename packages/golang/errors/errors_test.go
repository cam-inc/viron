package errors

import (
	"encoding/json"
	"fmt"
	"testing"
)

func TestErrors(t *testing.T) {
	fmt.Printf("%+v, statusCode = %d\n", RepositoryUninitialized, RepositoryUninitialized.StatusCode())
	b, _ := json.Marshal(RepositoryUninitialized)
	fmt.Println(string(b))
}
