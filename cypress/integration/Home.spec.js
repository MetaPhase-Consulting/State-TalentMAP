import { api, doLogin, getAxeConfig } from '../utilities';

// Define at the top of the spec file or just import it
function terminalLog(violations) {
  cy.task(
    'log',
    `${violations.length} accessibility violation${
      violations.length === 1 ? '' : 's'
    } ${violations.length === 1 ? 'was' : 'were'} detected`,
  );
  // pluck specific keys to keep the table readable
  const violationData = violations.map(
    ({ id, impact, description, nodes }) => ({
      id,
      impact,
      description,
      nodes: nodes.length,
    }),
  );

  cy.task('table', violationData);
}

describe('Home', () => {
  beforeEach(() => {
    cy.server();

    cy.route('GET', `${api}/permission/user/`)
      .as('getPermission');

    /* cy.route('GET', `${api}/position/highlighted/*`)
      .as('getPosition1');
    cy.route('GET', `${api}/position/?skill__in=*`)
      .as('getPosition2');
    cy.route('GET', `${api}/position/?grade__code__in=*`)
      .as('getPosition3'); */

    doLogin();
  });

  afterEach(() => {
    cy.visit('/logout');
  });

  it('is accessible', () => {
    cy.injectAxe();

    cy.configureAxe(getAxeConfig({}));

    // TODO - ensure these routes are what the test case will deliver
    /* cy.wait('@getPosition1');
    cy.wait('@getPosition2');
    cy.wait('@getPosition3'); */

    cy.wait(4000);

    cy.wait('@getPermission');

    cy.checkA11y(null, null, terminalLog);
  });

  it('navigates to results', () => {
    cy.route('GET', `${api}/fsbid/available_positions/*`)
      .as('getPosition');

    cy.get('.link-button').click();

    cy.wait('@getPosition');

    cy.get('#total-results')
      .contains('Viewing');
  });

  it('matches navigation header snapshot', () => {
    cy.get('.usa-navbar')
      .matchImageSnapshot();
  });

  /* it('matches footer snapshot', () => {
    cy.get('.usa-footer-primary-section')
      .matchImageSnapshot('footer-top');

    cy.get('.usa-footer-secondary_section')
      .matchImageSnapshot('footer-bottom');
  }); */
});
