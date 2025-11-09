import React from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import Notification from '../Common/Notification';

function Layout({ children }) {
  return (
    <Box sx={{ minHeight: '90vh', backgroundColor: '#f5f5f5' }}>
      {/* Fixed Header */}
      <Header />

      {/* Sidebar + Main content */}
      <Box sx={{ display: 'flex' }}>
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            minHeight: '100vh',
            overflow: 'auto',
          }}
        >
          {children}
        </Box>
      </Box>

      <Notification />
    </Box>
  );
}

export default Layout;
