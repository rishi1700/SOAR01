import React from 'react';
import { Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';

const NotificationsSnackbar = ({ notification, open, onClose }) => {
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
      <Alert onClose={onClose} severity="info" sx={{ width: '100%' }}>
        {notification}
      </Alert>
    </Snackbar>
  );
};

export default NotificationsSnackbar;
