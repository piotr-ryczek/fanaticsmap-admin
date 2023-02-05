const namespace = 'APP';

export const SET_MESSAGE = `${namespace}_SET_MESSAGE`;
export const SET_IS_AUTHENTICATED = `${namespace}_SET_IS_AUTHENTICATED`;
export const SET_IS_LOADING = `${namespace}_SET_IS_LOADING`;

export const setMessage = (messageType, messageCode = 'UNKNOWN_ERROR') => (dispatch) => {
  dispatch({
    type: SET_MESSAGE,
    payload: {
      messageCode,
      messageType,
    },
  });
};

export const clearMessage = () => (dispatch) => {
  dispatch({
    type: SET_MESSAGE,
    payload: {
      messageCode: '',
      messageType: '',
    },
  });
}

export const setIsAuthenticated = (isAuthenticated, credentials = []) => (dispatch) => {
  dispatch({
    type: SET_IS_AUTHENTICATED,
    payload: {
      isAuthenticated,
      credentials,
    },
  });
};

export const setIsLoading = (isLoading) => (dispatch) => {
  dispatch({
    type: SET_IS_LOADING,
    payload: isLoading,
  });
};