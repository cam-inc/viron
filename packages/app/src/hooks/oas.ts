import _ from 'lodash';
import { useState, useCallback } from 'react';
import { Endpoint } from '$types/index';
import {
  Document,
  OperationId,
  Request,
  RequestPayloadParameter,
  RequestPayloadRequestBody,
} from '$types/oas';
import { promiseErrorHandler } from '$utils/index';
import {
  getRequestObject,
  getURLToTargetHost,
  pickContentType,
} from '$utils/oas';
import { serialize } from '$utils/style';
import { parse } from '$utils/uriTemplate';

export const useFetch = function <R>(
  endpoint: Endpoint,
  document: Document,
  { operationId }: { operationId?: OperationId }
): {
  isPending: boolean;
  error: Error | null;
  response: Response | null;
  responseJson: R | null;
  fetch: (
    parameters?: RequestPayloadParameter[],
    requestBody?: RequestPayloadRequestBody
  ) => Promise<void>;
  requestObject: Request | null;
} {
  const requestObject = useRequestObject(document, { operationId });
  const [isPending, setIsPending] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(
    !!requestObject ? null : new Error('request object not found.')
  );
  const [response, setResponse] = useState<Response | null>(null);
  const [responseJson, setResponseJson] = useState<R | null>(null);

  const fetch = useCallback(
    async function (
      parameters: RequestPayloadParameter[] = [],
      requestBody: RequestPayloadRequestBody | undefined
    ) {
      if (!requestObject) {
        return;
      }
      setIsPending(true);
      setResponse(null);
      setResponseJson(null);
      setError(null);

      const headers: HeadersInit = {};
      const queryParams: { [key in string]: string } = {};
      const pathParams: { [key in string]: string } = {};
      parameters
        .filter((parameter) => parameter.in === 'header')
        .forEach((parameter) => {
          // The style value in parameter object defaults to `simple` when `in` value is `header`.
          const style = parameter.style || 'simple';
          // The explode value in parameter object defaults to `true` when `style` value is `form`.
          // @see:https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#fixed-fields-10
          const explode = _.isUndefined(parameter.explode)
            ? style === 'form'
              ? true
              : false
            : parameter.explode;
          // @see: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#parameter-object
          headers[parameter.name] = serialize(
            parameter.name,
            parameter.value,
            style,
            explode
          );
        });
      parameters
        .filter((parameter) => parameter.in === 'cookie')
        .forEach((parameter) => {
          // The style value in parameter object defaults to `form` when `in` value is `cookie`.
          const style = parameter.style || 'form';
          // The explode value in parameter object defaults to `true` when `style` value is `form`.
          // @see:https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#fixed-fields-10
          const explode = _.isUndefined(parameter.explode)
            ? style === 'form'
              ? true
              : false
            : parameter.explode;
          headers['Cookie'] = serialize(
            parameter.name,
            parameter.value,
            style,
            explode
          );
          // TODO: in='cookie'が複数ある場合への対応。
          // TODO: そもそもfetchでCookieリクエストヘッダーを指定できない説。
        });
      parameters
        .filter((parameter) => parameter.in === 'query')
        .forEach((parameter) => {
          // The style value in parameter object defaults to `form` when `in` value is `query`.
          const style = parameter.style || 'form';
          // The explode value in parameter object defaults to `true` when `style` value is `form`.
          // @see:https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#fixed-fields-10
          const explode = _.isUndefined(parameter.explode)
            ? style === 'form'
              ? true
              : false
            : parameter.explode;
          queryParams[parameter.name] = serialize(
            parameter.name,
            parameter.value,
            style,
            explode
          );
        });
      parameters
        .filter((parameter) => parameter.in === 'path')
        .forEach((parameter) => {
          // The style value in parameter object defaults to `simple` when `in` value is `path`.
          const style = parameter.style || 'simple';
          // The explode value in parameter object defaults to `true` when `style` value is `form`.
          // @see:https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.2.md#fixed-fields-10
          const explode = _.isUndefined(parameter.explode)
            ? style === 'form'
              ? true
              : false
            : parameter.explode;
          pathParams[parameter.name] = serialize(
            parameter.name,
            parameter.value,
            style,
            explode
          );
        });
      const requestInfo: RequestInfo = `${getURLToTargetHost(
        endpoint,
        document
      )}${parse(requestObject.path, pathParams)}?${_.map(
        queryParams,
        (value) => value
      ).join('&')}`;
      const requestInit: RequestInit = {
        method: requestObject.method,
        mode: 'cors',
        credentials: 'include',
        headers,
      };
      // TODO: check the method name
      if (!!requestBody) {
        const contentType = pickContentType(requestBody.content);
        headers['Content-Type'] = contentType;
        requestInit.body = convert(requestBody.value, contentType);
      }
      const [response, responseError] = await promiseErrorHandler<Response>(
        window.fetch(requestInfo, requestInit)
      );

      if (!!responseError) {
        // Network error occured.
        setError(responseError);
        setIsPending(false);
        return;
      }
      if (!response.ok) {
        // The authorization cookie is not valid or any other reasons.
        setError(new Error(`${response.status}: ${response.statusText}`));
        setIsPending(false);
        return;
      }
      setResponse(response);
      const json = await response.json();
      setResponseJson(json as R);
      setIsPending(false);
    },
    [endpoint, document, requestObject]
  );

  return {
    isPending,
    error,
    response,
    responseJson,
    fetch,
    requestObject,
  };
};

export const useRequestObject = function (
  document: Document,
  { operationId }: { operationId?: OperationId }
): Request | null {
  const requestObject = getRequestObject(document, { operationId });
  if (!requestObject) {
    return null;
  }
  return requestObject;
};

const convert = function (
  value: RequestPayloadRequestBody['value'],
  contentType: string
): string {
  switch (contentType) {
    case 'application/json':
      return JSON.stringify(value);
    case 'application/x-www-form-urlencoded':
      // TODO
      return JSON.stringify(value);
    case 'application/octet-stream':
      // TODO
      return JSON.stringify(value);
    case 'multipart/form-data':
      // TODO
      return JSON.stringify(value);
    case 'image/jpeg':
    case 'image/png':
      // TODO
      return JSON.stringify(value);
    default:
      throw new Error(`Media type not supported. ${contentType}`);
  }
};
