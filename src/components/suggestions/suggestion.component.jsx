import React, { useCallback, memo, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

import Api from 'services/api';
import { setMessage, setIsLoading } from 'components/app/app.actions';
import { compareSuggestionBeforeAfter, prepareClubFormData } from 'util/helpers';
import { useButtonStyles } from 'theme/useStyles';

import ClubSimple from './clubSimple.component';
import ClubComparission from './clubComparission.component';

const getCreatedIds = (clubNames, addedClubs) => clubNames.map((clubName) => addedClubs.find(addedClub => addedClub.name === clubName)._id);

function Suggestion(props) {
  const dispatch = useDispatch(); 
  const { t } = useTranslation();

  const {
    hasUpdateSuggestionCredential,
    reload,
    remove,
    suggestion,
  } = props;
  
  const {
    _id: suggestionId,
    type,
    comments,
    data,
    data: {
      name,
      logo,
      tier,
      location,
      friendships,
      agreements,
      positives,
      enemies,
      derbyRivalries,
      satellites,
      satelliteOf,
      friendshipsToCreate,
      agreementsToCreate,
      positivesToCreate,
      enemiesToCreate,
      derbyRivalriesToCreate,
      satellitesToCreate,
      satelliteOfToCreate,
    },
    original,
  } = suggestion;

  useEffect(() => {
    setTabValue('after');
  }, [suggestionId]);

  const buttonClasses = useButtonStyles({});
  const [tabValue, setTabValue] = useState('after');
  const [isRemoveDialogOpened, setIsRemoveDialogOpened] = useState(false);

  const handleOpenRemoveDialog = useCallback(() => {
    setIsRemoveDialogOpened(true);
  }, []);

  const handleCloseRemoveDialog = useCallback(() => {
    setIsRemoveDialogOpened(false);
  }, []);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  }

  const handleApply = useCallback(async () => {
    // Add new clubs
    const clubsToCreate = [
      ...friendshipsToCreate,
      ...agreementsToCreate,
      ...positivesToCreate,
      ...enemiesToCreate,
      // ...derbyRivalriesToCreate, // in future possibly to change as Derby and Enemy can be same
      ...satellitesToCreate,
    ];

    if (satelliteOfToCreate) clubsToCreate.push(satelliteOfToCreate);

    const { data: addedClubs } = await Api.post('/clubs/byNames', {
      clubNames: clubsToCreate,
    });

    // Update or add Club
    let finalSatelliteOf = satelliteOf ? satelliteOf._id : null;
    if (satelliteOfToCreate) finalSatelliteOf = addedClubs.find(addedClub => addedClub.name === satelliteOfToCreate)._id;

    const clubData = {
      name,
      logo,
      tier,
      coordinates: location.coordinates,
      friendships: [...friendships.map(club => club._id), ...getCreatedIds(friendshipsToCreate, addedClubs)],
      agreements: [...agreements.map(club => club._id), ...getCreatedIds(agreementsToCreate, addedClubs)],
      positives: [...positives.map(club => club._id), ...getCreatedIds(positivesToCreate, addedClubs)],
      enemies: [...enemies.map(club => club._id), ...getCreatedIds(enemiesToCreate, addedClubs)],
      // derbyRivalries: [...derbyRivalries.map(club => club._id), ...getCreatedIds(derbyRivalriesToCreate, addedClubs)],
      satellites: [...satellites.map(club => club._id), ...getCreatedIds(satellitesToCreate, addedClubs)],
      satelliteOf: finalSatelliteOf,
    };

    const formData = prepareClubFormData(clubData, ['tier', 'transliterationName', 'searchName']);

    dispatch(setIsLoading(true));

    if (type === 'new') { // New
      await Api.post('/clubs', formData);
    } else { // Edit
      await Api.put(`/clubs/${original._id}`, formData);
    }

    await Api.patch(`/suggestions/${suggestionId}/status`, {
      status: 'applied',
    });

    dispatch(setMessage('success', 'SUGGESTION_APPLIED'));

    dispatch(setIsLoading(false));

    // Reload data
    reload();
  }, [suggestion]);

  const handleDelete = useCallback(() => {
    remove(suggestionId, false);
  }, [suggestionId]);

  const handleDeleteAndMute = useCallback(() => {
    remove(suggestionId, true);
  }, [suggestionId]);

  const comparision = type === 'edit' ? compareSuggestionBeforeAfter(original, data) : null;
  const initialComment = comments.length ? comments[0] : null;

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between">
        {hasUpdateSuggestionCredential && (
          <Button
            variant="contained"
            type="button"
            color="secondary"
            size="large"
            onClick={handleApply}
          >
            {t('suggestions.apply')}
          </Button>
        )}

        <Paper elevation={2}>
          <Tabs
            value={tabValue}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab
              label={type === 'new' ? t('global.new') : t('global.before')}
              disabled={(type === 'new')}
              value={type === 'new' ? 'new' : 'before'}
            />
            <Tab label={t('global.after')} value="after" />
          </Tabs>
        </Paper>

        {hasUpdateSuggestionCredential && (
          <>
            <Dialog
              open={isRemoveDialogOpened}
              onClose={handleCloseRemoveDialog}
            >
              <DialogTitle>{t('suggestions.removeConfirmSingle')}</DialogTitle>
              
              <DialogActions>
                <Button
                  onClick={handleCloseRemoveDialog}
                  variant="contained"
                  color="primary"
                >
                  {t('global.close')}
                </Button>
                <Button
                  onClick={handleDelete}
                  variant="contained"
                  color="primary"
                  className={buttonClasses.remove}
                >
                  {t('suggestions.reject')}
                </Button>
                <Button
                  onClick={handleDeleteAndMute}
                  variant="contained"
                  color="primary"
                  className={buttonClasses.remove}
                >
                  {t('suggestions.rejectAndMute')}
                </Button>
              </DialogActions>
            </Dialog>
            
            <Box display="flex">
              <Button
                variant="contained"
                type="button"
                size="large"
                className={buttonClasses.remove}
                onClick={handleOpenRemoveDialog}
              >
                {t('suggestions.reject')}
              </Button>
            </Box>
          </>
        )}
      </Box>

      <Box mt={3}>
        {type === 'new' && <ClubSimple data={data} type="new" comment={initialComment} />}
        {type === 'edit' && tabValue === 'before' && <ClubSimple data={original} type="before" />}
        {type === 'edit' && tabValue === 'after' && <ClubComparission data={data} comparision={comparision} comment={initialComment} />}
      </Box>
      
    </Box>
  );
}

export default memo(Suggestion);
