// src/components/GlobalLayout.jsx - NEW FILE

import React from 'react';
import { Outlet } from 'react-router-dom'; // IMPORTANT: From React Router
import FullscreenButton from './FullscreenButton';

const GlobalLayout = () => {
  return (
    <>
      {/* This button will now appear on every screen wrapped by this layout */}
      <FullscreenButton />

      {/* The Outlet component renders the current route's component */}
      {/* (e.g., StartScreen, LevelSelectionScreen, etc.) */}
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default GlobalLayout;