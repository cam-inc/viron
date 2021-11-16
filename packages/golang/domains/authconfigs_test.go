package domains

import (
	"testing"
)

func TestAuthConfigs(t *testing.T) {
	/*
		genAuthConfig(
		      AUTH_CONFIG_PROVIDER.VIRON,
		      AUTH_CONFIG_TYPE.EMAIL,
		      API_METHOD.POST,
		      EMAIL_SIGNIN_PATH,
		      context.req._context.apiDefinition
		    ),
	*/
	/*
		apiDef, _ := auth.GetSwagger()
		fmt.Printf("api def: %+v\n", apiDef)
		b, _ := json.Marshal(apiDef)
		fmt.Println("==================================")
		fmt.Println(string(b))
		fmt.Println("==================================")

		var (
			res *AuthConfig
			err error
		)

		res, err = GenAuthConfig(constant.AUTH_CONFIG_PROVIDER_VIRON, constant.AUTH_CONFIG_TYPE_EMAIL, constant.API_METHOD_POST, constant.EMAIL_SIGNIN_PATH, apiDef)
		if err != nil {
			t.Error(err)
		}
		fmt.Printf("res: %+v\n", res)
		fmt.Println("-------------------------")
		for k, v := range res.PathObject {
			fmt.Printf("k: %s -> v: %+v\n", k, v)
			for kk, vv := range v {
				fmt.Printf("kk: %s -> vv: %+v\n", kk, vv)
				fmt.Println(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
			}
			fmt.Println(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
		}

		res, err = GenAuthConfig(constant.AUTH_CONFIG_PROVIDER_GOOGLE, constant.AUTH_CONFIG_TYPE_OAUTH, constant.API_METHOD_GET, constant.OAUTH2_GOOGLE_AUTHORIZATION_PATH, apiDef)
		if err != nil {
			t.Error(err)
		}
		fmt.Printf("res: %+v\n", res)
		fmt.Println("-------------------------")
		for k, v := range res.PathObject {
			fmt.Printf("k: %s -> v: %+v\n", k, v)
			for kk, vv := range v {
				fmt.Printf("kk: %s -> vv: %+v\n", kk, vv)
				fmt.Println(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
			}
			fmt.Println(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
		}
	*/
}
