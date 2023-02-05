import React, { useCallback, useState, useEffect } from 'react';
import AsyncSelectAutocomplete from 'react-select/async-creatable';
import SelectAutocomplete from 'react-select';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import isEmpty from 'lodash/isEmpty';

import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';

import DateTimePickerWrapper from 'common/dateTimePickerWrapper/dateTimePickerWrapper.component';

import Api from 'services/api';
import { setIsLoading } from 'components/app/app.actions';

const handleFormatCreateLabel = label => value => `${label} ${value}`;
export const getOptionValue = (option) => {
  if (option.__isNew__) {
    const { label } = option;
    return label;
  }

  const {_id: clubId } = option;
  return clubId;
};

const getOptionLabel = (option) => {
  const {
    label,
    name,
    __isNew__: isNew,
  } = option;

  if (isNew) return label;

  return name;
}
const getOptionValueForLeague = ({ _id: leagueId }) => leagueId;
const getOptionLabelForLeague = ({ name }) => name;

function AddMatchForm({
  values: {
    homeClub,
    awayClub,
    isHomeClubReserve,
    isAwayClubReserve,
    attitude,
    importance,
    date,
    league,
  },
  errors,
  touched,
  handleSubmit,
  handleBlur,
  handleChange,
  setFieldValue,
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [leagues, setLeagues] = useState([]);
  const isError = (field) => errors[field] && touched[field];

  const fetchLeagues = useCallback(async () => {
    const { data: leagues } = await Api.get('/leagues/all');

    setLeagues(leagues);
  }, []);

  useEffect(() => {
    fetchLeagues();
  }, []);

  const handleSelectChange = (type) => (value) => {
    const newValue = value || [];

    setFieldValue(type, newValue);

    return newValue;
  }

  const handleGetOptions = value => new Promise(async (resolve) => {
    const excluded = [];
    if (homeClub && typeof homeClub === 'object') excluded.push(homeClub._id);
    if (awayClub && typeof awayClub === 'object') excluded.push(awayClub._id);

    const { data: clubs } = await Api.post('/clubs/possibleRelations', {
      searchName: value,
      excluded: excluded,
    });

    resolve(clubs);
  });

  const handleChangeDate = useCallback((value) => {
    setFieldValue('date', value);
  }, []);

  const handleCalculate = useCallback(async () => {
    dispatch(setIsLoading(true));

    const homeClubValue = homeClub.__isNew__ ? 'unimportant' : homeClub._id;
    const awayClubValue = awayClub.__isNew__ ? 'unimportant' : awayClub._id;

    const query = {
      isFirstClubReserve: isHomeClubReserve ? 1 : 0,
      isSecondClubReserve: isAwayClubReserve ? 1 : 0,
    };

    if (league) {
      Object.assign(query, {
        league: league._id,
      });
    }
    
    const { data } = await Api.get(`/clubs/estimateAttitude/${homeClubValue}/${awayClubValue}`, query);

    const { attitude, importance } = data;

    setFieldValue('attitude', attitude);
    setFieldValue('importance', importance);
    
    dispatch(setIsLoading(false));
  }, [homeClub, awayClub, isHomeClubReserve, isAwayClubReserve, league]);

  return (
    <div className="add-match-container">
      <div className="add-match-field-wrapper home-club">
        <AsyncSelectAutocomplete
          isClearable
          name="homeClub"
          closeMenuOnSelect
          loadOptions={handleGetOptions}
          getOptionValue={getOptionValue}
          getOptionLabel={getOptionLabel}
          formatCreateLabel={handleFormatCreateLabel(t('addMatch.clubNotInDatabase'))}
          value={homeClub}
          onChange={handleSelectChange('homeClub')}
          placeholder={t('addMatch.homeClub')}
        />
        <FormControlLabel
          control={(
            <Checkbox
              checked={isHomeClubReserve}
              onChange={handleChange}
              onBlur={handleBlur}
              name="isHomeClubReserve"
            />
          )}
          label={`${t('addMatch.reserves')}?`}
        />
      </div>
      <div className="add-match-field-wrapper away-club">
        <AsyncSelectAutocomplete
          isClearable
          name="awayClub"
          closeMenuOnSelect
          loadOptions={handleGetOptions}
          getOptionValue={getOptionValue}
          getOptionLabel={getOptionLabel}
          formatCreateLabel={handleFormatCreateLabel(t('addMatch.clubNotInDatabase'))}
          value={awayClub}
          onChange={handleSelectChange('awayClub')}
          placeholder={t('addMatch.awayClub')}
        />
        <FormControlLabel
          control={(
            <Checkbox
              checked={isAwayClubReserve}
              onChange={handleChange}
              onBlur={handleBlur}
              name="isAwayClubReserve"
            />
          )}
          label={`${t('addMatch.reserves')}?`}
        />
      </div>
      <div className="add-match-field-wrapper league">
        <SelectAutocomplete
          isClearable
          closeMenuOnSelect
          name="league"
          value={league}
          onChange={handleSelectChange('league')}
          getOptionValue={getOptionValueForLeague}
          getOptionLabel={getOptionLabelForLeague}
          options={leagues}
          placeholder={t('addMatch.league')}
        />
      </div>
      <div className="add-match-field-wrapper attitude">
        <TextField
          error={isError('attitude')}
          helperText={isError('attitude') ? t(errors.attitude) : ''}
          label={t('addMatch.attitude')}
          value={attitude}
          onChange={handleChange}
          onBlur={handleBlur}
          name="attitude"
          type="number"
          fullWidth
        />
      </div>
      <div className="add-match-field-wrapper importance">
        <TextField
          error={isError('importance')}
          helperText={isError('importance') ? t(errors.importance) : ''}
          label={t('addMatch.importance')}
          value={importance}
          onChange={handleChange}
          onBlur={handleBlur}
          name="importance"
          type="number"
          fullWidth
        />
      </div>
      <div className="add-match-field-wrapper date">
        <DateTimePickerWrapper
          onChange={handleChangeDate}
          value={date}
        />
      </div>
      <div className="add-match-field-wrapper calculate">
        <Button
          variant="contained"
          color="secondary"
          type="submit"
          size="large"
          onClick={handleCalculate}
          disabled={isEmpty(homeClub) || isEmpty(awayClub)}
        >
          {t('global.calculate')}
        </Button>
        
      </div>
      <div className="add-match-field-wrapper add">
        <Button
          variant="contained"
          color="primary"
          type="submit"
          size="large"
          onClick={handleSubmit}
        >
          {t('global.add')}
        </Button>
      </div>
    </div>
  );
}

export default AddMatchForm;
