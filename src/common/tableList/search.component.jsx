import React, { useState, useEffect, memo, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next';
import update from 'immutability-helper';
import { useDebouncedCallback } from 'use-debounce';
import _upperFirst from 'lodash/upperFirst';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

function Search(props) {
  const didMountRef = useRef(false);
  const { searchColumns, onSearch } = props;

  const initialState = searchColumns.reduce((acc, { name, type }) => {
    switch (type) {
      case 'text':
        acc[name] = '';
        break;

      case 'select':
        acc[name] = '';
        break;
    }

    return acc;
  }, {});

  const [search, setSearch] = useState(initialState);
  const { t } = useTranslation();

  const updateField = (event) => {
    const { target, target: { value } } = event;

    const name = target.getAttribute('name');

    setSearch(update(search, {
      [name]: { $set: value },
    }));
  };

  const updateSelectField = (event) => {
    const { target: { value, name } } = event;

    const finalValue = value === 'default' ? null : value;

    setSearch(update(search, {
      [name]: { $set: finalValue },
    }));
  }

  // Debounce callback on memoized function to prevent recreating
  const [updateParent] = useDebouncedCallback(
    useMemo(() => () => {
      const filteredSearch = Object.entries(search).reduce((acc, [name, value]) => {
        if (value !== null && value !== 'default' && value !== '') {
          acc[name] = {
            type: searchColumns.find((searchColumn) => searchColumn.name === name).type,
            value,
          };
        }

        return acc;
      }, {});

      onSearch(filteredSearch);
    }, [search]),
    500
  );

  useEffect(() => {
    if (didMountRef.current) {
      updateParent();
    } else {
      didMountRef.current = true;
    }
  }, [search, updateParent]);

  const renderSearchField = ({
    name,
    type,
    choices,
  }) => {
    switch (type) {
      case 'text':
        return (
          <Box display="flex">
            <IconButton>
              <SearchIcon />
            </IconButton>
            <InputBase
              // className={classes.input}
              placeholder={`${_upperFirst(t(`columns.${name}`))}...`}
              value={search[name]}
              name={name}
              onChange={updateField}
              fullWidth
            />
          </Box>
        );
  
      case 'select':
        return (
          <Box display="flex" p={1}>
            <Select
              name={name}
              onChange={updateSelectField}
              fullWidth
              value={search[name] || 'default'}
            >
              <MenuItem value="default">{t(`columns.${name}`)}</MenuItem>
              {choices.map(({ value, label }) => (
                <MenuItem key={value} value={value}>{label}</MenuItem>
              ))}
            </Select>
          </Box>
        );
    }
  }

  return (
    <Grid item container spacing={2}>
      {searchColumns.map(column => (
        <Grid item xs={12 / searchColumns.length} key={column.name}>
          <Paper>
            {renderSearchField(column)}
          </Paper>
        </Grid>
      ))}
    </Grid>
  )
}

export default memo(Search);
