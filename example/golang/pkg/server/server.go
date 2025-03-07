package server

import (
	"fmt"
	"net/http"
)

type Server struct {
	handler http.Handler
	Host    string
	Port    int
}

// Run server run
func (s *Server) Run() error {
	addr := fmt.Sprintf(":%d", s.Port)
	fmt.Printf("Addr -> %s\n", addr)
	return http.ListenAndServe(addr, s.handler)
}

func (s *Server) RunTLS() error {
	addr := fmt.Sprintf(":%d", s.Port)
	fmt.Printf("Addr -> %s\n", addr)
	return http.ListenAndServeTLS(addr, "cert/viron.crt", "cert/viron.key", s.handler)
}

// New start
func New(handler http.Handler, host string, port int) *Server {

	s := &Server{
		handler: handler,
		Host:    host,
		Port:    port,
	}

	return s
}
