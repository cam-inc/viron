package auditlogs

import (
	"net/http"

	"github.com/cam-inc/viron/packages/golang/helpers"

	"github.com/cam-inc/viron/packages/golang/domains"
)

type (
	auditlogsImpl struct{}
)

func (user *VironUserIdQueryParam) stringPtr() *string {
	if user == nil {
		return nil
	}
	s := string(*user)
	return &s
}
func (uri *VironRequestUriQueryParam) stringPtr() *string {
	if uri == nil {
		return nil
	}
	s := string(*uri)
	return &s
}
func (method *VironRequestMethodQueryParam) stringPtr() *string {
	if method == nil {
		return nil
	}
	s := string(*method)
	return &s
}
func (ip *VironSourceIpQueryParam) stringPtr() *string {
	if ip == nil {
		return nil
	}
	s := string(*ip)
	return &s
}
func (status *VironStatusCodeQueryParam) intPtr() *uint {
	if status == nil {
		return nil
	}
	i := uint(*status)
	return &i
}
func (params ListVironAuditlogsParams) convertToDomainsAuditLog() *domains.AuditLog {
	return &domains.AuditLog{
		UserId:        params.UserId.stringPtr(),
		RequestUri:    params.RequestUri.stringPtr(),
		RequestMethod: params.RequestMethod.stringPtr(),
		SourceIp:      params.SourceIp.stringPtr(),
		StatusCode:    params.StatusCode.intPtr(),
	}
}

func (a auditlogsImpl) ListVironAuditlogs(w http.ResponseWriter, r *http.Request, params ListVironAuditlogsParams) {
	pager := domains.ListAuditLog(r.Context(), params.convertToDomainsAuditLog(), params.Page.Page(), params.Size.Size(), params.Sort.Sort())
	helpers.Send(w, http.StatusOK, pager)
}

func New() ServerInterface {
	return &auditlogsImpl{}
}
