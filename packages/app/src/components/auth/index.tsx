import { yupResolver } from '@hookform/resolvers/yup';
import { IconType } from '@react-icons/all-files';
import { AiFillGoogleCircle } from '@react-icons/all-files/ai/AiFillGoogleCircle';
import { AiOutlineLogin } from '@react-icons/all-files/ai/AiOutlineLogin';
import { AiOutlineLogout } from '@react-icons/all-files/ai/AiOutlineLogout';
import React, { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import Textinput from '$components/textinput';
import { AuthType, AuthTypeEmailFormData } from '$types/index';
import { email } from '$utils/v8n';

type Props = {
  authType: AuthType;
  onOAuthSignin: (authType: AuthType) => void;
  onEmailSignin: (authType: AuthType, data: AuthTypeEmailFormData) => void;
  onSignout: (authType: AuthType) => void;
};
const Auth: React.FC<Props> = ({
  authType,
  onOAuthSignin,
  onEmailSignin,
  onSignout,
}) => {
  const handleOAuthSignin = function (authType: AuthType) {
    onOAuthSignin(authType);
  };
  const handleEmailSignin = function (
    authType: AuthType,
    data: AuthTypeEmailFormData
  ) {
    onEmailSignin(authType, data);
  };
  const handleSignout = function (authType: AuthType) {
    onSignout(authType);
  };
  if (authType.type === 'oauth') {
    return <AuthOAuth authType={authType} onSignin={handleOAuthSignin} />;
  }
  if (authType.type === 'email') {
    return <AuthEmail authType={authType} onSignin={handleEmailSignin} />;
  }
  if (authType.type === 'signout') {
    return <AuthSignout authType={authType} onSignout={handleSignout} />;
  }
  return null;
};
export default Auth;

type PropsOAuth = {
  authType: AuthType;
  onSignin: (authType: AuthType) => void;
};
const AuthOAuth: React.FC<PropsOAuth> = ({ authType, onSignin }) => {
  let Icon: IconType = AiOutlineLogin;
  if (authType.provider === 'google') {
    Icon = AiFillGoogleCircle;
  }
  const handleClick = function () {
    onSignin(authType);
  };
  return (
    <div onClick={handleClick}>
      <Icon className="inline" />
      <span>OAuth</span>
    </div>
  );
};

type PropsEmail = {
  authType: AuthType;
  onSignin: (authType: AuthType, data: AuthTypeEmailFormData) => void;
};
const AuthEmail: React.FC<PropsEmail> = ({ authType, onSignin }) => {
  const schema = useMemo(function () {
    return yup.object().shape({
      email: email.required(),
      password: yup.string().required(),
    });
  }, []);

  const { register, handleSubmit, formState } = useForm<AuthTypeEmailFormData>({
    resolver: yupResolver(schema),
  });
  const signin = useCallback(
    function (data: AuthTypeEmailFormData) {
      onSignin(authType, data);
    },
    [authType, onSignin]
  );
  return (
    <form onSubmit={handleSubmit(signin)}>
      <Textinput
        label="email"
        error={formState.errors.email}
        render={function (
          className
        ): React.ReactElement<JSX.IntrinsicElements['input'], 'input'> {
          return (
            <input
              className={className}
              defaultValue=""
              {...register('email')}
            />
          );
        }}
      />
      <Textinput
        label="password"
        error={formState.errors.password}
        render={function (
          className
        ): React.ReactElement<JSX.IntrinsicElements['input'], 'input'> {
          return (
            <input
              type="password"
              className={className}
              defaultValue=""
              {...register('password')}
            />
          );
        }}
      />
      <input type="submit" />
    </form>
  );
};

type PropsSignout = {
  authType: AuthType;
  onSignout: (authType: AuthType) => void;
};
const AuthSignout: React.FC<PropsSignout> = ({ authType, onSignout }) => {
  const handleClick = function () {
    onSignout(authType);
  };
  return (
    <div onClick={handleClick}>
      <AiOutlineLogout className="inline" />
      <span>signout</span>
    </div>
  );
};
