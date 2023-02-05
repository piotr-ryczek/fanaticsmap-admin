import React from 'react';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

function FieldWrapper(props) {
  const { children } = props;

  return (
    <Box pt={1} pb={1} pl={2} pr={2}>
      <Grid container alignItems="center">
        {children}
      </Grid>
    </Box>
  );
}

export default FieldWrapper;
