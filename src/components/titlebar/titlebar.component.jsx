import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import Auth from 'services/auth';

const useStyles = makeStyles(theme => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  logoutButton: {
    marginLeft: 'auto',
  }
}));

function Titlebar() {
  const { t } = useTranslation();
  const classes = useStyles({});

  const isAuthenticated = useSelector(state => state.app.isAuthenticated);

  const handleLogout = useCallback(async () => {
    await Auth.logout();
  }, []);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">
          Fanatics Map Admin
        </Typography>

        {isAuthenticated && <Button variant="contained" color="default" type="button" onClick={handleLogout} className={classes.logoutButton}>{t('global.logout')}</Button>}
      </Toolbar>
    </AppBar>
  );
}

export default Titlebar;
