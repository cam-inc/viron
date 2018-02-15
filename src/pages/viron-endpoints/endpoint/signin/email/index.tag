viron-endpoints-page-endpoint-signin-email.EndpointsPage_Endpoint_Signin_Email
  .EndpointsPage_Endpoint_Signin_Email__error(if="{ errorMessage }") { errorMessage }
  viron-textinput(placeholder="IDまたはメールアドレス" val="{ mailAddress }" onSubmit="{ handleFromSubmit }" onChange="{ handleMailAddressChange }")
  viron-textinput(placeholder="パスワード" type="password" val="{ password }" onSubmit="{ handleFromSubmit }" onChange="{ handlePasswordChange }")
  viron-button(class="EndpointsPage_Endpoint_Signin_Email__button" label="ログイン" theme="secondary" onSelect="{ handleSigninButtonSelect }")

  script.
    import '../../../../../components/viron-button/index.tag';
    import '../../../../../components/viron-textinput/index.tag';
    import script from './index';
    this.external(script);
