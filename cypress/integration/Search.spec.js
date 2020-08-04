import { isString } from 'lodash';
import { api, doLogin } from '../utilities';

describe('Search', () => {
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

  it('opens and closes the compare drawer', () => {
    cy.get('.compare-drawer')
      .should('have.class', 'drawer-hidden');

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

  it('opens the capsule description on hover', () => {
    cy.get(':nth-child(1) > .results-card > .hover-description')
      .trigger('mouseover');

    cy.get(':nth-child(1) > .results-card > .hover-description > div > p')
      .contains('View position');
  });

  it('matches filter snapshots', () => {
    cy.get('.filter-container')
      .matchImageSnapshot('filter-container');

    [
      ['#checkbox-Skill', true],
      ['#checkbox-Grade'],
      ['#checkbox-Bureau', true],
      ['#checkbox-Post', '> div > div > ul > :nth-child(1) > button'],
      ['#checkbox-Tour-of-Duty'],
      ['#checkbox-Language'],
      ['#checkbox-Post-Differential'],
      ['#checkbox-Danger-Pay'],
    ].forEach((sel) => {
      cy.get(`${sel[0]}-button`)
        .click();

      if (sel[1]) {
        const q = !isString(sel[1]) ? `${sel[0]} > div > ul > :nth-child(1) > button` : `${sel[0]} ${sel[1]}`;
        cy.get(q)
          .click();
      }

      cy.get(sel[0])
        .matchImageSnapshot(sel[0]);
    });
  });
});
