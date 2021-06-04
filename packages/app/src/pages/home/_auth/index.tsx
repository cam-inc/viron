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
import { AuthConfig, AuthConfigEmailFormData, Endpoint } from '$types/index';
import { Method, Operation } from '$types/oas';
import { promiseErrorHandler } from '$utils/index';
import { email } from '$utils/v8n';

type PropsOAuth = {
  authConfig: AuthConfig;
  endpoint: Endpoint;
};
export const OAuth: React.FC<PropsOAuth> = ({ authConfig, endpoint }) => {
  const { pathObject } = authConfig;
  // TODO: hooks/oasを利用したい。
  const pathname = Object.keys(pathObject)[0];
  //const pathItem = pathObject[pathname];
  //const method = Object.keys(pathItem)[0] as Method;
  //const operation = pathItem[method];

  // TODO: operation仕様に合わせること。
  let Icon: IconType = AiOutlineLogin;
  if (authConfig.provider === 'google') {
    Icon = AiFillGoogleCircle;
  }
  const handleClick = async function () {
    //const origin = new URL(endpoint.url).origin;
    const redirectUrl = encodeURIComponent(
      `${new URL(location.href).origin}/oauthredirect?endpointId=${endpoint.id}`
    );
    const [response, responseError] = await promiseErrorHandler(
      fetch(
        `${new URL(endpoint.url).origin}${pathname}?endpointId=${
          endpoint.id
        }&redirect_uri=${redirectUrl}`
      )
    );
    if (!!responseError) {
      // TODO
      return;
    }
    if (!response.ok) {
      // TODO
      return;
    }
    location.href = 'TODO: response.body';
  };
  return (
    <div onClick={handleClick}>
      <Icon className="inline" />
      <span>OAuth</span>
    </div>
  );
};

type PropsEmail = {
  authConfig: AuthConfig;
  endpoint: Endpoint;
};
export const Email: React.FC<PropsEmail> = ({ authConfig, endpoint }) => {
  const { pathObject } = authConfig;
  // TODO: hooks/oasを利用したい。
  const pathname = Object.keys(pathObject)[0];
  const pathItem = pathObject[pathname];
  const method = Object.keys(pathItem)[0] as Method;
  //const operation = pathItem[method];

  // TODO: operation仕様に合わせること。
  const schema = useMemo(function () {
    return yup.object().shape({
      email: email.required(),
      password: yup.string().required(),
    });
  }, []);

  const { register, handleSubmit, formState } =
    useForm<AuthConfigEmailFormData>({
      resolver: yupResolver(schema),
    });
  const signin = useCallback(
    function (data: AuthConfigEmailFormData) {
      const f = async function (): Promise<void> {
        const [response, responseError] = await promiseErrorHandler(
          fetch(`${new URL(endpoint.url).origin}${pathname}`, {
            method,
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
    [authConfig]
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
  authConfig: AuthConfig;
  endpoint: Endpoint;
  onSignout: () => void;
};
export const Signout: React.FC<PropsSignout> = ({
  authConfig,
  endpoint,
  onSignout,
}) => {
  const handleClick = async function (): Promise<void> {
    const { pathObject } = authConfig;
    // TODO: hooks/oasを利用したい。
    const pathname = Object.keys(pathObject)[0];
    const pathItem = pathObject[pathname];
    const method = Object.keys(pathItem)[0] as Method;
    const [response, responseError] = await promiseErrorHandler(
      fetch(`${new URL(endpoint.url).origin}${pathname}`, {
        method,
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
