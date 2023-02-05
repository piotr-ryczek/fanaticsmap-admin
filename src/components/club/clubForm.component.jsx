import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import AsyncSelectAutocomplete from 'react-select/async';
import SelectAutocomplete from 'react-select';
import _isEmpty from 'lodash/isEmpty';
import _uniq from 'lodash/uniq';

import { GoogleMap, Marker, withGoogleMap } from 'react-google-maps';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { setMessage } from 'components/app/app.actions';
import { DEFAULT_COORDINATES, IMAGES_URL } from 'config/config';
import { parseCoordinates } from 'util/helpers';
import Api from 'services/api';

import AddressSearch from 'common/addressSearch/addressSearch.component';
import ImageUploader from 'common/imageUploader/ImageUploader.component';

const GoogleMapLocation = withGoogleMap((props) => {
  const {
    markerCoordination,
    setFieldValue,
  } = props;

  const handleDragEnd = useCallback((event) => {
    const { latLng: { lat, lng } } = event;

    setFieldValue('coordinates', [lng(), lat()]);
  }, []);

  return (
    <GoogleMap
      defaultZoom={8}
      defaultCenter={markerCoordination}
      center={markerCoordination}
    >
      <Marker
        position={markerCoordination}
        draggable
        onDragEnd={handleDragEnd}
      />
    </GoogleMap>
  );
});

const getOptionValue = ({ _id }) => _id;
const getOptionLabel = ({ name }) => name;

