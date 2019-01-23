import axios from 'axios';
import { fetchUserToken, hasValidToken, propOrDefault, redirectToLoginRedirect } from './utilities';

export const config = {
  baseURL: process.env.API_URL || 'http://localhost:8000/api/v1',
};

const api = axios.create(config);

api.interceptors.request.use((request) => {
  const requestWithAuth = request;
  if (hasValidToken()) {
    requestWithAuth.headers.Authorization = fetchUserToken();
  }

  return requestWithAuth;
});

api.interceptors.response.use(response => response, (error) => {
  switch (propOrDefault(error, 'response.status')) {
    case 401: {
      // Due to timing of import store before history is created, importing store here causes
      // exports of api to be undefined. So this causes an error for `userProfile.js` when
      // attempting to login. Went with the eslint quick re-enable to get around this.
      redirectToLoginRedirect();
      break;
    }

    default: {
      // We don't want to stop the pipeline even if there's a problem with the dispatch
      // and if there is, that should be resolved. This is just a placeholder until we
      // actually need a default case to satisfy eslint.
      const serverMessage = propOrDefault(error, 'response.data.detail');

      if (serverMessage === 'Invalid token') {
        redirectToLoginRedirect();
      }
    }
  }

  return Promise.reject(error);
});

export default api;
