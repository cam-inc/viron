import React from 'react';

type Props = {
  value: string;
};
const Label: React.FC<Props> = ({ value }) => {
  return <p className="text-xxs">{value}</p>;
};
export default Label;
