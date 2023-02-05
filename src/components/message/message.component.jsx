import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useDebouncedCallback } from 'use-debounce';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { MESSAGE_HIDE_DELAY } from 'config/config';
import Box from '@material-ui/core/Box';
import { clearMessage } from 'components/app/app.actions';

function Message() {

  const dispatch = useDispatch();

  const {
    messageCode,
    messageType,
  } = useSelector(state => ({
    messageCode: state.app.messageCode,
    messageType: state.app.messageType,
  }));

  const [clearMessageDebounced] = useDebouncedCallback(() => {
    dispatch(clearMessage());
  }, MESSAGE_HIDE_DELAY);

  if (messageCode) clearMessageDebounced();

  const { t } = useTranslation();

  return messageCode && messageType && (
    <div id="message" className={messageType}>
      <Grid container spacing={0}>
        <Grid item xs={12} className={messageType}>
          <Box p={2}>
            <Typography variant="body1" align="center">{t(`messageCodes.${messageCode}`)}</Typography>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}

export default Message;
