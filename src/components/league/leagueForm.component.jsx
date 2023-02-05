import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import SelectAutocomplete from 'react-select/async';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';

import { DOWNLOAD_METHODS, SPORTS } from 'config/config';
import Api from 'services/api';

import { setIsLoading } from 'components/app/app.actions';

const getOptionValue = ({ _id }) => _id;
const getOptionLabel = ({ name }) => name;

const useStyles = makeStyles(theme => ({
  button: {
    marginRight: theme.spacing(1),
  },
}));

function LeagueForm({
  leagueId,
  values: {
    name,
    downloadUrl,
    downloadMethod,
    clubs = [],
    importanceModifier,
    sport,
    tier,
    isAutomaticDownload,
    seasonStartYear,
    seasonEndYear,
    seasonMonthUntil,
  },
  errors,
  touched,
  handleSubmit,
  handleChange,
  handleBlur,
  setFieldValue,
}) {
  const { t } = useTranslation();
  const classes = useStyles({});
  const dispatch = useDispatch();

  const isError = (field) => errors[field] && touched[field];

  const handleClubsChange = (value) => {
    const newValue = value || [];

    setFieldValue('clubs', newValue);

    return newValue;
  }

  const handleGetPossibleRelations = value => new Promise(async (resolve, reject) => {
    const excluded = clubs.map(({ _id: clubId }) => clubId);

    const { data: possibleClubs } = await Api.post('/clubs/possibleRelations', {
      searchName: value,
      excluded: excluded,
    });

    resolve(possibleClubs);
  });

  const handleDownloadClubs = useCallback(async () => {
    dispatch(setIsLoading(true));

    const { data: clubs } = await Api.get(`/leagues/${leagueId}/downloadClubs`);

    const clubsToPut = clubs.reduce((acc, { isReserve, club }) => {
      if (!isReserve) acc.push(club);

      return acc;
    }, []);

    setFieldValue('clubs', clubsToPut);
    dispatch(setIsLoading(false));
  }, [leagueId]);


  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            error={isError('name')}
            helperText={isError('name') ? t(errors.name) : ''}
            label={t('league.name')}
            value={name}
            onChange={handleChange}
            onBlur={handleBlur}
            name="name"
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            error={isError('seasonStartYear')}
            helperText={isError('seasonStartYear') ? t(errors.name) : ''}
            label={t('league.seasonStartYear')}
            value={seasonStartYear}
            onChange={handleChange}
            onBlur={handleBlur}
            name="seasonStartYear"
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            error={isError('seasonEndYear')}
            helperText={isError('seasonEndYear') ? t(errors.seasonEndYear) : ''}
            label={t('league.seasonEndYear')}
            value={seasonEndYear}
            onChange={handleChange}
            onBlur={handleBlur}
            name="seasonEndYear"
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            error={isError('seasonMonthUntil')}
            helperText={isError('seasonMonthUntil') ? t(errors.seasonMonthUntil) : ''}
            label={t('league.seasonMonthUntil')}
            value={seasonMonthUntil}
            onChange={handleChange}
            onBlur={handleBlur}
            name="seasonMonthUntil"
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={(
              <Checkbox
                checked={isAutomaticDownload}
                onChange={handleChange}
                name="isAutomaticDownload"
              />
            )}
            label={`${t('league.isAutomaticDownload')}?`}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl error={isError('downloadMethod')} fullWidth>
            <InputLabel htmlFor="downloadMethod">{t('league.downloadMethod')}</InputLabel>
            <Select
              error={isError('downloadMethod')}
              value={downloadMethod}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={t('league.downloadMethod')}
              name="downloadMethod"
              inputProps={{
                id: 'downloadMethod',
              }}
              fullWidth
            >
              {DOWNLOAD_METHODS.map(downloadMethodChoice => (
                <MenuItem
                  key={downloadMethodChoice}
                  value={downloadMethodChoice}
                  selected={downloadMethodChoice === downloadMethod}
                >
                  {downloadMethodChoice}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            error={isError('downloadUrl')}
            helperText={isError('downloadUrl') ? t(errors.downloadUrl) : ''}
            label={t('league.downloadUrl')}
            value={downloadUrl}
            onChange={handleChange}
            onBlur={handleBlur}
            name="downloadUrl"
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          {!leagueId && (<Typography gutterBottom>{t('league.clubsBeforeNotice')}</Typography>)}
          <SelectAutocomplete
            isMulti
            name="clubs"
            closeMenuOnSelect={false}
            loadOptions={handleGetPossibleRelations}
            getOptionValue={getOptionValue}
            getOptionLabel={getOptionLabel}
            value={clubs}
            onChange={handleClubsChange}
            onBlur={handleBlur}
            placeholder={t('league.clubsPlaceholder')}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            error={isError('importanceModifier')}
            helperText={isError('importanceModifier') ? t(errors.importanceModifier) : ''}
            label={t('league.importanceModifier')}
            value={importanceModifier}
            onChange={handleChange}
            onBlur={handleBlur}
            name="importanceModifier"
            type="number"
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl error={isError('sport')} fullWidth>
            <InputLabel htmlFor="sport">{t('league.sport')}</InputLabel>
            <Select
              error={isError('sport')}
              value={sport}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={t('league.sport')}
              name="sport"
              inputProps={{
                id: 'sport',
              }}
              fullWidth
            >
              {SPORTS.map(sportChoice => (
                <MenuItem
                  key={sportChoice}
                  value={sportChoice}
                  selected={sportChoice === sport}
                >
                  {sportChoice}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            error={isError('tier')}
            helperText={isError('tier') ? t(errors.tier) : ''}
            label={t('league.tier')}
            value={tier}
            onChange={handleChange}
            onBlur={handleBlur}
            name="tier"
            type="number"
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            size="large"
            className={classes.button}
          >
            {t('global.save')}
          </Button>
          {leagueId && (
            <Button
              variant="contained"
              color="secondary"
              type="button"
              size="large"
              className={classes.button}
              onClick={handleDownloadClubs}
            >
              {t('global.downloadClubs')}
            </Button>
          )}
        </Grid>
      </Grid>
    </form>
  );
}

export default LeagueForm;
