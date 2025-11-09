import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useApp } from '../../contexts/AppContext';

function Notification() {
  const { notifications, removeNotification } = useApp();

  const handleClose = (id) => {
    removeNotification(id);
  };

  return (
    <>
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={true}
          autoHideDuration={5000}
          onClose={() => handleClose(notification.id)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => handleClose(notification.id)}
            severity={notification.type}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
}

export default Notification;