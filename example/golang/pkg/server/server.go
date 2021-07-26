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
	fmt.Println("INNER RUN")
	addr := fmt.Sprintf(":%d", s.Port)
	//addr := fmt.Sprintf("%s:%d", s.Host, s.Port)
	fmt.Printf("Addr -> %s\n", addr)
	return http.ListenAndServe(addr, s.handler)
}

func (s *Server) RunSSL() error {
	fmt.Println("INNER RUN")
	addr := fmt.Sprintf(":%d", s.Port)
	//addr := fmt.Sprintf("%s:%d", s.Host, s.Port)
	fmt.Printf("Addr -> %s\n", addr)
	return http.ListenAndServeTLS(addr, "/viron/example/golang/cert/viron.crt", "/viron/example/golang/cert/viron.key", s.handler)
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
