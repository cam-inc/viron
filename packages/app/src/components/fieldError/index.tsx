import React from 'react';
import { FieldError as FieldErrorType } from 'react-hook-form';

type Props = {
  error: FieldErrorType;
};
const FieldError: React.FC<Props> = ({ error }) => {
  return <p>{error.message}</p>;
};
export default FieldError;
