import { Link, PageProps } from 'gatsby';
import React, { useState } from 'react';
import Modal from '@components/modal';
import Layout from '@layouts';

type Props = {} & PageProps;
const SamplePage: React.FC<Props> = () => {
  const [isOpened, setIsOpened] = useState(false);
  const handleClick = function () {
    setIsOpened(!isOpened);
  };
  return (
    <Layout>
      <button onClick={handleClick}>toggle modal</button>
      <Link to="/">TOP</Link>
      <Modal isOpened={isOpened}>See me??</Modal>
    </Layout>
  );
};

export default SamplePage;
