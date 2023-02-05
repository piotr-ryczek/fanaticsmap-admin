import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import SelectAutocomplete from 'react-select';

import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import Api from 'services/api';
import { setIsLoading } from 'components/app/app.actions';

const getOptionValue = ({ _id }) => _id;
const getOptionLabel = ({ name }) => name;

function ClubsByRelations() {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const [clubs, setClubs] = useState([]);
  const [country, setCountry] = useState([]);
  const [possibleCountries, setPossibleCountries] = useState([]);

  const fetchData = useCallback(async () => {
    const queryData = country ? { countries: [country._id] } : {};

    dispatch(setIsLoading(true));

    const {
      data: retrievedClubs,
    } = await Api.get('/clubs/byRelations', queryData);

    setClubs(retrievedClubs);
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

  const handleCountryChange = useCallback((value) => {
    setCountry(value);
  }, []);

  return (
    <Paper>
      <Box p={3}>
        <Grid container spacing={2}>
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
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Nazwa klubu
                  </TableCell>
                  <TableCell>
                    Zgody
                  </TableCell>
                  <TableCell>
                    Układy
                  </TableCell>
                  <TableCell>
                    Relacje pozytywne
                  </TableCell>
                  <TableCell>
                    Kosy
                  </TableCell>
                  <TableCell>
                    Satelity
                  </TableCell>
                  <TableCell>
                    Jest satelitą?
                  </TableCell>
                  <TableCell>
                    Razem relacji
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clubs.map((club) => {
                  const {
                    _id: clubId,
                    name,
                    friendships = [],
                    agreements = [],
                    positives = [],
                    enemies = [],
                    satellites = [],
                    satelliteOf,
                  } = club;

                  let sum = friendships.length + agreements.length + positives.length + enemies.length + satellites.length;
                  if (satelliteOf) sum += 1;

                  return (
                    <TableRow key={clubId}>
                      <TableCell>
                        <a
                          href={`/clubs/${clubId}`}
                          target="_blank"
                        >
                          {name}
                        </a>
                      </TableCell>
                      <TableCell>
                        <ul className="clear-list">
                          {friendships.map(relationClub => <li key={relationClub._id}>{relationClub.name}</li>)}
                        </ul>
                      </TableCell>
                      <TableCell>
                        <ul className="clear-list">
                          {agreements.map(relationClub => <li key={relationClub._id}>{relationClub.name}</li>)}
                        </ul>
                      </TableCell>
                      <TableCell>
                        <ul className="clear-list">
                          {positives.map(relationClub => <li key={relationClub._id}>{relationClub.name}</li>)}
                        </ul>
                      </TableCell>
                      <TableCell>
                        <ul className="clear-list">
                          {enemies.map(relationClub => <li key={relationClub._id}>{relationClub.name}</li>)}
                        </ul>
                      </TableCell>
                      <TableCell>
                        <ul className="clear-list">
                          {satellites.map(relationClub => <li key={relationClub._id}>{relationClub.name}</li>)}
                        </ul>
                      </TableCell>
                      <TableCell>
                        {satelliteOf ? satelliteOf.name : ''}
                      </TableCell>
                      <TableCell>
                        {sum}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}

export default ClubsByRelations;
