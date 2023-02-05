/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import _uniq from 'lodash/uniq';
import { Formik } from 'formik';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { DEFAULT_COORDINATES } from 'config/config';
import { prepareClubFormData, formatDate, formatDateFromNow } from 'util/helpers';
import history from 'config/history';
import clubSchema from 'schemas/club';
import Api from 'services/api';
import { setMessage, setIsLoading } from 'components/app/app.actions';
import ClubForm from './clubForm.component';

const parseClubData = ({
  name,
  transliterationName = '',
  searchName = '',
  league,
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
  country,
}) => ({
  newLogo: null,
  transliterationName,
  searchName,
  name,
  league: league ? league.name : null,
  logo,
  tier,
  coordinates: location.coordinates,
  friendships,
  agreements,
  positives,
  enemies,
  derbyRivalries,
  satellites,
  satelliteOf,
  country,
});

function Club(props) {
  const {
    editType,
    match: {
      params: {
        id: clubId,
      },
    },
  } = props;

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [initiallyLoaded, setInitiallyLoaded] = useState(false);
  const [activities, setActivities] = useState([]);
  const [countries, setCountries] = useState([]);

  const [fields, setFields] = useState({
    newLogo: null,
    name: '',
    transliterationName: '',
    searchName: '',
    league: '',
    logo: '',
    tier: 1,
    coordinates: DEFAULT_COORDINATES,
    friendships: [],
    agreements: [],
    positives: [],
    enemies: [],
    derbyRivalries: [],
    satellites: [],
    satelliteOf: null,
    country: null,
  });

  const fetchData = async () => {
    dispatch(setIsLoading(true));
    const { data: clubData } = await Api.get(`/clubs/${clubId}`);
    setFields(parseClubData(clubData));
    setInitiallyLoaded(true);
    dispatch(setIsLoading(false));
  }

  const fetchActivities = async () => {
    const { data: activities } = await Api.get(`/clubs/${clubId}/activities`);
    setActivities(activities);
  }

  const fetchCountries = async () => {
    const {
      data: retrievePossibleCountries,
    } = await Api.get('/countries');

    setCountries(retrievePossibleCountries);
  }

  useEffect(() => {
    fetchCountries();

    if (editType === 'update') {
      fetchData();
      fetchActivities();
    }
  }, []);

  const handleSubmit = useCallback(async (values) => {
    const {
      newLogo, // file
      name,
      transliterationName,
      searchName,
      logo, // url
      tier,
      coordinates,
      friendships,
      agreements,
      positives,
      enemies,
      derbyRivalries,
      satellites,
      satelliteOf,
      country,
    } = values;

    const formData = prepareClubFormData({
      name,
      transliterationName,
      searchName,
      logo,
      newLogo,
      tier,
      coordinates,
      friendships: friendships.map(club => club._id),
      agreements: agreements.map(club => club._id),
      positives: positives.map(club => club._id),
      enemies: enemies.map(club => club._id),
      derbyRivalries: derbyRivalries.map(club => club._id),
      satellites: satellites.map(club => club._id),
      satelliteOf: satelliteOf ? satelliteOf._id : null,
      country: country ? country._id : null,
    });

    dispatch(setIsLoading(true));

    if (editType === 'new') {
      const { data: clubId } = await Api.post(`/clubs`, formData);

      dispatch(setMessage('success', 'CLUB_ADDED_SUCCESS'));
      history.push(`/clubs/${clubId}`);
    } else {
      await Api.put(`/clubs/${clubId}`, formData);

      dispatch(setMessage('success', 'CLUB_UPDATED_SUCCESS'));
    }

    dispatch(setIsLoading(false));
  }, []);

  const handleValidate = useCallback(async (values) => {
    const errors = {};

    const {
      friendships,
      agreements,
      positives,
      enemies,
      satellites,
      satelliteOf,
    } = values;

    const allRelations = [...friendships, ...agreements, ...positives, ...enemies, ...satellites, satelliteOf];
    const uniqueAllRelations = _uniq(allRelations);

    if (allRelations.length > 0 && allRelations.length !== uniqueAllRelations.length) {
      Object.assign(errors, {
        relationsNotUnique: 'formErrors.relationsNotUnique',
      });
    }   

    try {
      await clubSchema.validate(values, {
        abortEarly: false,
      });
    } catch (error) {
      
      const { inner: schemaErrors } = error;

      const parsedErrors = schemaErrors.reduce((acc, { path, message }) => {
        Object.assign(acc, {
          [path]: message,
        });

        return acc;
      }, {});

      Object.assign(errors, parsedErrors);

      throw errors;
    }

    throw errors;
  }, []);

  return (
    <>
      <Box>
        <Paper>
          <Formik
            initialValues={fields}
            enableReinitialize
            onSubmit={handleSubmit}
            validate={handleValidate}
            render={(props) => (
              <ClubForm
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...props}
                clubId={clubId}
                editType={editType}
                initiallyLoaded={initiallyLoaded}
                possibleCountries={countries}
              />
            )}
          />
        </Paper>
      </Box>
      {activities.length > 0 && (
        <Box mt={3}>
          <Paper>
            <Box p={3}>
              <Typography gutterBottom variant="h5">Ostatnie aktywności</Typography>

              <List>
                {activities.map(activity => (
                  <ListItem
                    button
                    onClick={() => history.push(`/activities/${activity._id}`)}
                    key={activity._id}
                  >
                    <ListItemText primary={(<><strong>{formatDate(activity.createdAt)}</strong> ({formatDateFromNow(activity.createdAt)}) {t('global.by')} <strong>{activity.user.email}</strong></>)} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Paper>
        </Box>
      )}
    </>
  );
}

export default Club;
