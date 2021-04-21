import { Link, PageProps } from 'gatsby';
import React, { useCallback, useState } from 'react';
import Drawer from '$components/drawer';
import Modal, { useModal } from '$components/modal';
import Layout from '$layouts/index';

type Props = PageProps;
const SamplePage: React.FC<Props> = () => {
  const ret = useModal({});

  const [isModalOpened, setIsModalOpened] = useState(false);
  const handleModalToggleClick = useCallback(() => {
    setIsModalOpened(!isModalOpened);
  }, [isModalOpened]);
  const handleModalRequestClose = useCallback((accept) => {
    accept(() => {
      setIsModalOpened(false);
    });
  }, []);

  const [isDrawerOpened, setIsDrawerOpened] = useState(false);
  const handleDrawerToggleClick = useCallback(() => {
    setIsDrawerOpened(!isDrawerOpened);
  }, [isDrawerOpened]);
  const handleDrawerRequestClose = useCallback((accept) => {
    accept(() => {
      setIsDrawerOpened(false);
    });
  }, []);

  return (
    <Layout>
      <button onClick={handleModalToggleClick}>[toggle modal]</button>
      <button onClick={handleDrawerToggleClick}>[toggle drawer]</button>
      <Link to="/">TOP</Link>
      <Modal isOpened={isModalOpened} onRequestClose={handleModalRequestClose}>
        <button onClick={handleModalToggleClick}>toggle modal</button>
      </Modal>
      <Drawer
        isOpened={isDrawerOpened}
        onRequestClose={handleDrawerRequestClose}
      >
        <button onClick={handleDrawerToggleClick}>toggle drawer</button>
      </Drawer>
    </Layout>
  );
};

export default SamplePage;
