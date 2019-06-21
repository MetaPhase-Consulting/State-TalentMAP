import config from '../public/config/config.json';

const api = config.api_config.baseURL;

const doLogin = () => {
  cy.server();
  cy.route('GET', `${api}/profile/`).as('getProfile');

  cy.wait(300);

  cy.get(':nth-child(1) > a').click();

  cy.wait('@getProfile');
};

export default { api, doLogin };
