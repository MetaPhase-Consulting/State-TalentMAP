import { api, doLogin } from '../utilities';

const addCompares = () => {
  [1, 2, 3, 4, 5].map(n => (
    cy.get(`:nth-child(${n}) > .results-card > .footer > :nth-child(1) > .compare-check-box-container`)
      .click()
  ));
};

const navToCompare = () => cy.get('.button-container > .usa-button').click();

describe('Position', () => {
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

  it('adds comparisons up to the limit', () => {
    addCompares();

    cy.wait('@getCompare');

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

    cy.get(':nth-child(6) > .column-title-link > a')
      .should('not.exist');
  });
});
