import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

import Api from 'services/api';
import { setIsLoading } from 'components/app/app.actions';
import { compareSuggestionBeforeAfter, formatDate, capitalizeFirstLetter } from 'util/helpers';

import ClubSimple from 'components/suggestions/clubSimple.component';
import ClubComparission from 'components/suggestions/clubComparission.component';
import Field from 'components/suggestions/util/field.component';

function Activity(props) {
  const {
    match: {
      params: {
        id: activityId,
      },
    },
  } = props;

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [state, setState] = useState({
    createdAt: '',
    user: null,
    objectType: null,
    actionType: null,
    before: null,
    after: null,
    comparision: null,
  });
  const [tabValue, setTabValue] = useState('after');

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  }

  const {
    createdAt,
    user,
    objectType,
    actionType,
    before,
    after,
    comparision,
  } = state;

  const fetchData = async () => {
    dispatch(setIsLoading(true));
    const { data: activityData } = await Api.get(`/activities/${activityId}`);

    const {
      createdAt,
      user,
      objectType,
      actionType,
      before,
      after,
    } = activityData;

    setState({
      createdAt,
      user,
      objectType,
      actionType,
      before,
      after,
      comparision: actionType === 'update' ? compareSuggestionBeforeAfter(before, after) : null,
    });

    dispatch(setIsLoading(false));
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (objectType !== 'club' || actionType === 'remove') return (<p>{t('activity.onlyForClub')}</p>);

  return (
    <Box p={3}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper elevation={1}>
            <Field label={`${capitalizeFirstLetter(t('global.by'))}:`} value={user.email} />
            <Divider />
            <Field label={`${capitalizeFirstLetter(t('global.when'))}:`} value={formatDate(createdAt)} />
            <Divider />
          </Paper>
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="center" mt={3}>
        <Paper elevation={2}>
          <Tabs
            value={tabValue}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab
              label={actionType === 'add' ? t('global.new') : t('global.before')}
              disabled={(actionType === 'add')}
              value={actionType === 'add' ? 'add' : 'before'}
            />
            <Tab label={t('global.after')} value="after" />
          </Tabs>
        </Paper>
      </Box>
      <Box mt={3}>
        {actionType === 'add' && <ClubSimple data={after} type="new" />}
        {actionType === 'update' && tabValue === 'before' && <ClubSimple data={before} type="before" />}
        {actionType === 'update' && tabValue === 'after' && <ClubComparission data={after} comparision={comparision} />}
      </Box>
    </Box>
  );
}

export default Activity;
