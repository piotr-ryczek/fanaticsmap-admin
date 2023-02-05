import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import AsyncSelectAutocomplete from 'react-select/async';
import SelectAutocomplete from 'react-select';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Textfield from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import DateTimePickerWrapper from 'common/dateTimePickerWrapper/dateTimePickerWrapper.component';
import { MATCH_DURATION_MINUTES } from 'config/config';
import Api from 'services/api';

const IS_VISIBLE_CHOICES = [{
  value: 'all',
  label: 'Wszystkie'
}, {
  value: 'visible',
  label: 'Widoczne'
}, {
  value: 'invisible',
  label: 'Niewidoczne'
}];

const LACK_OF_CHOICES = [{
  value: 'none',
  label: 'Pomiń'
}, {
  value: 'location',
  label: 'Lokalizacja'
}, {
  value: 'attitude',
  label: 'Nastawienie'
}];

const LEAGUES_TIERS = [{
  value: 1,
  label: 'Ekstraklasa (1)'
}, {
  value: 2,
  label: 'I Liga (2)'
}, {
  value: 3,
  label: 'II Liga (3)'
}, {
  value: 4,
  label: 'III Ligi (4)'
}, {
  value: 5,
  label: 'IV Ligi (5)'
}, {
  value: 6,
  label: 'Okręgówki / V Ligi (6)'
}];

const getOptionValue = ({ _id }) => _id;
const getOptionLabel = ({ name }) => name;

const useStyles = makeStyles(theme => ({
  buttonMargin: {
    marginRight: theme.spacing(1),
  },
}));

