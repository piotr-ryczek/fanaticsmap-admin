import React, { useCallback, memo } from 'react';

import TextField from '@material-ui/core/TextField';

function ClubByPower(props) {
  const {
    index,
    tier,
    name,
    transliterationName,
    clubId,
    tierValue,
    isError,
    handleChange,
  } = props;

  const onHandleChange = useCallback((event) => {
    const { value } = event.target;

    handleChange(clubId, value);
  }, [handleChange]);

  const finalValue = typeof tierValue === 'undefined' ? tier : tierValue;

  return (
    <tr>
      <td className="club-name">
        {`${index + 1}. `}
        {name}
        {transliterationName && (
          <span className="club-transliteration-name">{`(${transliterationName})`}</span>
        )}
      </td>
      <td className="club-tier">
        <TextField
          error={isError}
          // label={t('club.tier')}
          value={finalValue}
          onChange={onHandleChange}
          name="tier"
        />
      </td>
    </tr>
  );
}

export default memo(ClubByPower);
