package helpers

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func SendError(w http.ResponseWriter, code int, err error) {
	w.WriteHeader(code)
	if err := json.NewEncoder(w).Encode(err); err != nil {
		fmt.Printf("sendError err=%v\n", err)
	}
}
