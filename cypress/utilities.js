import config from '../public/config/config.json';

const api = config.api_config.baseURL;

const doLogin = () => {
  cy.server();
  cy.route('GET', `${api}/profile/`).as('getProfile');

  cy.visit('/');

  cy.wait(100);

  cy.get(':nth-child(1) > a').click();

  cy.wait(20000);

  cy.wait('@getProfile');
};

const getAxeConfig = ({ rules$ = [], ...rest }) => {
  const ignoredRules = [
    'aria-valid-attr-value',
    'landmark-no-duplicate-banner',
    'region',
    'landmark-banner-is-top-level',
  ];
  return {
    rules: [
      ...ignoredRules.map(r => ({ id: r, enabled: false })),
      ...rules$,
    ],
    ...rest,
  };
};

export default { api, doLogin, getAxeConfig };
