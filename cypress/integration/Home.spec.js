import { api, doLogin } from '../utilities';

describe('Search', () => {
  beforeEach(() => {
    doLogin();
  });

  afterEach(() => {
    cy.visit('/logout');
  });

  it('navigates to results', () => {
    cy.route('GET', `${api}/position/*`)
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

  it('matches footer snapshot', () => {
    cy.get('.usa-footer-primary-section')
      .matchImageSnapshot('footer-top');

    cy.get('.usa-footer-secondary_section')
      .matchImageSnapshot('footer-bottom');
  });
});
