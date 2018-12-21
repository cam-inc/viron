viron-endpoints-page-endpoint-signin-email.EndpointsPage_Endpoint_Signin_Email
  .EndpointsPage_Endpoint_Signin_Email__error(if="{ errorMessage }") { errorMessage }
  viron-textinput(placeholder="{ i18n('viron_endpoints_endpoint_signin_email_mail_placeholder') }" val="{ mailAddress }" onSubmit="{ handleFromSubmit }" onChange="{ handleMailAddressChange }")
  viron-textinput(placeholder="{ i18n('viron_endpoints_endpoint_signin_email_password_placeholder') }" type="password" val="{ password }" onSubmit="{ handleFromSubmit }" onChange="{ handlePasswordChange }")
  viron-button(class="EndpointsPage_Endpoint_Signin_Email__button" label="{ i18n('viron_endpoints_endpoint_signin_email_login_label') }" theme="secondary" onSelect="{ handleSigninButtonSelect }")

  script.
    import '../../../../../components/viron-button/index.tag';
    import '../../../../../components/viron-textinput/index.tag';
    import script from './index';
    this.external(script);
