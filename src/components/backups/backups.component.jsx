import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';

import { setMessage, setIsLoading } from 'components/app/app.actions';
import { formatDate } from 'util/helpers';

import Auth from 'services/auth';
import Api from 'services/api';

function Backups() {
  const { t } = useTranslation();
  const dispatch = useDispatch(); 

  const [backups, setBackups] = useState([]);
  const [restoreDialog, setRestoreDialog] = useState({
    isOpened: false,
    fileName: null,
  });
  const [collectionsToRestore, setCollectionsToRestore] = useState([]);

  const {
    isOpened: isDialogOpened,
    fileName,
  } = restoreDialog;

  const hasCreateBackupCredential = Auth.hasCredentialLocal('createBackup');
  const hasRestoreBackupCredential = Auth.hasCredentialLocal('restoreBackup');

  const fetchData = useCallback(async () => {
    dispatch(setIsLoading(true));

    const { data: backups } = await Api.get('/backups');

    setBackups(backups);
    dispatch(setIsLoading(false));
  }, []);

  const restoreBackup = useCallback(async () => {
    dispatch(setIsLoading(true));

    await Api.post('/backups/restore', {
      fileName,
      collectionsToRestore,
    });

    setRestoreDialog({
      fileName: null,
      isOpened: false,
    });

    dispatch(setMessage('success', 'BACKUP_RESTORED'))
    dispatch(setIsLoading(false));
  }, [fileName, collectionsToRestore]);

  const createBackup = useCallback(async () => {
    dispatch(setIsLoading(true));

    await Api.post('/backups/create');
    await fetchData();

    dispatch(setMessage('success', 'BACKUP_CREATED'));
    dispatch(setIsLoading(false));
  }, []);

  const handleOpenDialog = fileName => () => {
    setRestoreDialog({
      fileName,
      isOpened: true,
    });
  };

  const handleCloseDialog = useCallback(() => {
    setRestoreDialog({
      fileName: null,
      isOpened: false,
    });
  }, []);

  const handleChange = useCallback((event, isChecked) => {
    const { target: { value: collectionName } } = event;

    if (isChecked) {
      setCollectionsToRestore([...collectionsToRestore, collectionName]);
    } else {
      setCollectionsToRestore(collectionsToRestore.filter(collection => collection !== collectionName));
    }
  }, [collectionsToRestore]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Paper>
      <Box p={3}>
        <Grid container spacing={2}>
          {hasCreateBackupCredential && (
            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="button" onClick={createBackup} size="large">{t('backups.createBackup')}</Button>
            </Grid>
          )}
          <Grid item xs={12}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('backups.fileName')}</TableCell>
                  <TableCell>{t('backups.createdAt')}</TableCell>
                  {hasRestoreBackupCredential && <TableCell>{t('backups.restore')}</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {backups.map(({ fileName, createdAt }) => (
                  <TableRow key={fileName}>
                    <TableCell>{fileName}</TableCell>
                    <TableCell>{formatDate(createdAt)}</TableCell>
                    {hasRestoreBackupCredential && (
                      <TableCell>
                        <Button variant="contained" color="primary" type="button" onClick={handleOpenDialog(fileName)}>{t('backups.restore')}</Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Dialog
              open={isDialogOpened}
              onClose={handleCloseDialog}
            >
              <DialogTitle>{t('backups.restoreConfirm')}</DialogTitle>
           
              <DialogContent>
                <List>
                  <ListItem>
                    <FormControlLabel
                      control={(
                        <Checkbox
                          checked={collectionsToRestore.includes('clubs')}
                          onChange={handleChange}
                          name="collections"
                          value="clubs"
                        />
                      )}
                      label={t('backups.clubs')}
                    />
                  </ListItem>
                  <ListItem>
                    <FormControlLabel
                      control={(
                        <Checkbox
                          checked={collectionsToRestore.includes('users')}
                          onChange={handleChange}
                          name="collections"
                          value="users"
                        />
                      )}
                      label={t('backups.users')}
                    />
                  </ListItem>
                  <ListItem>
                    <FormControlLabel
                      control={(
                        <Checkbox
                          checked={collectionsToRestore.includes('suggestions')}
                          onChange={handleChange}
                          name="collections"
                          value="suggestions"
                        />
                      )}
                      label={t('backups.suggestions')}
                    />
                  </ListItem>
                  <ListItem>
                    <FormControlLabel
                      control={(
                        <Checkbox
                          checked={collectionsToRestore.includes('roles')}
                          onChange={handleChange}
                          name="collections"
                          value="roles"
                        />
                      )}
                      label={t('backups.roles')}
                    />
                  </ListItem>
                  <ListItem>
                    <FormControlLabel
                      control={(
                        <Checkbox
                          checked={collectionsToRestore.includes('leagues')}
                          onChange={handleChange}
                          name="collections"
                          value="leagues"
                        />
                      )}
                      label={t('backups.leagues')}
                    />
                  </ListItem>
                </List>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleCloseDialog}
                  variant="contained"
                  color="primary"
                >
                  {t('global.close')}
                </Button>
                <Button
                  onClick={restoreBackup}
                  variant="contained"
                  color="secondary"
                  disabled={collectionsToRestore.length === 0}
                >
                  {t('backups.restore')}
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}

export default Backups;
