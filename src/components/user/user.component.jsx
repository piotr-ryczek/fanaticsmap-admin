import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';

import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';

import history from 'config/history';
import userSchema from 'schemas/user';
import Api from 'services/api';

import { setMessage, setIsLoading } from 'components/app/app.actions';

import UserForm from './userForm.component';

const parseUserData = (data) => {
  const {
    email,
    verified,
    role: {
      _id: roleId,
    },
  } = data;

  return {
    email,
    role: roleId,
    password: '',
    verified,
    isNewPassword: false,
  };
};

function User(props) {
  const {
    editType,
    match: {
      params: {
        id: userId,
      },
    },
  } = props;

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [fields, setFields] = useState({
    email: '',
    role: '',
    password: '',
    verified: false,
    isNewPassword: false,
  });
  const [roles, setRoles] = useState([]);

  const fetchRoles = async () => {
    const { data: roles } = await Api.get(`/roles`);

    setRoles(roles);
  }

  const fetchData = async () => {
    const { data: userData } = await Api.get(`/users/${userId}`);

    setFields(parseUserData(userData));
  }

  useEffect(() => {
    fetchRoles();
    if (editType === 'update') {
      fetchData();
    }
  }, []);

  const handleSubmit = useCallback(async (values) => {
    const {
      isNewPassword,
      password,
      ...restValues
    } = values;

    if (editType === 'new' || isNewPassword) {
      Object.assign(restValues, {
        password,
      });
    }

    dispatch(setIsLoading(true));

    if (editType === 'new') {
      const { data: userId } = await Api.post(`/users`, restValues);

      dispatch(setMessage('success', 'USER_ADDED_SUCCESS'));
      history.push(`/users/${userId}`);

    } else {
      await Api.put(`/users/${userId}`, restValues);

      dispatch(setMessage('success', 'USER_UPDATED_SUCCESS'));
    }

    dispatch(setIsLoading(false));
  }, []);

  const handleValidate = useCallback(async (values) => {
    const { isNewPassword, password } = values;

    const errors = {};

    if (
      (editType === 'new' || (isNewPassword && editType === 'update'))
      && password === ''
    ) {
      Object.assign(errors, {
        password: t('formErrors.passwordRequired'),
      });
    }
    
    try {
      await userSchema.validate(values, {
        abortEarly: false,
      });
    } catch (error) {
      
      const { inner: schemaErrors } = error;

      const parsedErrors = schemaErrors.reduce((acc, { path, message }) => {
        Object.assign(acc, {
          [path]: message,
        });

        return acc;
      }, {});

      Object.assign(errors, parsedErrors);

      throw errors;
    }

    throw errors;
  }, []);

  return (
    <Paper>
      <Box p={3}>
        <Formik
          initialValues={fields}
          enableReinitialize
          onSubmit={handleSubmit}
          validate={handleValidate}
          // eslint-disable-next-line react/jsx-props-no-spreading
          render={props => <UserForm {...props} editType={editType} roles={roles} />}
        />
      </Box>
    </Paper>
  );
}

export default User;
