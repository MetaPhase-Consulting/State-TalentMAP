// important: babel-polyfill needs to be first to avoid any errors in IE11
import 'core-js/shim'; // included < Stage 4 proposals
import 'regenerator-runtime/runtime';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { get } from 'lodash';
import './sass/styles.scss';
import App from './Components/App/App';
import Splash from './Components/Splash';
import { getAssetPath } from './utilities';
import { checkFlag } from './flags';

import '../node_modules/uswds/dist/js/uswds.min';
import './polyfills';

const isPersonaAuth = () => checkFlag('flags.persona_auth');

export const render = () => {
  ReactDOM.render((
    <App />
  ), document.getElementById('root') || document.createElement('div'));
};

// Because the JWT request could be slow.
export const renderLoading = () => {
  ReactDOM.render((
    <Splash />
  ), document.getElementById('root') || document.createElement('div'));
};

// function to initialize app, capture feature flags in localStorage
export const init = (config) => {
  sessionStorage.setItem('config', JSON.stringify(config));

  const auth = get(config, 'hrAuthUrl');

  const headers = {
    Accept: 'application/json',
  };

  // Only needed for local development
  if (isPersonaAuth()) { headers.tmusrname = sessionStorage.getItem('tmusrname'); }

  if (auth) {
    renderLoading();
    axios
      .get(auth, { headers })
      .then((response) => {
        sessionStorage.setItem('jwt', response.data);
        render();
      })
      .catch(() => render());
  } else {
    render();
  }
};

// retrieve static config file, pass to app init
export const getConfig = () => {
  sessionStorage.removeItem('config');

  // fetch config.json to get API URL
  axios.get(getAssetPath('/config/config.json'))
    .then((response) => {
      const url = get(response, 'data.api_config.baseURL');
      if (url) {
        // use baseURL from config.json to form featureflags endpoint
        axios
          .get(`${url}/featureflags/`)
          // use that response if valid
          .then((response$) => {
            init(get(response$, 'data', {}));
          })
          // otherwise fallback and use the config.json
          .catch(() => init(get(response, 'data', {})));
      } else {
        init(get(response, 'data', {}));
      }
    })
    .catch(() => init({}));
};
getConfig();
