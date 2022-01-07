import classnames from 'classnames';
import React, { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Props as BaseProps } from '~/components';
import ChevronDownIcon from '~/components/icon/chevronDown/outline';
import ChevronRightIcon from '~/components/icon/chevronRight/outline';
import Operation from '~/components/operation';
import Schema from '~/components/schema';
import { useEliminate } from '~/components/schema/hooks/index';
import { Endpoint } from '~/types/index';
import {
  Document,
  Request,
  RequestValue,
  Schema as SchemaType,
} from '~/types/oas';
import { pickContentType } from '~/utils/oas';

export type Props = BaseProps & {
  endpoint: Endpoint;
  document: Document;
  request: Request;
  defaultValues?: RequestValue;
  onSubmit: (requestValue: RequestValue) => void;
  renderHead?: () => JSX.Element | null;
};
const _Request: React.FC<Props> = ({
  on,
  endpoint,
  document,
  request,
  defaultValues = {} as RequestValue,
  onSubmit,
  className = '',
  renderHead,
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
        onSubmit(data as RequestValue);
      });
    },
    [handleSubmit, onSubmit, execute]
  );

  // Common head open status.
  const [isCommonHeadOpened, setIsCommonHeadOpened] = useState<boolean>(true);
  const handleCommonHeadOpenerClick = useCallback(
    function (e: React.MouseEvent<HTMLButtonElement>) {
      e.preventDefault();
      setIsCommonHeadOpened(!isCommonHeadOpened);
    },
    [isCommonHeadOpened]
  );

  return (
    <div className={classnames('text-xxs', className)}>
      <form className="h-full flex flex-col" onSubmit={_handleSubmit}>
        {/* Custom Head */}
        {renderHead && (
          <div
            className={classnames(
              'flex-none p-2 border-b-2',
              `border-thm-on-${on}-faint`
            )}
          >
            {renderHead()}
          </div>
        )}
        {/* Common Head */}
        <div
          className={classnames(
            'flex-none flex gap-2 border-b-2',
            `text-thm-on-${on} border-thm-on-${on}-faint`
          )}
        >
          <div className={classnames('flex-none p-2', `bg-on-thm-${on}-faint`)}>
            <div className="flex items-center h-[22px]">
              <button
                type="button"
                className="text-sm"
                onClick={handleCommonHeadOpenerClick}
              >
                {isCommonHeadOpened ? (
                  <ChevronDownIcon className="w-em" />
                ) : (
                  <ChevronRightIcon className="w-em" />
                )}
              </button>
            </div>
          </div>
          <div className="flex-1 p-2">
            <div className="flex items-center gap-2 text-sm">
              <div>{request.method.toUpperCase()}</div>
              <div>{request.path}</div>
            </div>
            {isCommonHeadOpened && (
              <div
                className={classnames(
                  'pt-2 mt-2 border-t',
                  `border-thm-on-${on}-faint`
                )}
              >
                <Operation
                  on={on}
                  document={document}
                  operation={request.operation}
                />
              </div>
            )}
          </div>
        </div>
        {/* Body */}
        <div className="flex-1 flex flex-col gap-2 p-2 min-h-0 overflow-y-scroll overscroll-y-contain">
          {!!request.operation.parameters && (
            <Schema
              endpoint={endpoint}
              document={document}
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
          )}
          {!!request.operation.requestBody && (
            <Schema
              endpoint={endpoint}
              document={document}
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
          )}
        </div>
        {/* Tail */}
        <div
          className={classnames(
            'flex-none p-2 border-t-2',
            `border-thm-on-${on}-faint`
          )}
        >
          <button className="w-full" type="submit">
            submit
          </button>
        </div>
      </form>
    </div>
  );
};
export default _Request;
