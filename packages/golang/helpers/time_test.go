package helpers

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestUnixToTime(t *testing.T) {
	now := time.Now()
	e := UnixToTime(int(now.Unix()))
	a := time.Unix(int64(now.Unix()), int64(now.Unix())%1000*1000000)
	assert.Equal(t, a, e)
}
