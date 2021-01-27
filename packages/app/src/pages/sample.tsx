import { Link, PageProps } from 'gatsby';
import React, { useCallback, useState } from 'react';
import Modal from '@components/modal';
import Layout from '@layouts';

type Props = {} & PageProps;
const SamplePage: React.FC<Props> = () => {
  const [isModalOpened, setIsModalOpened] = useState(false);
  const handleModalToggleClick = useCallback(() => {
    setIsModalOpened(!isModalOpened);
  }, [isModalOpened]);
  const handleModalRequestClose = useCallback((accept) => {
    accept(() => {
      setIsModalOpened(false);
    });
  }, []);
  return (
    <Layout>
      <button onClick={handleModalToggleClick}>toggle modal</button>
      <Link to="/">TOP</Link>
      <Modal isOpened={isModalOpened} onRequestClose={handleModalRequestClose}>
        <button onClick={handleModalToggleClick}>toggle modal</button>
      </Modal>
    </Layout>
  );
};

export default SamplePage;
