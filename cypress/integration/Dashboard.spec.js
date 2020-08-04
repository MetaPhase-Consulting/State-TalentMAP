import { doLogin } from '../utilities';

describe('Dashboard', () => {
  beforeEach(() => {
    doLogin();
  });

  afterEach(() => {
    cy.visit('/logout');
  });

  it('navigates to dashboard', () => {
    cy.visit('/profile/dashboard');

    cy.wait('@getProfile');

    cy.wait(4000);

    cy.get('.name-group > .dashboard-section-title > h2')
      .should('have.text', 'TalentMAP, Administrator');
  });
});
