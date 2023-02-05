import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import CreateIcon from '@material-ui/icons/Create';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';

import { formatDate, formatDateFromNow } from 'util/helpers';

const useStyles = makeStyles(theme => ({
  listItemIcon: {
    minWidth: '36px',
  },
}));

function SuggestionLink(props) {
  const { t } = useTranslation();
  const classes = useStyles({});

  const {
    isChecked,
    onSelect,
    onDeselect,
    isCurrent,
    onCurrentChange,
    suggestion: {
      _id: id,
      type,
      createdAt,
      original,
      data,
      user,
    }
  } = props;

  const handleChange = useCallback((event) => {
    event.stopPropagation();
    
    if (isChecked) {
      onDeselect(id)
    } else {
      onSelect(id);
    }
  }, [isChecked, id, onDeselect, onSelect]);

  const name = type === 'new' ? data.name : original.name;

  const handleCurrentSuggestionChange = useCallback(() => {
    onCurrentChange(id);
  }, []);

  // eslint-disable-next-line react/jsx-one-expression-per-line
  const suggestionName = (
    <div className="suggestion-title">
      <span className="suggestion-title-for">
        {t('global.for')}
        :
      </span>
      <strong>{name}</strong>
      {user && (
        <>
          <span className="suggestion-title-by">
            {t('global.by')}
            :
          </span>
          <strong>{user.email}</strong>
        </>
      )}
      <span className="suggestion-title-date">
        <span className="suggestion-title-at">
          {t('global.at')}
        </span>
        <strong>{formatDate(createdAt)}</strong>
        <span className="suggestion-title-date-from">
          (
          {formatDateFromNow(createdAt)}
          )
        </span>
      </span>
    </div>
  );

  return (
    <Box display="flex">
      <Checkbox
        checked={isChecked}
        onChange={handleChange}
      />
      <ListItem button onClick={handleCurrentSuggestionChange} selected={isCurrent}>
        <ListItemIcon className={classes.listItemIcon}>
          {type === 'new'
            ? (<LibraryAddIcon />)
            : (<CreateIcon />)}
        </ListItemIcon>
        <ListItemText primary={suggestionName} />
      </ListItem>
    </Box>
  );
}

export default SuggestionLink;

