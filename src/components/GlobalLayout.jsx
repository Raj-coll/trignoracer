// src/components/GlobalLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';

const GlobalLayout = () => {
  return (
    <>
      {/* The FullscreenButton has been correctly removed from this file */}
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default GlobalLayout;