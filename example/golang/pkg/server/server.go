package server

import (
	"fmt"
	"net/http"
)

type Server struct {
	handler http.Handler
	Host string
	Port int
}

// Run server run
func (s *Server) Run() error {
	return http.ListenAndServe(fmt.Sprintf("%s:%d", s.Host, s.Port), s.handler)
}

// New start
func New(hander http.Handler, host string, port int) *Server {

	s := &Server{
		handler: hander,
		Host: host,
		Port: port,
	}

	return s
}