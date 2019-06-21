import { api, doLogin } from '../utilities';

describe('Search', () => {
  beforeEach(() => {
    doLogin();

    cy.visit('/results');

    cy.route('GET', `${api}/position/*`).as('getPosition');
    cy.route('GET', `${api}/position/?position_number__in=*`).as('getCompare');

    cy.wait('@getPosition');
  });

  afterEach(() => {
    cy.visit('/logout');
  });

  it('opens and closes the compare drawer', () => {
    cy.get(':nth-child(1) > .results-card > .footer > :nth-child(1) > .compare-check-box-container')
      .click();

    cy.wait('@getCompare');

    cy.get('.compare-drawer')
      .should('not.have.class', 'drawer-hidden');

    cy.get('.check-container > .interactive-element > .fa')
      .click();

    cy.get('.compare-drawer')
      .should('have.class', 'drawer-hidden');
  });

  it('navigates to position details', () => {
    cy.get(':nth-child(1) > .results-card > .header > .usa-width-two-thirds > :nth-child(1) > a')
      .click();

    cy.wait('@getPosition');

    cy.get('.position-details-header-title > h1')
      .should('exist');
  });
});
