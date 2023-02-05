import React from 'react';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';

import FieldWrapper from './fieldWrapper.component';



function FieldLabel(props) {
  const {
    label,
    value,
    className,
    tooltipText = '',
  } = props;

  return (
    
    <FieldWrapper>
      <Grid item xs={2}>
        <Typography color="textSecondary">
          {label}
        </Typography>
      </Grid>
      
      <Grid item xs={10}>
        <Tooltip title={tooltipText} placement="left">
          <Typography className={className}>
            {value}
          </Typography>
        </Tooltip>
      </Grid> 
      
    </FieldWrapper>
  )
}

export default FieldLabel;
