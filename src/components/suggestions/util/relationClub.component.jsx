import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import Tooltip from '@material-ui/core/Tooltip';

const getTooltipText = (type) => {
  switch (type) {
    case 'no-change':
      return 'suggestions.tooltips.noChange';

    case 'remove':
      return 'suggestions.tooltips.toRemove';

    case 'add':
      return 'suggestions.tooltips.toAdd';

    case 'create':
      return 'suggestions.tooltips.toCreate';
  }
}

function RelationClub(props) {
  const { t } = useTranslation();

  const {
    type,
    children,
  } = props;

  const tooltipText = t(getTooltipText(type));

  return (
    <Tooltip placement="top" title={tooltipText}>
      <span className={classNames('relation-club', type)}>
        {children}
      </span>
    </Tooltip>
  )
}

export default RelationClub;
