import { yupResolver } from '@hookform/resolvers/yup';
import _ from 'lodash';
import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { object as yupObject } from 'yup';
import Schema from '$components/schema';
import {
  Parameter,
  Request,
  RequestPayloadParameter,
  Schema as SchemaType,
} from '$types/oas';
import { oasParameter } from '$utils/v8n';

type Props = {
  request: Request;
  onSubmit: (parameters: RequestPayloadParameter[]) => void;
};
const _Request: React.FC<Props> = ({ request, onSubmit }) => {
  const schema = useMemo(
    function () {
      let schema = yupObject();
      if (!!request.operation.parameters) {
        let schemaParameters = yupObject();
        (request.operation.parameters as Parameter[]).forEach((parameter) => {
          schemaParameters = schemaParameters.shape({
            [parameter.name]: oasParameter(parameter),
          });
        });
        schema = schema.shape({
          parameters: schemaParameters,
        });
      }
      return schema;
    },
    [request]
  );
  const { register, formState, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });
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
        onSubmit(parameters);
      });
    },
    [handleSubmit, onSubmit, request.operation.parameters]
  );

  return (
    <div>
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
                        error={formState.errors['parameters']?.[parameter.name]}
                        register={register}
                      />
                    </div>
                  </li>
                )
              )}
            </ul>
          </div>
        )}
        <input type="submit" />
      </form>
    </div>
  );
};
export default _Request;
