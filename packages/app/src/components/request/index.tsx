import _ from 'lodash';
import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import Schema from '$components/schema';
import {
  Parameter,
  Request,
  RequestPayloadParameter,
  RequestPayloadRequestBody,
  Schema as SchemaType,
} from '$types/oas';
import { pickContentType } from '$utils/oas';

type Props = {
  request: Request;
  onSubmit: (
    parameters?: RequestPayloadParameter[],
    requestBody?: RequestPayloadRequestBody
  ) => void;
};
const _Request: React.FC<Props> = ({ request, onSubmit }) => {
  const { register, unregister, control, formState, handleSubmit } = useForm();
  const _handleSubmit = useMemo(
    function () {
      return handleSubmit(function (data) {
        const parameters: RequestPayloadParameter[] = [];
        _.forEach(data.parameters || {}, function (value, name) {
          const parameter = (request.operation.parameters as Parameter[]).find(
            (parameter) => parameter.name === name
          );
          if (!parameter) {
            return;
          }
          parameters.push({ ...parameter, value });
        });
        if (!request.operation.requestBody) {
          onSubmit(parameters);
        } else {
          const requestBody: RequestPayloadRequestBody = {
            ...request.operation.requestBody,
            value: data.requestBody,
          };
          onSubmit(parameters, requestBody);
        }
      });
    },
    [handleSubmit, onSubmit, request.operation]
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
            <p>Parameters</p>
            <ul>
              {(request.operation.parameters as Parameter[]).map(
                (parameter) => (
                  <li className="mb-4 last:mb-0" key={parameter.name}>
                    <div>
                      <p>in: {parameter.in}</p>
                      <Schema
                        name={`parameters.${parameter.name}`}
                        schema={parameter.schema as SchemaType}
                        formState={formState}
                        register={register}
                        unregister={unregister}
                        control={control}
                        required={parameter.required}
                      />
                    </div>
                  </li>
                )
              )}
            </ul>
          </div>
        )}
        {!!request.operation.requestBody && (
          <div>
            <p>Request Body</p>
            <div>
              <p>requestBody</p>
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
                required={request.operation.requestBody.required}
              />
            </div>
          </div>
        )}
        <input type="submit" />
      </form>
    </div>
  );
};
export default _Request;
