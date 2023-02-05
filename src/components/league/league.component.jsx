import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
// import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';

import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';

import history from 'config/history';
import leagueSchema from 'schemas/league';
import Api from 'services/api';

import { setMessage, setIsLoading } from 'components/app/app.actions';

import LeagueForm from './leagueForm.component';

function League(props) {
  const {
    editType,
    match: {
      params: {
        id: leagueId,
      },
    },
  } = props;

  // const { t } = useTranslation();
  const dispatch = useDispatch();

  const [fields, setFields] = useState({
    name: '',
    downloadMethod: '',
    downloadUrl: '',
    clubs: [],
    importanceModifier: 1,
    sport: '',
    tier: 1,
    isAutomaticDownload: true,
    seasonStartYear: '',
    seasonEndYear: '',
    seasonMonthUntil: 7,
  });

  const fetchData = async () => {
    dispatch(setIsLoading(true));

    const { data: leagueData } = await Api.get(`/leagues/${leagueId}`);

    setFields(leagueData);
    dispatch(setIsLoading(false));
  }

  useEffect(() => {
    if (editType === 'update') {
      fetchData();
    }
  }, []);

  const handleSubmit = useCallback(async (values) => {
    dispatch(setIsLoading(true));

    const { clubs } = values;

    const parsedValues = {
      ...values,
      clubs: clubs.map(({ _id: clubId }) => clubId),
    }

    if (editType === 'new') {
      const { data: leagueId } = await Api.post(`/leagues`, parsedValues);

      dispatch(setMessage('success', 'LEAGUE_ADDED_SUCCESS'));
      history.push(`/leagues/${leagueId}`);

    } else {
      await Api.put(`/leagues/${leagueId}`, parsedValues);

      dispatch(setMessage('success', 'LEAGUE_UPDATED_SUCCESS'));
    }

    dispatch(setIsLoading(false));
  }, []);

  return (
    <Paper>
      <Box p={3}>
        <Formik
          initialValues={fields}
          enableReinitialize
          onSubmit={handleSubmit}
          validatationSchema={leagueSchema}
          // eslint-disable-next-line react/jsx-props-no-spreading
          render={props => <LeagueForm {...props} editType={editType} leagueId={leagueId} />}
        />
      </Box>
    </Paper>
  );
}

export default League;
