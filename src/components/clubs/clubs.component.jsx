import React, { useMemo } from 'react';
import Auth from 'services/auth';

import TableList from 'common/tableList/tableList.component';

function Clubs(props) {
  const columns = useMemo(() => ([{
    name: 'name',
    type: 'text'
  }, {
    name: 'logo',
    type: 'image',
    alignment: 'center',
    headerTooltip: 'clubLogo',
  }, {
    name: 'tier',
    type: 'text',
  }]), []);

  const searchColumns = useMemo(() => ([{
    name: 'name',
    type: 'text',
  }]), []);

  const hasEditCredential = Auth.hasCredentialLocal('updateClub');

  return (
    <TableList
      {...props}
      apiPath="/clubs"
      adminPath="/clubs"
      canAdd
      canEdit
      canRemove
      columns={columns}
      searchColumns={searchColumns}
      hasEditCredential={hasEditCredential}
    />
  );
}

export default Clubs;
