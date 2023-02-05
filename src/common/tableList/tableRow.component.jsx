import React, { useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';

import TableRowMUI from '@material-ui/core/TableRow';
import TableCellMUI from '@material-ui/core/TableCell';

import TableCell from './tableCell.component';

const useStyles = makeStyles(theme => ({
  button: {
    marginLeft: theme.spacing(2),
  },
}));

function TableRow(props) {
  const { t } = useTranslation();
  const classes = useStyles({});

  const {
    columns,
    singleData,
    onSelect,
    onDeselect,
    isChecked,
    canRemove,
    canEdit,
    canView,
    apiPath,
    hasEditCredential,
    actions = [],
  } = props;

  const { _id: id } = singleData;

  const handleChange = useCallback(() => {
    if (isChecked) {
      onDeselect(id)
    } else {
      onSelect(id);
    }
  }, [isChecked, id, onDeselect, onSelect]);

  return (
    <TableRowMUI>
      {canRemove && hasEditCredential && (
        <TableCellMUI>
          <Checkbox
            checked={isChecked}
            onChange={handleChange}
          />
        </TableCellMUI>
      )}
      

      {columns.map(column => (
        <TableCell
          key={column.name}
          data={singleData}
          column={column}
        />
      ))}

      {((canEdit && hasEditCredential) || canView) && (
        <TableCellMUI>
          <Link to={`${apiPath}/${singleData._id}`} target="_blank">
            <Button variant="contained" color="primary">
              {canEdit ? t('global.edit') : t('global.view')}
            </Button>
          </Link>

          {actions.map(({ label, action }) => (
            <Button
              variant="contained"
              color="default"
              onClick={() => action(id)}
              key={label}
              className={classes.button}
            >
              {label}
            </Button>
          ))}
        </TableCellMUI>
      )}
      
    </TableRowMUI>
  )
}

export default memo(TableRow);
