import React, { useState, useCallback } from 'react';
import SelectAutocomplete from 'react-select/async';
import { useTranslation } from 'react-i18next';
import _isEmpty from 'lodash/isEmpty';
import { useDispatch } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import Api from 'services/api';
import { setIsLoading } from 'components/app/app.actions';

const getOptionValue = ({ _id }) => _id;
const getOptionLabel = ({ name }) => name;

function CompareClubs() {
  const [state, setState] = useState({
    firstClub: null,
    secondClub: null,
    isFirstClubReserve: false,
    isSecondClubReserve: false,
    comparisionResult: {},
  });

  const dispatch = useDispatch(); 
  const { t } = useTranslation();

  const {
    firstClub,
    secondClub,
    isFirstClubReserve,
    isSecondClubReserve,
    comparisionResult,
  } = state;

  const handleSelectChange = (type) => (value) => {
    setState(prevState => ({
      ...prevState,
      [type]: value,
    }));
  }

  const handleGetOptions = value => new Promise(async (resolve, reject) => {
    const excluded = [];
    if (firstClub) excluded.push(firstClub._id);
    if (secondClub) excluded.push(secondClub._id);

    const { data: clubs } = await Api.post('/clubs/possibleRelations', {
      searchName: value,
      excluded: excluded,
    });

    resolve(clubs);
  });

  const handleCompare = useCallback(async () => {
    dispatch(setIsLoading(true));

    const { data } = await Api.get(`/clubs/estimateAttitude/${firstClub._id}/${secondClub._id}`, {
      isFirstClubReserve: isFirstClubReserve ? 1 : 0,
      isSecondClubReserve: isSecondClubReserve ? 1 : 0,
    });

    setState(prevState => ({
      ...prevState,
      comparisionResult: data,
    }));

    dispatch(setIsLoading(false));
  }, [firstClub, secondClub, isFirstClubReserve, isSecondClubReserve]);

  const handleToggleCheckbox = useCallback((event, value) => {
    const fieldName = event.target.getAttribute('name');
    
    setState(prevState => ({
      ...prevState,
      [fieldName]: value,
    }))
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper>
          <Box p={3}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography gutterBottom>Panel poglądowy przeznaczony do testowania.</Typography>
                <SelectAutocomplete
                  isClearable
                  name="firstClub"
                  closeMenuOnSelect
                  loadOptions={handleGetOptions}
                  getOptionValue={getOptionValue}
                  getOptionLabel={getOptionLabel}
                  value={firstClub}
                  onChange={handleSelectChange('firstClub')}
                  placeholder={t('clubCompare.firstClub')}
                />
                <FormControlLabel
                  control={(
                    <Checkbox
                      checked={isFirstClubReserve}
                      onChange={handleToggleCheckbox}
                      name="isFirstClubReserve"
                    />
                  )}
                  label="Czy pierwszy klub jest rezerwą?"
                />
              </Grid>
              <Grid item xs={12}>
                <SelectAutocomplete
                  isClearable
                  name="secondCLub"
                  closeMenuOnSelect
                  loadOptions={handleGetOptions}
                  getOptionValue={getOptionValue}
                  getOptionLabel={getOptionLabel}
                  value={secondClub}
                  onChange={handleSelectChange('secondClub')}
                  placeholder={t('clubCompare.secondClub')}
                />
                <FormControlLabel
                  control={(
                    <Checkbox
                      checked={isSecondClubReserve}
                      onChange={handleToggleCheckbox}
                      name="isSecondClubReserve"
                    />
                  )}
                  label="Czy drugi klub jest rezerwą?"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  onClick={handleCompare}
                  variant="contained"
                  color="primary"
                  type="submit"
                  size="large"
                  disabled={!firstClub || !secondClub}
                >
                  {t('clubCompare.compare')}
                </Button>
              </Grid>
              {!_isEmpty(comparisionResult) && (
                <Grid item xs={12}>
                  {comparisionResult !== 'unknown' ? (
                    <Typography>
                      Poziom zagłębienia (max 4, każdy kolejny ma mniejsze znaczenie): {comparisionResult.level}
                      <br />
                      Współczynnik relacji: {comparisionResult.attitude}
                      <br />
                      Potencjalne znaczenie kibicowskie: {comparisionResult.importance}
                      <br />
                      Odległość między klubami: {comparisionResult.distance}
                      <br />
                      Dodatkowe informacje: {comparisionResult.additional.toString()}
                    </Typography>
                  ) : (
                    <Typography>Nieudalo sie wyznaczyc relacji</Typography>
                  )}
                </Grid>
              )}
            </Grid>
          </Box>
        </Paper>
      </Grid>
      {/* <Grid item xs={12}>
        <Paper>
          <List>
            <ListItem>0 - 5: Kosa (0)</ListItem>
            <ListItem>6 - 20: Mocna wrogość</ListItem>
            <ListItem>21 - 30: Wrogość</ListItem>
            <ListItem>31 - 40: Antypatia</ListItem>
            <ListItem>41 - 48: Delikatna antypatia</ListItem>
            <ListItem>49 - 51: Neutralność</ListItem>
            <ListItem>52 - 60: Delikatna sympatia</ListItem>
            <ListItem>61 - 65: Sympatia</ListItem>
            <ListItem>66 - 80: Relacja pozytywna (70)</ListItem>
            <ListItem>81 - 95: Układ (85)</ListItem>
            <ListItem>96 - 100: Zgoda (100)</ListItem>
            <ListItem>Jeśli klub nie posiada bezpośredniej relacji maksymalna pozytywna relacja na podstawie drugiego i trzeciego stopnia relacji może wynieść 65. Analogicznie minimalny poziom w pośrednim porównaniu może wynieść 10. Bezpośrednie relacje: Zgoda (100), Układ (85), Pozytywna (70), Kosa (0).</ListItem>
          </List>
        </Paper>
      </Grid> */}
    </Grid>
  );
}

export default CompareClubs;
