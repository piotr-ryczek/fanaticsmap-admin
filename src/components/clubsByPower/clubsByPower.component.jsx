import React, { useEffect, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce';
import SelectAutocomplete from 'react-select';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import Api from 'services/api';
import { setIsLoading } from 'components/app/app.actions';
import ClubByPower from './clubByPower.component';

const getOptionValue = ({ _id }) => _id;
const getOptionLabel = ({ name }) => name;

function ClubsByPower() {
  const [clubs, setClubs] = useState([]);
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState([]);
  const [possibleCountries, setPossibleCountries] = useState([]);
  const [country, setCountry] = useState([]);

  const dispatch = useDispatch(); 
  const { t } = useTranslation();

  const fetchData = useCallback(async () => {
    dispatch(setIsLoading(true));

    const queryData = country ? { countries: [country._id] } : {};

    const {
      data: clubs,
    } = await Api.get('/clubs/byTier', queryData);

    setClubs(clubs);
    dispatch(setIsLoading(false));
  }, [country]);

  const fetchCountries = useCallback(async () => {
    const {
      data: retrievePossibleCountries,
    } = await Api.get('/countries');

    setPossibleCountries(retrievePossibleCountries);
  }, []);

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    fetchData();
  }, [country]);

  const getValues = (clubId, value) => (prevValues) => {
    const originalValue = clubs.find(({ _id: originalClubId }) => clubId === originalClubId).tier;

    if (originalValue.toString() === value.toString()) {
      const {
        [clubId]: clubIdToRemove,
        ...rest
      } = prevValues;

      return rest;
    } else {
      return {
        ...prevValues,
        [clubId]: value,
      }
    }
  }

  const [handleChangeWithFix] = useDebouncedCallback(
    (clubId, newValue) => {
      setValues(getValues(clubId, newValue));
    },
    500
  );

  const handleChange = useCallback((clubId, value) => {
    const floatValue = parseFloat(value);

    if (isNaN(floatValue) || floatValue < 0 || floatValue > 5.49999) {
      setErrors(prevErrors => ([
        ...prevErrors,
        clubId,
      ]));
    } else {
      setErrors(prevErrors => ([
        ...prevErrors.filter(errorClubId => errorClubId !== clubId)
      ]));
    }

    setValues(getValues(clubId, value));

    if (value != floatValue && !isNaN(floatValue)) handleChangeWithFix(clubId, floatValue);
  }, [clubs]);

  const handleSubmit = useCallback(async () => {
    dispatch(setIsLoading(true));

    await Api.patch('/clubs/updateTiers', values);

    setValues({});

    fetchData();
  }, [values]);

  const handleCountryChange = useCallback((value) => {
    setCountry(value);
  }, []);

  const valuesArr = Object.values(values);

  return (
    <Paper>
      <Box p={3}>
        {clubs.length > 0 && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {errors.length > 0 && (
                <Typography>{t('clubsByPower.cannotSave')}</Typography>
              )}

              <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                type="submit"
                size="large"
                disabled={(valuesArr.length === 0 || errors.length > 0)}
              >
                {t('clubsByPower.saveFor', { nrItems: valuesArr.length })}
              </Button>
            </Grid>
            <Grid item xs={12}>
              <SelectAutocomplete
                isClearable
                value={country}
                onChange={handleCountryChange}
                getOptionValue={getOptionValue}
                getOptionLabel={getOptionLabel}
                options={possibleCountries}
                placeholder={t('clubsByPower.country')}
                name="country"
                inputProps={{
                  id: 'country',
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <table className="clubs-by-power">
                <tbody>
                  {clubs.map(({ _id: clubId, tier, name, transliterationName }, index) => {
                    return (
                      <ClubByPower
                        key={clubId}
                        index={index}
                        clubId={clubId}
                        tier={tier}
                        name={name}
                        transliterationName={transliterationName}
                        tierValue={values[clubId]}
                        isError={errors.includes(clubId)}
                        handleChange={handleChange}
                      />
                    );
                  })}
                </tbody>
              </table>
            </Grid>
          </Grid>
        )}
      </Box>
    </Paper>
  );
}

export default ClubsByPower;
