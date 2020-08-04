import { api, doLogin } from '../utilities';

const addCompares = () => {
  // cy.clearLocalStorage('compare');
  [1, 2, 3, 4, 5, 6].map(n => { // eslint-disable-line
    cy.wait(1000);
    cy.get(`:nth-child(${n}) > .results-card > .footer > :nth-child(1) > .compare-check-box-container`)
      .click();
  });
};

const navToCompare = () => cy.get('.button-container > .usa-button').click();

describe('Compare', () => {
  beforeEach(() => {
    doLogin();

    cy.visit('/results');

    cy.route('GET', `${api}/fsbid/available_positions/*`).as('getPosition');
    cy.route('GET', `${api}/fsbid/available_positions/?id=*`).as('getCompare');

    cy.wait('@getPosition');
  });

  afterEach(() => {
    cy.visit('/logout');
  });

  it('adds comparisons up to the limit', () => {
    addCompares();

    cy.wait('@getCompare');

    cy.wait(1000);

    cy.get(':nth-child(6) > .results-card > .footer > :nth-child(1) > .compare-check-box-container')
      .contains('Limit Reached');
  });

  it('navigates to the Compare page after selecting positions to compare', () => {
    addCompares();

    cy.wait('@getCompare');

    navToCompare();

    cy.get('.comparison-container > h1')
      .should('have.text', 'Compare Positions');

    cy.get(':nth-child(6) > .column-title-link > a')
      .should('exist');
  });

  it('removes positions from the Compare page', () => {
    addCompares();

    cy.wait('@getCompare');

    navToCompare();

    cy.get(':nth-child(6) > .usa-grid-full > .close-button-container > .interactive-element > .fa').click();

    cy.wait('@getCompare');

    cy.wait(100);

    cy.get(':nth-child(6) > .column-title-link > a')
      .should('not.exist');
  });
});
