import React from 'react';
import Button from '@components/button';

type Props = {};
const IndexPage: React.FC<Props> = () => {
  return (
    <div>
      <p className="font-bold">hello</p>
      <Button label="button" />
    </div>
  );
};

export default IndexPage;
