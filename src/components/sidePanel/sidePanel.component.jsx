import React from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import AccountCircle from '@material-ui/icons/AccountCircle';
import AddCircle from '@material-ui/icons/AddCircle';
import GroupWork from '@material-ui/icons/GroupWork';
import Feedback from '@material-ui/icons/Feedback';
import Notifications from '@material-ui/icons/Notifications';
import Backup from '@material-ui/icons/Backup';
import CompareArrows from '@material-ui/icons/CompareArrows';
import Sort from '@material-ui/icons/Sort';
import ViewList from '@material-ui/icons/ViewList';
import Whatshot from '@material-ui/icons/Whatshot';
import People from '@material-ui/icons/People';

import Auth from 'services/auth';
import Languages from 'components/languages/languages.component';
import NavigationHOC from 'common/navigationHOC/navigationHOC.component';


const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  listItemIcon: {
    minWidth: '40px',
  },
  sideMenu: {
    minHeight: 'calc(100vh - 64px)',
    height: '100%',
  },
});

function SidePanel() {
  const { t } = useTranslation();
  const classes = useStyles({});

  return (
    <Paper square className={classes.sideMenu}>
      <div
        className={classes.fullList}
        role="presentation"
      >
        <List>
          {Auth.hasCredentialLocal('getUser') && (
            <NavigationHOC to="/users">
              {(pathname, handleClick) => (
                <ListItem button onClick={handleClick} selected={(pathname === '/users' || pathname.includes('/users/page'))}>
                  <ListItemIcon className={classes.listItemIcon}>
                    <AccountCircle />
                  </ListItemIcon>
                  <ListItemText primary={t('global.users')} />
                </ListItem>
              )}
            </NavigationHOC>
          )}
          {Auth.hasCredentialLocal('updateUser') && (
            <NavigationHOC to="/users/new">
              {(pathname, handleClick) => (
                <ListItem button onClick={handleClick} selected={pathname === '/users/new'}>
                  <ListItemIcon className={classes.listItemIcon}>
                    <AddCircle />
                  </ListItemIcon>
                  <ListItemText primary={t('global.addUser')} />
                </ListItem>
              )}
            </NavigationHOC>
          )}
        </List>
        <Divider />
        <List>
          {Auth.hasCredentialLocal('getClub') && (
            <NavigationHOC to="/clubs">
              {(pathname, handleClick) => (
                <ListItem button onClick={handleClick} selected={(pathname === '/clubs' || pathname.includes('/clubs/page'))}>
                  <ListItemIcon className={classes.listItemIcon}>
                    <GroupWork />
                  </ListItemIcon>
                  <ListItemText primary={t('global.clubs')} />
                </ListItem>
              )}
            </NavigationHOC>
          )}
          {Auth.hasCredentialLocal('updateClub') && (
            <NavigationHOC to="/clubs-by-power">
              {(pathname, handleClick) => (
                <ListItem button onClick={handleClick} selected={pathname === '/clubs-by-power'}>
                  <ListItemIcon className={classes.listItemIcon}>
                    <Sort />
                  </ListItemIcon>
                  <ListItemText primary={t('global.clubsByPower')} />
                </ListItem>
              )}
            </NavigationHOC>
          )}
          {Auth.hasCredentialLocal('getClub') && (
            <NavigationHOC to="/clubs-by-relations">
              {(pathname, handleClick) => (
                <ListItem button onClick={handleClick} selected={(pathname === '/clubs-by-relations')}>
                  <ListItemIcon className={classes.listItemIcon}>
                    <People />
                  </ListItemIcon>
                  <ListItemText primary={t('global.clubsByRelations')} />
                </ListItem>
              )}
            </NavigationHOC>
          )}
          {Auth.hasCredentialLocal('updateClub') && (
            <NavigationHOC to="/clubs/new">
              {(pathname, handleClick) => (
                <ListItem button onClick={handleClick} selected={pathname === '/clubs/new'}>
                  <ListItemIcon className={classes.listItemIcon}>
                    <AddCircle />
                  </ListItemIcon>
                  <ListItemText primary={t('global.addClub')} />
                </ListItem>
              )}
            </NavigationHOC>
          )}
          {Auth.hasCredentialLocal('getClub') && (
            <NavigationHOC to="/clubs/compare">
              {(pathname, handleClick) => (
                <ListItem button onClick={handleClick} selected={pathname === '/clubs/compare'}>
                  <ListItemIcon className={classes.listItemIcon}>
                    <CompareArrows />
                  </ListItemIcon>
                  <ListItemText primary={t('global.clubsCompare')} />
                </ListItem>
              )}
            </NavigationHOC>
          )}
        </List>
        <Divider />

        {Auth.hasCredentialLocal('getLeague') && (
          <>
            <List>
              <NavigationHOC to="/leagues">
                {(pathname, handleClick) => (
                  <ListItem button onClick={handleClick} selected={pathname === '/leagues' || pathname.includes('/leagues/page')}>
                    <ListItemIcon className={classes.listItemIcon}>
                      <ViewList />
                    </ListItemIcon>
                    <ListItemText primary={t('global.leagues')} />
                  </ListItem>
                )}
              </NavigationHOC>
              {Auth.hasCredentialLocal('updateLeague') && (
                <NavigationHOC to="/leagues/new">
                  {(pathname, handleClick) => (
                    <ListItem button onClick={handleClick} selected={pathname === '/leagues/new'}>
                      <ListItemIcon className={classes.listItemIcon}>
                        <AddCircle />
                      </ListItemIcon>
                      <ListItemText primary={t('global.addLeague')} />
                    </ListItem>
                  )}
                </NavigationHOC>
              )}
            </List>
            <Divider />
          </>
        )}

        {Auth.hasCredentialLocal('updateMatch') && (
          <>
            <List>
              <NavigationHOC to="/matches">
                {(pathname, handleClick) => (
                  <ListItem button onClick={handleClick} selected={pathname === '/matches' || pathname.includes('/matches/page')}>
                    <ListItemIcon className={classes.listItemIcon}>
                      <Whatshot />
                    </ListItemIcon>
                    <ListItemText primary={t('global.matches')} />
                  </ListItem>
                )}
              </NavigationHOC>
              <NavigationHOC to="/matches/new">
                {(pathname, handleClick) => (
                  <ListItem button onClick={handleClick} selected={pathname === '/matches/new'}>
                    <ListItemIcon className={classes.listItemIcon}>
                      <AddCircle />
                    </ListItemIcon>
                    <ListItemText primary={t('global.addMatch')} />
                  </ListItem>
                )}
              </NavigationHOC>
            </List>
            <Divider />
          </>
        )}

        {Auth.hasCredentialLocal('getSuggestion') && (
          <>
            <List>
              <NavigationHOC to="/suggestions">
                {(pathname, handleClick) => (
                  <ListItem button onClick={handleClick} selected={pathname === '/suggestions' || pathname.includes('/suggestions/page')}>
                    <ListItemIcon className={classes.listItemIcon}>
                      <Feedback />
                    </ListItemIcon>
                    <ListItemText primary={t('global.suggestions')} />
                  </ListItem>
                )}
              </NavigationHOC>
            </List>
            <Divider />
          </>
        )}
        
        {Auth.hasCredentialLocal('getActivity') && (
          <>
            <List>
              <NavigationHOC to="/activities">
                {(pathname, handleClick) => (
                  <ListItem button onClick={handleClick} selected={pathname === '/activities' || pathname.includes('/activities/page')}>
                    <ListItemIcon className={classes.listItemIcon}>
                      <Notifications />
                    </ListItemIcon>
                    <ListItemText primary={t('global.activities')} />
                  </ListItem>
                )}
              </NavigationHOC>
            </List>
            <Divider />
          </>
        )}

        {Auth.hasCredentialLocal('getBackup') && (
          <>
            <List>
              <NavigationHOC to="/backups">
                {(pathname, handleClick) => (
                  <ListItem button onClick={handleClick} selected={pathname === '/backups'}>
                    <ListItemIcon className={classes.listItemIcon}>
                      <Backup />
                    </ListItemIcon>
                    <ListItemText primary={t('global.backups')} />
                  </ListItem>
                )}
              </NavigationHOC>
            </List>
            <Divider />
          </>
        )}

        <Languages 
          renderView={({ languages, currentLanguageCode, handleChangeLanguage }) => (
            <List>
              {languages.map(({ code, flag, label }) => ( 
                <ListItem
                  key={code}
                  button
                  onClick={handleChangeLanguage(code)}
                  selected={currentLanguageCode === code}
                >
                  <ListItemIcon className={classes.listItemIcon}>
                    <img src={`/assets/${flag}`} alt="" className="language-flag-image" />
                  </ListItemIcon>
                  <ListItemText primary={label} />
                </ListItem>
              ))}
            </List>
          )}
        />
      </div>
    </Paper>
  );
}

export default SidePanel;
