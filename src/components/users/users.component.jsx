import React, { useMemo } from 'react';
import Auth from 'services/auth';

import TableList from 'common/tableList/tableList.component';

function Users(props) {
  const columns = useMemo(() => ([{
    name: 'email',
    type: 'text'
  }, {
    name: 'role',
    type: 'text',
    field: 'role.name',
    translate: 'roles',
  }, {
    name: 'verified',
    type: 'boolean'
  }]), []);

  const searchColumns = useMemo(() => ([{
    name: 'email',
    type: 'text',
  }]), []);
  
  const hasEditCredential = Auth.hasCredentialLocal('updateUser');

  return (
    <TableList
      {...props}
      apiPath="/users"
      adminPath="/users"
      canAdd
      canEdit
      canRemove
      columns={columns}
      searchColumns={searchColumns}
      hasEditCredential={hasEditCredential}
    />
  );
}

export default Users;
