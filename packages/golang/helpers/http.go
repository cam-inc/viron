package helpers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/cam-inc/viron/packages/golang/errors"

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

func BodyDecode(r *http.Request, req interface{}) *errors.VironError {
	// htttp.Request.decodeするとBodyが空になるので後続でdecodeできない
	// bufferでdecodeする
	buf, _ := io.ReadAll(r.Body)
	body := io.NopCloser(bytes.NewBuffer(buf))
	bak := io.NopCloser(bytes.NewBuffer(buf))
	if e := json.NewDecoder(body).Decode(req); e != nil {
		return errors.Initialize(http.StatusInternalServerError, fmt.Sprintf("requestBody json decode failed %+v", e))
	}
	r.Body = bak
	return nil
}
