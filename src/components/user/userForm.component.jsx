import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { setMessage } from 'components/app/app.actions';
// import { useLabelStyles } from 'theme/useStyles';

function UserForm({
  editType,
  roles,
  values: {
    email,
    role,
    password,
    verified,
    isNewPassword,
  },
  errors,
  touched,
  handleSubmit,
  handleChange,
  handleBlur,
  setFieldValue,
  setFieldTouched,
  isSubmitting,
  isValid
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch(); 

  const isError = (field) => errors[field] && touched[field];

  useEffect(() => {
    if (isSubmitting && !isValid) {
      dispatch(setMessage('error', 'FORM_INCORRECT'))
    }
  }, [isSubmitting, isValid]);

  const handleChangeIsNewPassword = useCallback((event, isChecked) => {
    if (!isChecked) {
      setFieldValue('password', '');
    }

    setFieldTouched('password', false);
    setFieldValue('isNewPassword', isChecked);
  }, [])

  // const labelClasses = useLabelStyles({});

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            error={isError('email')}
            helperText={isError('email') ? t(errors.email) : ''}
            label={t('user.email')}
            value={email}
            onChange={handleChange}
            onBlur={handleBlur}
            name="email"
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl error={isError('role')} fullWidth>
            <InputLabel htmlFor="role">{t('user.role')}</InputLabel>
            <Select
              error={isError('role')}
              value={role}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={t('user.role')}
              name="role"
              inputProps={{
                id: 'role',
              }}
              fullWidth
            >
              {roles.map(({ _id: id, name }) => (
                <MenuItem
                  key={id}
                  value={id}
                >
                  {t(`roles.${name}`)}
                </MenuItem>
              ))}
            </Select>
            {isError('role') && <FormHelperText>{t(errors.role)}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={(
              <Checkbox
                checked={verified}
                onChange={handleChange}
                name="verified"
              />
            )}
            label={`${t('user.verified')}?`}
          />
        </Grid>
        {editType === 'update' && (
          <Grid item xs={12}>
            <FormControlLabel
              control={(
                <Checkbox
                  checked={isNewPassword}
                  onChange={handleChangeIsNewPassword}
                  name="isNewPassword"
                />
              )}
              label={t('user.isNewPassword')}
            />
          </Grid>
        )}
        {(isNewPassword || editType === 'new')  && (
          <Grid item xs={12}>
            <TextField
              error={isError('password')}
              helperText={isError('password') ? t(errors.password) : ''}
              label={t('user.password')}
              value={password}
              onChange={handleChange}
              onBlur={handleBlur}
              name="password"
              type="password"
              fullWidth
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            size="large"
          >
            {t('global.save')}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default UserForm;