function MatchesFilters(props) {
  const { onFilter } = props;

  const { t } = useTranslation();
  const classes = useStyles({});
  const [state, setState] = useState({
    dateFrom: moment(new Date()).subtract(MATCH_DURATION_MINUTES, 'minutes').toDate(),
    dateTo: moment(new Date()).add(7, 'days').toDate(),
    isVisible: 'visible',
    lackOf: 'none',
    leagueTiers: [],
    clubs: [],
    ignoreAttitude: true,
    attitudeFrom: 0,
    attitudeTo: 100,
    foundClubName: '',
  });

  const {
    dateFrom,
    dateTo,
    isVisible,
    lackOf,
    leagueTiers,
    clubs,
    ignoreAttitude,
    attitudeFrom,
    attitudeTo,
    foundClubName,
  } = state;

  const handleSelectChange = useCallback((event) => {
    const { target: { name, value } } = event;

    setState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleFilter = useCallback(() => {
    const filters = {};

    Object.assign(filters, {
      dateFrom: dateFrom.getTime(),
      dateTo: dateTo.getTime(),
    });

    if (!ignoreAttitude) {
      Object.assign(filters, {
        attitudeFrom,
        attitudeTo,
      });
    }

    if (isVisible && isVisible !== 'all') {
      Object.assign(filters, {
        isVisible: isVisible === 'visible',
      });
    }

    if (lackOf && lackOf !== 'none') {
      Object.assign(filters, {
        lackOf,
      });
    }

    if (leagueTiers && leagueTiers.length) {
      Object.assign(filters, {
        leagueTiers: leagueTiers.map(({ value }) => value),
      });
    }

    if (clubs.length) {
      Object.assign(filters, {
        clubs: clubs.map(({ _id: clubId}) => clubId),
      });
    }

    if (foundClubName) {
      Object.assign(filters, {
        foundClubName,
      });
    }

    onFilter(filters);
  }, [
    onFilter,
    dateFrom,
    dateTo,
    ignoreAttitude,
    attitudeFrom,
    attitudeTo,
    isVisible,
    lackOf,
    leagueTiers,
    clubs,
    foundClubName,
  ]);

  const handleGetPossibleRelations = value => new Promise(async (resolve, reject) => {
    const excluded = clubs.map(({ _id: clubId }) => clubId);

    const { data: possibleClubs } = await Api.post('/clubs/possibleRelations', {
      searchName: value,
      excluded: excluded,
    });

    resolve(possibleClubs);
  });

  const handleClubsChange = (value) => {
    const newValue = value || [];

    setState(prevState => ({
      ...prevState,
      clubs: newValue,
    }));
  }

  const handleLeagueTiersChange = useCallback((values) => {
    setState(prevState => ({
      ...prevState,
      leagueTiers: values,
    }));
  }, []);

  const handleChangeDate = (name) => (value) => {
    setState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleTextfieldChange = useCallback((event) => {
    const {
      target,
      target: {
        value
      },
    } = event;
    
    const name = target.getAttribute('name');

    setState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleCheckboxChange = useCallback((event, isChecked) => {
    const { target } = event;
    const fieldName = target.getAttribute('name');

    setState(prevState => ({
      ...prevState,
      [fieldName]: isChecked,
    }));
  }, []);

  const handleChangeDateToAll = () => {
    handleChangeDate('dateFrom')(new Date(2000, 0));
    handleChangeDate('dateTo')(new Date(2100, 0));
  }

  return (
    <Grid item xs={12}>
      <Paper>
        <Box p={3}>
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <Typography gutterBottom>{t('matchFilters.dateFrom')}</Typography>
              <DateTimePickerWrapper 
                onChange={handleChangeDate('dateFrom')}
                value={dateFrom}
              />
              <Box pt={1}>
                <Button
                  variant="contained"
                  color="secondary"
                  type="button"
                  size="small"
                  onClick={handleChangeDateToAll}
                  className={classes.buttonMargin}
                >
                  Wszystkie
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  type="button"
                  size="small"
                  onClick={() => handleChangeDate('dateFrom')(new Date())}
                  className={classes.buttonMargin}
                >
                  Jeszcze nie rozpoczęte
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  type="button"
                  size="small"
                  onClick={() => handleChangeDate('dateFrom')(moment(new Date()).subtract(MATCH_DURATION_MINUTES, 'minutes').toDate())}
                >
                  Jeszcze nie zakończone
                </Button>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Typography gutterBottom>{t('matchFilters.dateTo')}</Typography>
              <DateTimePickerWrapper 
                onChange={handleChangeDate('dateTo')}
                value={dateTo}
              />
              <Box pt={1}>
                <Button
                  variant="contained"
                  color="secondary"
                  type="button"
                  size="small"
                  onClick={() => handleChangeDate('dateTo')(new Date())}
                  className={classes.buttonMargin}
                >
                  Teraz
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  type="button"
                  size="small"
                  className={classes.buttonMargin}
                  onClick={() => handleChangeDate('dateTo')(moment(new Date()).add(7, 'days').toDate())}
                >
                  +7 dni
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  type="button"
                  size="small"
                  className={classes.buttonMargin}
                  onClick={() => handleChangeDate('dateTo')(moment(new Date()).add(14, 'days').toDate())}
                >
                  +14 dni
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  type="button"
                  size="small"
                  onClick={handleChangeDateToAll}
                >
                  Wszystkie
                </Button>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Typography gutterBottom>{t('matchFilters.isVisible')}</Typography>
              <Select
                value={isVisible}
                onChange={handleSelectChange}
                placeholder={t('matchFilters.isVisible')}
                name="isVisible"
                inputProps={{
                  id: 'isVisible',
                }}
                fullWidth
              >
                {IS_VISIBLE_CHOICES.map(choice => (
                  <MenuItem
                    key={choice.value}
                    value={choice.value}
                    selected={choice.value === isVisible}
                  >
                    {choice.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={6}>
              <Typography gutterBottom>{t('matchFilters.lackOf')}</Typography>
              <Select
                value={lackOf}
                onChange={handleSelectChange}
                placeholder={t('matchFilters.lackOf')}
                name="lackOf"
                inputProps={{
                  id: 'lackOf',
                }}
                fullWidth
              >
                {LACK_OF_CHOICES.map(choice => (
                  <MenuItem
                    key={choice.value}
                    value={choice.value}
                    selected={choice.value === lackOf}
                  >
                    {choice.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={6}>
              <Typography gutterBottom>{t('matchFilters.leagueTiers')}</Typography>
              <SelectAutocomplete
                value={leagueTiers}
                onChange={handleLeagueTiersChange}
                options={LEAGUES_TIERS}
                placeholder={t('matchFilters.leagueTiers')}
                name="leagueTiers"
                inputProps={{
                  id: 'leagueTiers',
                }}
                fullWidth
                isMulti
              />
            </Grid>
            <Grid item xs={6}>
              <Typography gutterBottom>{t('matchFilters.clubs')}</Typography>
              <AsyncSelectAutocomplete
                isMulti
                name="clubs"
                closeMenuOnSelect={false}
                loadOptions={handleGetPossibleRelations}
                getOptionValue={getOptionValue}
                getOptionLabel={getOptionLabel}
                value={clubs}
                onChange={handleClubsChange}
                placeholder={t('league.clubsPlaceholder')}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={(
                  <Checkbox
                    checked={ignoreAttitude}
                    onChange={handleCheckboxChange}
                    name="ignoreAttitude"
                  />
                )}
                label={t('matchFilters.ignoreAttitude')}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom>{t('matchFilters.foundClubName')}</Typography>
              <Textfield
                value={foundClubName}
                onChange={handleTextfieldChange}
                name="foundClubName"
                fullWidth
              />
            </Grid>
            {!ignoreAttitude && (
              <>
                <Grid item xs={6}>
                  <Typography gutterBottom>{t('matchFilters.attitudeFrom')}</Typography>
                  <Textfield
                    value={attitudeFrom}
                    onChange={handleTextfieldChange}
                    name="attitudeFrom"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography gutterBottom>{t('matchFilters.attitudeTo')}</Typography>
                  <Textfield
                    value={attitudeTo}
                    onChange={handleTextfieldChange}
                    name="attitudeTo"
                    fullWidth
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                type="button"
                onClick={handleFilter}
              >
                {t('global.filter')}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Grid>
  );
}

export default MatchesFilters;
