package main

import (
	"fmt"
	"os"
	"strconv"

	"github.com/cam-inc/viron/example/golang/pkg/constant"
	"github.com/cam-inc/viron/example/golang/pkg/server"
	"github.com/cam-inc/viron/example/golang/routes"

	"github.com/spf13/cobra"
	"go.uber.org/automaxprocs/maxprocs"
)

type (
	options struct {
		env  string
		host string
		port int
	}
)

func main() {
	//defer profile.Start().Stop()
	if _, err := maxprocs.Set(); err != nil {
		fmt.Print(err)
		os.Exit(2)
	}
	c := &cobra.Command{}
	o := &options{}

	registerCommand(c)
	c.RunE = func(c *cobra.Command, args []string) error {
		return run(o)
	}
	// コマンドライン変数を受け取る
	c.Flags().StringVarP(&o.env, "env", "e", "dev", "environment")
	o.host = os.Getenv(constant.SERVICE_HOST)
	o.port, _ = strconv.Atoi(os.Getenv(constant.SERVICE_PORT))

	if err := c.Execute(); err != nil {
		fmt.Print(err)
		os.Exit(2)
	}
}

// run cobra.commandで実行される(RunE)関数
func run(o *options) error {

	s := server.New(routes.New(), o.host, o.port)

	fmt.Println("RUN")

	return s.Run()
}

func registerCommand(registry *cobra.Command) {
	registry.AddCommand(&cobra.Command{
		Use:   "example server",
		Short: "example server",
	})
}
