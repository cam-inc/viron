package helpers

import (
	"encoding/json"
	"net/http"

	"github.com/cam-inc/viron/packages/golang/logging"
)

func SendError(w http.ResponseWriter, code int, err error) {
	w.WriteHeader(code)
	if err := json.NewEncoder(w).Encode(err); err != nil {
		logging.GetDefaultLogger().Warnf("sendError err=%v\n", err)
	}
}

func Send(w http.ResponseWriter, code int, send interface{}) {
	w.WriteHeader(code)
	if send != nil {
		if err := json.NewEncoder(w).Encode(send); err != nil {
			logging.GetDefaultLogger().Warnf("sendError err=%v\n", err)
		}
	}
}

func BodyDecode(r *http.Request, value interface{}) error {
	if err := json.NewDecoder(r.Body).Decode(value); err != nil {
		return err
	}
	return nil
}
