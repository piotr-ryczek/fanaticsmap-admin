import React from 'react';

import TableBodyMUI from '@material-ui/core/TableBody';

import TableRow from './tableRow.component';

function TableBody(props) {
  const {
    data,
    columns,
    selected,
    onSelect,
    onDeselect,
    canEdit,
    canView,
    canRemove,
    apiPath,
    hasEditCredential,
    actions,
  } = props;

  return (
    <TableBodyMUI>
      {data.map(singleData => {
        const isChecked = selected.includes(singleData._id);

        return (
          <TableRow
            key={singleData._id}
            singleData={singleData}
            columns={columns}
            isChecked={isChecked}
            onSelect={onSelect}
            onDeselect={onDeselect}
            canEdit={canEdit}
            canView={canView}
            canRemove={canRemove}
            apiPath={apiPath}
            hasEditCredential={hasEditCredential}
            actions={actions}
          />
        );
      })}
    </TableBodyMUI>
  );
}

export default TableBody;
