import _ from 'lodash';
import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import Schema from '$components/schema';
import { useEliminate } from '$components/schema/hooks/index';
import {
  DefaultValues,
  Parameter,
  Request,
  RequestPayloadParameter,
  RequestPayloadRequestBody,
  Schema as SchemaType,
} from '$types/oas';
import {
  constructRequestPayloadParameters,
  constructRequestPayloadRequestBody,
  pickContentType,
} from '$utils/oas';

type Props = {
  request: Request;
  defaultValues?: DefaultValues;
  onSubmit: (options?: {
    requestPayloadParameters?: RequestPayloadParameter[];
    requestPayloadRequestBody?: RequestPayloadRequestBody;
  }) => void;
};
const _Request: React.FC<Props> = ({
  request,
  defaultValues = {} as DefaultValues,
  onSubmit,
}) => {
  const {
    register,
    unregister,
    control,
    formState,
    getValues,
    setValue,
    watch,
    setError,
    clearErrors,
    handleSubmit,
  } = useForm({
    defaultValues,
  });
  const { ref, execute } = useEliminate();
  const _handleSubmit = useMemo(
    function () {
      return handleSubmit(function (data) {
        execute(data);
        const payloads: {
          requestPayloadParameters?: RequestPayloadParameter[];
          requestPayloadRequestBody?: RequestPayloadRequestBody;
        } = {};
        const requestPayloadParameters = constructRequestPayloadParameters(
          request.operation.parameters || [],
          data.parameters || {}
        );
        payloads.requestPayloadParameters = requestPayloadParameters;
        if (!!request.operation.requestBody) {
          const requestPayloadRequestBody = constructRequestPayloadRequestBody(
            request.operation.requestBody,
            data.requestBody
          );
          payloads.requestPayloadRequestBody = requestPayloadRequestBody;
        }
        onSubmit(payloads);
      });
    },
    [handleSubmit, onSubmit, request.operation, execute]
  );

  return (
    <div className="text-xxs">
      <form onSubmit={_handleSubmit}>
        <p>
          <span className="mr-4">{request.method.toUpperCase()}</span>
          <span>{request.path}</span>
        </p>
        {!!request.operation.parameters && (
          <div>
            <Schema
              name="parameters"
              schema={{
                type: 'object',
                properties: (function () {
                  const obj: {
                    [key in string]: SchemaType;
                  } = {};
                  request.operation.parameters.forEach(function (parameter) {
                    parameter = parameter as Parameter;
                    obj[parameter.name] = parameter.schema as SchemaType;
                  });
                  return obj;
                })(),
                required: (function () {
                  const arr: string[] = [];
                  request.operation.parameters.forEach(function (parameter) {
                    parameter = parameter as Parameter;
                    if (parameter.required) {
                      arr.push(parameter.name);
                    }
                  });
                  return arr;
                })(),
              }}
              formState={formState}
              register={register}
              unregister={unregister}
              control={control}
              watch={watch}
              getValues={getValues}
              setValue={setValue}
              setError={setError}
              clearErrors={clearErrors}
              required={true}
              isDeepActive={true}
              activeRef={ref}
            />
          </div>
        )}
        {!!request.operation.requestBody && (
          <div>
            <Schema
              name="requestBody"
              schema={
                request.operation.requestBody.content[
                  pickContentType(request.operation.requestBody.content)
                ].schema as SchemaType
              }
              formState={formState}
              register={register}
              unregister={unregister}
              control={control}
              watch={watch}
              getValues={getValues}
              setValue={setValue}
              setError={setError}
              clearErrors={clearErrors}
              required={request.operation.requestBody.required || false}
              isDeepActive={true}
              activeRef={ref}
            />
          </div>
        )}
        <input type="submit" />
      </form>
    </div>
  );
};
export default _Request;
