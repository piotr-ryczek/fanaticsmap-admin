import React, { useMemo, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';

import Auth from 'services/auth';
import Api from 'services/api';

import TableList from 'common/tableList/tableList.component';
import { setMessage, setIsLoading } from 'components/app/app.actions';

function Leagues(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [infoDialog, setInfoDialog] = useState({
    opened: false,
    updated: 0,
    added: 0,
  });

  const {
    opened,
    updated,
    added,
  } = infoDialog;

  const columns = useMemo(() => ([{
    name: 'name',
    type: 'text'
  }, {
    name: 'importanceModifier',
    type: 'text'
  },{
    name: 'tier',
    headerLabel: 'leagueTier',
    type: 'text'
  }, {
    name: 'nrClubs',
    type: 'function',
    displayFunction: ({ clubs }) => clubs.length,
  }, {
    name: 'isAutomaticDownload',
    type: 'boolean'
  }]), []);

  const hasEditCredential = Auth.hasCredentialLocal('updateLeague');

  const downloadMatches = useCallback(async (leagueId) => {
    dispatch(setIsLoading(true));
    
    const {
      // matches,
      added,
      updated,
    } = await Api.post(`/leagues/${leagueId}/downloadMatches`);

    setInfoDialog({
      opened: true,
      added,
      updated,
    });

    dispatch(setMessage('success', 'LEAGUE_MATCHES_DOWNLOADED'));
    dispatch(setIsLoading(false));
  }, []);

  const actions = useMemo(() => ([{
    label: 'Pobierz mecze',
    action: downloadMatches
  }]), []);

  const handleCloseDialog = useCallback(() => {
    setInfoDialog({
      opened: false,
      added: 0,
      updated: 0,
    });
  }, []);

  const handleDownloadAll = useCallback(async () => {
    dispatch(setIsLoading(true));

    const {
      // matches,
      added,
      updated,
    } = await Api.post('/leagues/downloadMatches');

    setInfoDialog({
      opened: true,
      added,
      updated,
    });

    dispatch(setIsLoading(false));
  }, []);

  return (
    <>
      {opened && (
        <Dialog
          open={opened}
          onClose={handleCloseDialog}
        >
          <DialogTitle>{t('leagueDownloadMatches.title')}</DialogTitle>
        
          <DialogContent>
            <List>
              <ListItem>{t('leagueDownloadMatches.added', { added })}</ListItem>
              <ListItem>{t('leagueDownloadMatches.updated', { updated })}</ListItem>
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
          </DialogActions>
        </Dialog>
      )}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Button
            onClick={handleDownloadAll}
            variant="contained"
            color="primary"
            size="large"
          >
            {t('global.downloadFromAllLeagues')}
          </Button>
        </Grid>
        <Grid item xs={12}>
          <TableList
            {...props}
            apiPath="/leagues"
            adminPath="/leagues"
            canAdd
            canEdit
            canRemove
            columns={columns}
            hasEditCredential={hasEditCredential}
            actions={actions}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default Leagues;