function ClubForm({
  clubId,
  editType,
  initiallyLoaded,
  possibleCountries,
  values: {
    name,
    transliterationName,
    searchName,
    league,
    logo,
    tier,
    coordinates,
    friendships,
    agreements,
    positives,
    satellites,
    enemies,
    derbyRivalries,
    satelliteOf,
    country,
  },
  errors,
  touched,
  handleSubmit,
  handleChange,
  handleBlur,
  setFieldValue,
  isSubmitting,
  isValid,
  setFieldTouched,
}) {
  const isError = (field) => errors[field] && touched[field];

  const dispatch = useDispatch(); 
  const { t } = useTranslation();
  const [otherFoundClubs, setOtherFoundClubs] = useState([]);

  useEffect(() => {
    if (isSubmitting && !_isEmpty(errors)) { // isValid is false when form is same as before
      dispatch(setMessage('error', 'FORM_INCORRECT'))
    }
  }, [isSubmitting, isValid]);

  const getCurrentRelations = () => {
    const allRelations = [
      ...friendships,
      ...agreements,
      ...positives,
      ...enemies,
      // ...derbyRivalries,
      ...satellites,
    ];

    if (satelliteOf && !Array.isArray(satelliteOf)) allRelations.push(satelliteOf);

    return _uniq(allRelations.reduce((acc, { __isNew__: isNew, _id: clubId }) => {
      if (!isNew) {
        acc.push(clubId);
      }

      return acc;
    }, []));
  }

  const handleSelectChange = (type) => (value) => {
    const newValue = value || [];

    setFieldValue(type, newValue);

    return newValue;
  }

  const handleLogoChange = useCallback((file) => {
    setFieldValue('newLogo', file);
  }, []);

  const handleCoordinatesChange = useCallback((coordinates) => {
    setFieldValue('coordinates', coordinates);
  }, []);

  const handleGetPossibleRelations = (shouldExclude = true) => value => new Promise(async (resolve, reject) => {
    const excluded = shouldExclude ? getCurrentRelations() : [];

    if (editType === 'update') excluded.push(clubId);

    const { data: clubs } = await Api.post('/clubs/possibleRelations', {
      searchName: value,
      excluded: excluded,
    });

    resolve(clubs);
  });

  const handleFieldNameBlur = useCallback(async (event) => {
    setFieldTouched('name', true);

    const { value: name } = event.target;

    const body = { search: { name: { value: name, type: 'text' } } };

    if (clubId) Object.assign(body, { excluded: [clubId] });

    const { data: clubs } = await Api.get('/clubs', body);

    setOtherFoundClubs(clubs);
  }, []);

  const handleCountryChange = useCallback((value) => {
    setFieldValue('country', value);
  }, []);

  const finalCoordination= parseCoordinates(coordinates || DEFAULT_COORDINATES);

  return (
    <form onSubmit={handleSubmit}>

      {(editType === 'new' || initiallyLoaded) && (
        <div className="location-wrapper">
          <GoogleMapLocation
            markerCoordination={finalCoordination}
            setFieldValue={setFieldValue}
            googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}&v=3.exp&libraries=geometry,drawing,places`}
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `400px` }} />}
            mapElement={<div style={{ height: `100%` }} />}
          />

          <AddressSearch onChange={handleCoordinatesChange} />
        </div>
      )}

      <Box p={3}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              error={isError('name')}
              helperText={isError('name') ? t(errors.name) : ''}
              label={t('club.name')}
              value={name}
              onChange={handleChange}
              onBlur={handleFieldNameBlur}
              name="name"
              fullWidth
            />
            {otherFoundClubs.length > 0 && (
              <Typography>
                {t('club.otherFoundByName')}
                <strong>{otherFoundClubs.map(club => club.name).join(', ')}</strong>
              </Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={isError('transliterationName')}
              helperText={isError('transliterationName') ? t(errors.transliterationName) : ''}
              label={t('club.transliterationName')}
              value={transliterationName}
              onChange={handleChange}
              onBlur={handleBlur}
              name="transliterationName"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={isError('searchName')}
              helperText={isError('searchName') ? t(errors.searchName) : ''}
              label={t('club.searchName')}
              value={searchName}
              onChange={handleChange}
              onBlur={handleBlur}
              name="searchName"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={isError('tier')}
              helperText={isError('tier') ? t(errors.tier) : ''}
              label={t('club.tier')}
              value={tier}
              onChange={handleChange}
              onBlur={handleBlur}
              name="tier"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={isError('league')}
              helperText={isError('league') ? t(errors.league) : ''}
              label={t('club.league')}
              value={league}
              onChange={handleChange}
              onBlur={handleBlur}
              name="league"
              disabled
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Box pb={1}>
              <Typography variant="subtitle1">
                {t('club.logo')}
                :
              </Typography>
            </Box>

            {logo && (
              <img src={`${IMAGES_URL}/h180/${logo}`} alt="" />
            )}

            <ImageUploader
              fieldId="logo"
              onChange={handleLogoChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Box pb={1}>
              <Typography variant="subtitle1">
                {t('club.country')}
                :
              </Typography>
            </Box>
            <SelectAutocomplete
              isClearable
              value={country}
              onChange={handleCountryChange}
              getOptionValue={getOptionValue}
              getOptionLabel={getOptionLabel}
              options={possibleCountries}
              onBlur={handleBlur}
              placeholder={t('club.country')}
              name="country"
              inputProps={{
                id: 'country',
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Box pb={1}>
              <Typography variant="subtitle1">
                {t('club.friendships')}
                :
              </Typography>
            </Box>

            <AsyncSelectAutocomplete
              isMulti
              name="friendships"
              closeMenuOnSelect={false}
              loadOptions={handleGetPossibleRelations()}
              getOptionValue={getOptionValue}
              getOptionLabel={getOptionLabel}
              value={friendships}
              onChange={handleSelectChange('friendships')}
              onBlur={handleBlur}
              placeholder={t('club.friendshipsPlaceholder')}
            />
            {errors.relationsNotUnique && (
              <p>{t(errors.relationsNotUnique)}</p>
            )}
          </Grid>
          <Grid item xs={12}>
            <Box pb={1}>
              <Typography variant="subtitle1">
                {t('club.agreements')}
                :
              </Typography>
            </Box>

            <AsyncSelectAutocomplete
              isMulti
              name="agreements"
              closeMenuOnSelect={false}
              loadOptions={handleGetPossibleRelations()}
              getOptionValue={getOptionValue}
              getOptionLabel={getOptionLabel}
              value={agreements}
              onChange={handleSelectChange('agreements')}
              onBlur={handleBlur}
              placeholder={t('club.agreementsPlaceholder')}
            />
            {errors.relationsNotUnique && (
              <p>{t(errors.relationsNotUnique)}</p>
            )}
          </Grid>
          <Grid item xs={12}>
            <Box pb={1}>
              <Typography variant="subtitle1">
                {t('club.positives')}
                :
              </Typography>
            </Box>

            <AsyncSelectAutocomplete
              isMulti
              name="positives"
              closeMenuOnSelect={false}
              loadOptions={handleGetPossibleRelations()}
              getOptionValue={getOptionValue}
              getOptionLabel={getOptionLabel}
              value={positives}
              onChange={handleSelectChange('positives')}
              onBlur={handleBlur}
              placeholder={t('club.positivesPlaceholder')}
            />
            {errors.relationsNotUnique && (
              <p>{t(errors.relationsNotUnique)}</p>
            )}
          </Grid>
          <Grid item xs={12}>
            <Box pb={1}>
              <Typography variant="subtitle1">
                {t('club.enemies')}
                :
              </Typography>
            </Box>

            <AsyncSelectAutocomplete
              isMulti
              name="enemies"
              closeMenuOnSelect={false}
              loadOptions={handleGetPossibleRelations()}
              getOptionValue={getOptionValue}
              getOptionLabel={getOptionLabel}
              value={enemies}
              onChange={handleSelectChange('enemies')}
              onBlur={handleBlur}
              placeholder={t('club.enemiesPlaceholder')}
            />
            {errors.relationsNotUnique && (
              <p>{t(errors.relationsNotUnique)}</p>
            )}
          </Grid>
          <Grid item xs={12}>
            <Box pb={1}>
              <Typography variant="subtitle1">
                {t('club.derbyRivalries')}
                :
              </Typography>
            </Box>

            <AsyncSelectAutocomplete
              isMulti
              name="derbyRivalries"
              closeMenuOnSelect={false}
              loadOptions={handleGetPossibleRelations(false)}
              getOptionValue={getOptionValue}
              getOptionLabel={getOptionLabel}
              value={derbyRivalries}
              onChange={handleSelectChange('derbyRivalries')}
              onBlur={handleBlur}
              placeholder={t('club.derbyRivalriesPlaceholder')}
            />
          </Grid>
          <Grid item xs={12}>
            <Box pb={1}>
              <Typography variant="subtitle1">
                {t('club.satellites')}
                :
              </Typography>
            </Box>

            <AsyncSelectAutocomplete
              isMulti
              name="satellites"
              closeMenuOnSelect={false}
              loadOptions={handleGetPossibleRelations()}
              getOptionValue={getOptionValue}
              getOptionLabel={getOptionLabel}
              value={satellites}
              onChange={handleSelectChange('satellites')}
              onBlur={handleBlur}
              placeholder={t('club.satellitesPlaceholder')}
            />
            {errors.relationsNotUnique && (
              <p>{t(errors.relationsNotUnique)}</p>
            )}
          </Grid>
          <Grid item xs={12}>
            <Box pb={1}>
              <Typography variant="subtitle1">
                {t('club.satelliteOf')}
                :
              </Typography>
            </Box>

            <AsyncSelectAutocomplete
              isClearable
              name="satelliteOf"
              loadOptions={handleGetPossibleRelations()}
              getOptionValue={getOptionValue}
              getOptionLabel={getOptionLabel}
              value={satelliteOf}
              onChange={handleSelectChange('satelliteOf')}
              onBlur={handleBlur}
              placeholder={t('club.satelliteOfPlaceholder')}
            />
            {errors.relationsNotUnique && (
              <p>{t(errors.relationsNotUnique)}</p>
            )}
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              size="large"
            >
              {t('global.save')}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </form>
  );
}

export default ClubForm;