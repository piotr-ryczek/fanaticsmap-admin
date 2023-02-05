import _get from 'lodash/get';

import store from 'config/store';
import Api from 'services/api';
import history from 'config/history';

import { setMessage, setIsAuthenticated } from 'components/app/app.actions';

class Auth {

  constructor(store) {
    const { getState, dispatch } = store;

    this.getState = getState;
    this.dispatch = dispatch;
  }

  login = async (email, password) => {
    try {
      const {
        data: jwtToken,
        credentials,
      } = await Api.post('/users/login', {
        email,
        password,
        adminPanel: true,
      });

      if (!credentials.includes('enterAdminPanel')) throw new Error('NOT_AUTHORIZED');
  
      localStorage.setItem('jwtToken', jwtToken);
      localStorage.setItem('credentials', credentials);
  
      this.dispatch(setMessage('success', 'LOGIN_SUCCESS'));
      this.dispatch(setIsAuthenticated(true, credentials));

      history.push('/clubs');
    } catch (error) {
      const type = _get(error, 'response.data.type', error.message);
      
      this.dispatch(setMessage('error', type));
    }
  }

  logout = async () => {
    this.clearAuth({
      type: 'success',
      code: 'LOGOUT_SUCCESS',
    });
  }

  clearAuth = (message = null) => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('credentials');

    this.dispatch(setIsAuthenticated(false));

    history.push('/login');

    if (message) {
      const { type, code } = message;

      this.dispatch(setMessage(type, code));
    }
  }

  hasCredentialLocal = (credentialOrCredentials) => {
    const { credentials } = this.getState().app;

    if (Array.isArray(credentialOrCredentials)) {
      return credentialOrCredentials.every(credentialToCheck => credentials.includes(credentialToCheck));
    }

    return credentials.includes(credentialOrCredentials);
  }

  verifyApiError = (error) => {
    const {
      response: {
        data: {
          type,
        }
      },
    } = error;

    if (type !== 'NOT_AUTHORIZED') return false;
    
    this.clearAuth({ type: 'error', code: 'NOT_AUTHORIZED' });
    return true;
  }
}

export default new Auth(store);