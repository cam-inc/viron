import { Link, PageProps } from 'gatsby';
import React from 'react';
import Drawer, { useDrawer } from '$components/drawer';
import Modal, { useModal } from '$components/modal';
import Layout from '$layouts/index';

type Props = PageProps;
const SamplePage: React.FC<Props> = () => {
  const modal = useModal();
  const handleModalOpenClick = function () {
    modal.open();
  };
  const handleModalCloseClick = function () {
    modal.requestClose();
  };

  const drawer = useDrawer();
  const handleDrawerOpenClick = function () {
    drawer.open();
  };
  const handleDrawerCloseClick = function () {
    drawer.requestClose();
  };

  return (
    <Layout>
      <button onClick={handleModalOpenClick}>[open modal]</button>
      <button onClick={handleDrawerOpenClick}>[drawer drawer]</button>
      <Link to="/">TOP</Link>
      <Modal {...modal.bind}>
        <button onClick={handleModalCloseClick}>close</button>
      </Modal>
      <Drawer {...drawer.bind}>
        <button onClick={handleDrawerCloseClick}>toggle drawer</button>
      </Drawer>
    </Layout>
  );
};

export default SamplePage;
