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
});
