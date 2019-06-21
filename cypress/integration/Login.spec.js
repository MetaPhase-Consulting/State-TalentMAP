import { doLogin } from '../utilities';

describe('Login', () => {
  beforeEach(() => {
    doLogin();
  });

  afterEach(() => {
    cy.visit('/logout');
  });

  it('chooses a persona', () => {
    cy.get('#account-username')
      .should('have.text', 'Administrator');
  });
});
