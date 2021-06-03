import { yupResolver } from '@hookform/resolvers/yup';
import { IconType } from '@react-icons/all-files';
import { AiFillGoogleCircle } from '@react-icons/all-files/ai/AiFillGoogleCircle';
import { AiOutlineLogin } from '@react-icons/all-files/ai/AiOutlineLogin';
import { AiOutlineLogout } from '@react-icons/all-files/ai/AiOutlineLogout';
import { navigate } from 'gatsby';
import React, { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import Textinput from '$components/textinput';
import { AuthType, AuthTypeEmailFormData, Endpoint } from '$types/index';
import { promiseErrorHandler } from '$utils/index';
import { email } from '$utils/v8n';

type PropsOAuth = {
  authType: AuthType;
  endpoint: Endpoint;
};
export const OAuth: React.FC<PropsOAuth> = ({ authType, endpoint }) => {
  let Icon: IconType = AiOutlineLogin;
  if (authType.provider === 'google') {
    Icon = AiFillGoogleCircle;
  }
  const handleClick = function () {
    const origin = new URL(endpoint.url).origin;
    const redirectUrl = encodeURIComponent(
      `${new URL(location.href).origin}/oauthredirect/${endpoint.id}`
    );
    // @ts-ignore
    const fetchUrl = `${origin}${authType.url}?redirect_url=${redirectUrl}`;
    location.href = fetchUrl;
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
  endpoint: Endpoint;
};
export const Email: React.FC<PropsEmail> = ({ authType, endpoint }) => {
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
      const f = async function (): Promise<void> {
        const [response, responseError] = await promiseErrorHandler(
          // TODO: path objectを参照すること。
          // @ts-ignore
          fetch(`${new URL(endpoint.url).origin}${authType.url}`, {
            // @ts-ignore
            method: authType.method,
            body: JSON.stringify(data),
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          })
        );
        if (!!responseError) {
          // TODO
          return;
        }
        if (!response.ok) {
          // TODO
          return;
        }
        navigate(`/endpoints/${endpoint.id}`);
      };
      f();
    },
    [authType]
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
  endpoint: Endpoint;
  onSignout: () => void;
};
export const Signout: React.FC<PropsSignout> = ({
  authType,
  endpoint,
  onSignout,
}) => {
  const handleClick = async function (): Promise<void> {
    const [response, responseError] = await promiseErrorHandler(
      // TODO: path objectを参照すること。
      // @ts-ignore
      fetch(`${new URL(endpoint.url).origin}${authType.url}`, {
        // @ts-ignore
        method: authType.method,
        credentials: 'include',
      })
    );
    if (!!responseError) {
      // TODO
      return;
    }
    if (!response.ok) {
      // TODO
      return;
    }
    onSignout();
  };
  return (
    <div onClick={handleClick}>
      <AiOutlineLogout className="inline" />
      <span>signout</span>
    </div>
  );
};
