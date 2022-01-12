import { navigate } from 'gatsby';
import { parse } from 'query-string';
import React, { useCallback, useEffect, useState } from 'react';
import FilledButton, {
  Props as FilledButtonProps,
} from '~/components/button/filled';
import Error from '~/components/error';
import { BaseError } from '~/errors/index';
import { useEndpoint } from '~/hooks/endpoint';
import { Props as LayoutProps } from '~/layouts';
import { COLOR_SYSTEM, Endpoint } from '~/types';

export type Props = Parameters<LayoutProps['renderBody']>[0] & {
  search: string;
};
const Body: React.FC<Props> = ({ style, className = '', search }) => {
  const { connect, addEndpoint } = useEndpoint();
  const [error, setError] = useState<BaseError | null>(null);
  const [isPending, setIsPending] = useState<boolean>(true);

  useEffect(() => {
    setError(null);
    setIsPending(true);

    const queries = parse(search);
    let endpoint: Endpoint;
    try {
      endpoint = JSON.parse(queries.endpoint as string) as Endpoint;
    } catch {
      setError(new BaseError('Broken endpoint data.'));
      setIsPending(false);
      return;
    }

    const f = async () => {
      const connection = await connect(endpoint.url);
      if (connection.error) {
        setError(connection.error);
        setIsPending(false);
        return;
      }
      const addition = await addEndpoint(endpoint, {
        resolveDuplication: true,
      });
      if (addition.error) {
        setError(addition.error);
        setIsPending(false);
        return;
      }
      setError(null);
      setIsPending(false);
    };
    f();
  }, []);

  const handleButtonClick = useCallback<FilledButtonProps['onClick']>(() => {
    navigate('/dashboard/endpoints');
  }, []);

  if (isPending) {
    return (
      <div style={style} className={className}>
        <div className="p-2">TODO: pending...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div style={style} className={className}>
        <div className="p-2">
          <Error on={COLOR_SYSTEM.BACKGROUND} error={error} />;
        </div>
      </div>
    );
  }

  return (
    <div style={style} className={className}>
      <div className="p-2">
        <div>TODO: import完了</div>
        <FilledButton
          cs={COLOR_SYSTEM.PRIMARY}
          label="Back to Dashboard"
          onClick={handleButtonClick}
        />
      </div>
    </div>
  );
};
export default Body;
