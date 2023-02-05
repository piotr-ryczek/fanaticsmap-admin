import React, { useCallback } from 'react';
import { Formik } from 'formik';
import { useDispatch } from 'react-redux';

import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';

import Api from 'services/api';
import matchSchema from 'schemas/match';
import { setIsLoading } from 'components/app/app.actions';

import AddMatchForm, { getOptionValue } from './addMatchForm.component';

function AddMatch() {
  const dispatch = useDispatch();

  const handleSubmit = useCallback(async (values, { resetForm }) => {
    dispatch(setIsLoading(true));

    const {
      homeClub,
      isHomeClubReserve,
      awayClub,
      isAwayClubReserve,
      importance,
      attitude,
      date,
      league,
    } = values;

    await Api.post('/matches', {
      homeClub: getOptionValue(homeClub),
      isHomeClubReserve,
      awayClub: getOptionValue(awayClub),
      isAwayClubReserve,
      importance,
      attitude,
      date,
      league,
    });

    resetForm();
    dispatch(setIsLoading(false));
  }, []);

  return (
    <Paper>
      <Box p={3}>
        <Formik
          initialValues={{
            homeClub: null,
            awayClub: null,
            isHomeClubReserve: false,
            isAwayClubReserve: false,
            attitude: 50,
            importance: 0,
            date: new Date(),
            league: null,
          }}
          onSubmit={handleSubmit}
          validationSchema={matchSchema}
          render={(props) => (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <AddMatchForm {...props} />
          )}
        />
      </Box>
    </Paper>
  );
}

export default AddMatch;
