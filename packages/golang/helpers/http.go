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

func Send(w http.ResponseWriter, code int, send interface{}) {
	w.WriteHeader(code)
	if err := json.NewEncoder(w).Encode(send); err != nil {
		fmt.Printf("sendError err=%v\n", err)
	}
}
