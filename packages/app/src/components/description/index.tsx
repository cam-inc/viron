import React from 'react';
import { CommonMark } from '$types/oas';

type Props = {
  value: string | CommonMark;
};
const Description: React.FC<Props> = ({ value }) => {
  return <p>{value}</p>;
};
export default Description;
