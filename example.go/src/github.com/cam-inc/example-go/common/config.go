package common

import (
	"fmt"
)

// Config of
type Config struct {
	Scheme string
	Host   string
	Port   int16
}

var config *Config

func init() {
	config = &Config{
		Scheme: "http",
		Host:   "localhost",
		Port:   3000,
	}
}

// GetHostName of
func (c *Config) GetHostName() string {
	return fmt.Sprintf("%s://%s", config.Scheme, config.Host)
}
