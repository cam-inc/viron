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
	addr := fmt.Sprintf("%s:%d", s.Host, s.Port)
	fmt.Printf("Addr -> %s", addr)
	return http.ListenAndServe(addr, s.handler)
}

// New start
func New(handler http.Handler, host string, port int) *Server {

	s := &Server{
		handler: handler,
		Host: host,
		Port: port,
	}

	return s
}