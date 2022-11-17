package domains

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestIsPathMatch(t *testing.T) {
	cases := []struct {
		Title   string
		reqPath string
		defPath string
		Expect  bool
		Err     error
	}{
		{
			Title:   "no queryParam",
			reqPath: "/parent",
			defPath: "/parent",
			Expect:  true,
		},
		{
			Title:   "with queryParam",
			reqPath: "/parent?page=1&size=1",
			defPath: "/parent",
			Expect:  true,
		},
		{
			Title:   "with pathParam",
			reqPath: "/parent/123",
			defPath: "/parent/{parent}",
			Expect:  true,
		},
		{
			Title:   "with pathParam 2",
			reqPath: "/parent/123/child",
			defPath: "/parent/{parent}/child",
			Expect:  true,
		},
		{
			Title:   "with pathParam and queryParam 1",
			reqPath: "/parent/123?page=1&size=1",
			defPath: "/parent/{parentId}",
			Expect:  true,
		},
		{
			Title:   "with pathParam and queryParam 2",
			reqPath: "/parent/123/child?page=1&size=1",
			defPath: "/parent/{parentId}/child",
			Expect:  true,
		},
		{
			Title:   "with multiple pathParam",
			reqPath: "/parent/123/child/456",
			defPath: "/parent/{parentId}/child/{childId}",
			Expect:  true,
		},
		{
			Title:   "with multiple pathParam and queryParam",
			reqPath: "/parent/123/child/456?page=1&size=1",
			defPath: "/parent/{parentId}/child/{childId}",
			Expect:  true,
		},
		{
			Title:   "failure case 1",
			reqPath: "/parents",
			defPath: "/parent",
			Expect:  false,
		},
		{
			Title:   "failure case 2",
			reqPath: "/parent",
			defPath: "/parents",
			Expect:  false,
		},
		{
			Title:   "failure case 3",
			reqPath: "/parent/123",
			defPath: "/parent/{parentId}/child/{childId}",
			Expect:  false,
		},
		{
			Title:   "failure case 4",
			reqPath: "/parent/123/child",
			defPath: "/parent/{parentId}/child/{childId}",
			Expect:  false,
		},
		{
			Title:   "failure case 5",
			reqPath: "/parent/123/child",
			defPath: "/parent/{pare/ntId}/child/",
			Expect:  false,
		},
	}

	for _, tt := range cases {
		t.Run(tt.Title, func(t *testing.T) {
			b := isPathMatch(tt.reqPath, tt.defPath)
			assert.Equal(t, tt.Expect, b)
		})
	}
}
