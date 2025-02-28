package errors

import (
	"encoding/json"
	"errors"
	"fmt"
)

type (
	VironError struct {
		code int
		err  error
	}
)

func (v *VironError) Error() string {
	return fmt.Sprintf(`{"statusCode":%d,"message":"%v"}`, v.code, v.err)
}

func (v *VironError) MarshalJSON() ([]byte, error) {
	jv, err := json.Marshal(&struct {
		Code    int    `json:"statusCode"`
		Message string `json:"message"`
	}{
		Code:    v.code,
		Message: v.err.Error(),
	})
	return jv, err
}

func (v *VironError) StatusCode() int {
	return v.code
}

func Initialize(code int, message string) *VironError {
	return &VironError{
		code: code,
		err:  errors.New(message),
	}
}

var (
	RepositoryUninitialized   = Initialize(500, "Uninitialized repository is not available")
	JwtUninitialized          = Initialize(500, "Uninitialized jwt is not available")
	OIDCProviderFailed        = Initialize(500, "oidc provider failed")
	RequestBodyDecodeFailed   = Initialize(400, "RequestBody decode failed.")
	RoleIdAlreadyExists       = Initialize(400, "The role-id is already exists.")
	SigninFailed              = Initialize(400, "Signin failed")
	AdminRoleExists           = Initialize(400, "The role-id is already exists.")
	UnAuthorized              = Initialize(401, "Unauthorized")
	OasUndefined              = Initialize(404, "OAS is undefined")
	OasValidationFailure      = Initialize(500, "OAS validation failure.")
	AdminUserNotfound         = Initialize(404, "Admin User not found.")
	AdminUserSSOTokenNotfound = Initialize(404, "Admin User SSO Token not found.")
	Forbidden                 = Initialize(403, "Forbidden")
	MismatchState             = Initialize(400, "State is mismatch.")
)
