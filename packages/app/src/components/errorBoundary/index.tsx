import React from 'react';
import { error as logError, NAMESPACE } from '$utils/logger/index';

type FallbackProps = {
  error: Error;
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
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
    onReset?: (...args: Array<unknown>) => void;
    onResetKeysChange?: (
      prevResetKeys: Array<unknown> | undefined,
      resetKeys: Array<unknown> | undefined
    ) => void;
  }>
>;
type State = {
  error: Error | null;
};
const initialState: State = { error: null };
const changedArray = function (a: Array<unknown> = [], b: Array<unknown> = []) {
  return (
    a.length !== b.length || a.some((item, index) => !Object.is(item, b[index]))
  );
};

class ErrorBoundary extends React.Component<Props, State> {
  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  state = initialState;
  updatedWithError = false;

  resetErrorBoundary = (...args: Array<unknown>) => {
    this.props.onReset?.(...args);
    this.reset();
  };

  reset() {
    this.updatedWithError = false;
    this.setState(initialState);
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError?.(error, errorInfo);
    logError({
      messages: [error, errorInfo],
      namespace: NAMESPACE.REACT_COMPONENT,
    });
  }

  componentDidMount() {
    const { error } = this.state;

    if (error !== null) {
      this.updatedWithError = true;
    }
  }

  componentDidUpdate(prevProps: Props) {
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

  render() {
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

    // Default error UI.
    // TODO: 良い見た目に。
    return <p>Error!!</p>;
  }
}

export default ErrorBoundary;
