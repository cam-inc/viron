import _ from 'lodash';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';

type Props = {
  name: string;
  errors: UseFormReturn['formState']['errors'];
};
const FieldError: React.FC<Props> = ({ name, errors }) => {
  const error = _.get(errors, name);
  if (!error) {
    return null;
  }
  return <p className="font-bold text-red-500">{error.message}</p>;
};
export default FieldError;
