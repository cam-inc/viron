import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { On } from '$constants/index';
import Button from '$components/button';
import Operation from '$components/operation';
import Schema from '$components/schema';
import { useEliminate } from '$components/schema/hooks/index';
import {
  Document,
  Request,
  RequestValue,
  Schema as SchemaType,
} from '$types/oas';
import { pickContentType } from '$utils/oas';

type Props = {
  on: On;
  document: Document;
  request: Request;
  defaultValues?: RequestValue;
  onSubmit: (requestValue: RequestValue) => void;
};
const _Request: React.FC<Props> = ({
  on,
  document,
  request,
  defaultValues = {} as RequestValue,
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
        console.log(data);
        onSubmit(data as RequestValue);
      });
    },
    [handleSubmit, onSubmit, execute]
  );

  return (
    <div className="text-xxs">
      <form onSubmit={_handleSubmit}>
        <div>
          <div>{request.method.toUpperCase()}</div>
          <div>{request.path}</div>
          <Operation
            on={on}
            document={document}
            operation={request.operation}
          />
        </div>
        {!!request.operation.parameters && (
          <div>
            <Schema
              on={on}
              name="parameters"
              schema={{
                type: 'object',
                properties: (function () {
                  const obj: {
                    [key in string]: SchemaType;
                  } = {};
                  request.operation.parameters.forEach(function (parameter) {
                    obj[parameter.name] = {
                      deprecated: parameter.deprecated,
                      ...parameter.schema,
                    } as SchemaType;
                  });
                  return obj;
                })(),
                required: (function () {
                  const arr: string[] = [];
                  request.operation.parameters.forEach(function (parameter) {
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
              on={on}
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
        <Button on="surface" size="xs" type="submit" label="submit" />
      </form>
    </div>
  );
};
export default _Request;
