import React from 'react';
import { PageProps } from 'gatsby';

import Button from '@components/button';
import Layout from '@layouts';
import { useState } from '@state';
import { foo as fooState } from '@state/atoms/sample';

type Props = {} & PageProps;
const IndexPage: React.FC<Props> = () => {
  const [foo, setFoo] = useState(fooState);
  const handleClick = function () {
    setFoo(`foo-${Math.random()}`);
  };
  return (
    <Layout>
      <div id="page-index">
        <p>foo: {foo}</p>
        <button onClick={handleClick}>setFoo</button>
        <p className="font-bold">hello</p>
        <Button label="button" />
      </div>
    </Layout>
  );
};

export default IndexPage;
