import React from 'react';

type Props = {
  className?: string;
};
const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div id="layout" className="bg-gray-300">
      {children}
    </div>
  );
};

export default Layout;
