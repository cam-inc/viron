import React from 'react';
import Error from '$components/error';
import { BaseError } from '$errors/index';

type FallbackProps = {
  error: BaseError;
  resetErrorBoundary: (...args: Array<unknown>) => void;
};

type Props = React.PropsWithRef<
  React.PropsWithChildren<{
    fallback?: React.ReactElement<
      unknown,
      string | React.FunctionComponent | typeof React.Component
    >;
    fallbackRender?: (
      props: FallbackProps
    ) => React.ReactElement<
      unknown,
      string | React.FunctionComponent | typeof React.Component
    >;
    FallbackComponent?: React.ComponentType<FallbackProps>;
    resetKeys?: Array<unknown>;
    onError?: (error: BaseError, errorInfo: React.ErrorInfo) => void;
    onReset?: (...args: Array<unknown>) => void;
    onResetKeysChange?: (
      prevResetKeys: Array<unknown> | undefined,
      resetKeys: Array<unknown> | undefined
    ) => void;
  }>
>;
type State = {
  error: BaseError | null;
};
const initialState: State = { error: null };
const changedArray = function (a: Array<unknown> = [], b: Array<unknown> = []) {
  return (
    a.length !== b.length || a.some((item, index) => !Object.is(item, b[index]))
  );
};

class ErrorBoundary extends React.Component<Props, State> {
  static getDerivedStateFromError(error: BaseError): { error: BaseError } {
    return { error };
  }

  state = initialState;
  updatedWithError = false;

  resetErrorBoundary = (...args: Array<unknown>): void => {
    this.props.onReset?.(...args);
    this.reset();
  };

  reset(): void {
    this.updatedWithError = false;
    this.setState(initialState);
  }

  componentDidCatch(error: BaseError, errorInfo: React.ErrorInfo): void {
    this.props.onError?.(error, errorInfo);
  }

  componentDidMount(): void {
    const { error } = this.state;

    if (error !== null) {
      this.updatedWithError = true;
    }
  }

  componentDidUpdate(prevProps: Props): void {
    const { error } = this.state;
    const { resetKeys } = this.props;
    if (error !== null && !this.updatedWithError) {
      this.updatedWithError = true;
      return;
    }
    if (error !== null && changedArray(prevProps.resetKeys, resetKeys)) {
      this.props.onResetKeysChange?.(prevProps.resetKeys, resetKeys);
      this.reset();
    }
  }

  render(): React.ReactNode {
    const { error } = this.state;

    if (error === null) {
      return this.props.children;
    }

    const { fallback, fallbackRender, FallbackComponent } = this.props;
    const props: FallbackProps = {
      error,
      resetErrorBoundary: this.resetErrorBoundary,
    };
    if (React.isValidElement(fallback)) {
      return fallback;
    }
    if (typeof fallbackRender === 'function') {
      return fallbackRender(props);
    }
    if (FallbackComponent) {
      return <FallbackComponent {...props} />;
    }

    return <Error error={error} />;
  }
}

export default ErrorBoundary;
