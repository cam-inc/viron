package oas

import "net/http"

type oas struct {}

func (o *oas) GetOas(w http.ResponseWriter, r *http.Request) {}

func New() ServerInterface {
	return &oas{}
}
