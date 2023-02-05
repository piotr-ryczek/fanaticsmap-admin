import React, { memo, useState, useCallback } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TableHeadMUI from '@material-ui/core/TableHead';
import TableRowMUI from '@material-ui/core/TableRow';
import TableCellMUI from '@material-ui/core/TableCell';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

import HelpIcon from '@material-ui/icons/Help';

import { useButtonStyles } from 'theme/useStyles';

const useStyles = makeStyles(theme => ({
  leftMargin: {
    marginLeft: theme.spacing(2),
  }
}));

function TableHeader(props) {
  const { t } = useTranslation();
  const [isRemoveDialogOpened, setIsRemoveDialogOpened] = useState(false);

  const {
    handleDelete,
    isAllChecked,
    toggleSelected,
    columns,
    canRemove,
    canView,
    selected,
    hasEditCredential,
  } = props;

  const handleOpenRemoveDialog = useCallback(() => {
    setIsRemoveDialogOpened(true);
  }, []);

  const handleCloseRemoveDialog = useCallback(() => {
    setIsRemoveDialogOpened(false);
  }, []);

  const handleDeleteAndCloseRemoveDialog = useCallback(() => {
    setIsRemoveDialogOpened(false);

    handleDelete();
  }, [handleDelete]);

  const buttonClasses = useButtonStyles({});
  const classes = useStyles({});

  return (
    <TableHeadMUI>
      <TableRowMUI>
        {canRemove && (
          <TableCellMUI>
            <Checkbox
              checked={isAllChecked}
              onChange={toggleSelected}
            />

            {hasEditCredential && selected.length > 0 && (
              <>
                <Dialog
                  open={isRemoveDialogOpened}
                  onClose={handleCloseRemoveDialog}
                >
                  <DialogTitle>{t('global.confirmRemove', { nrItems: selected.length })}</DialogTitle>
                  
                  <DialogActions>
                    <Button
                      onClick={handleCloseRemoveDialog}
                      variant="contained"
                      color="primary"
                    >
                      {t('global.close')}
                    </Button>
                    <Button
                      onClick={handleDeleteAndCloseRemoveDialog}
                      variant="contained"
                      color="primary"
                      className={buttonClasses.remove}
                    >
                      {t('global.remove')}
                    </Button>
                  </DialogActions>
                </Dialog>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={handleOpenRemoveDialog}
                  className={classNames(buttonClasses.remove, classes.leftMargin)}
                >
                  {t('global.remove')}
                </Button>
              </>
            )}
          </TableCellMUI>
        )}
        {columns.map(({ name, headerLabel, alignment = 'left', headerTooltip }) => (
          <TableCellMUI key={name} align={alignment}>
            <div className={classNames('cell-content', alignment)}>
              {t(`columns.${headerLabel || name}`)}
              {headerTooltip && (
                <Tooltip placement="top" title={t(`tableTooltips.${headerTooltip}`)}>
                  <HelpIcon />
                </Tooltip>
              )}
            </div>
          </TableCellMUI>
        ))}
        {(hasEditCredential || canView) && (
          <TableCellMUI>{t('global.actions')}</TableCellMUI>
        )}
      </TableRowMUI>
    </TableHeadMUI>
  );
}

export default memo(TableHeader);
