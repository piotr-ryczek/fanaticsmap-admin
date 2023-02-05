import React from 'react';
import RelationClub from './relationClub.component';

function AfterRelations(props) {
  const {
    current,
    toRemove,
    toAdd,
    toCreate = [],
  } = props;

  return (
    <>
      {toRemove.map(club => <RelationClub key={club._id} type="remove">{club.name}</RelationClub>)}
      {current.map(club => <RelationClub key={club._id} type={toAdd.includes(club._id) ? 'add' : 'no-change'}>{club.name}</RelationClub>)}
      {toCreate.map(clubName => <RelationClub key={clubName} type="create">{clubName}</RelationClub>)}
    </>
  );
}

export default AfterRelations;
