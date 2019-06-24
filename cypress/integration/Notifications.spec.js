import { doLogin } from '../utilities';

describe('Notifications', () => {
  beforeEach(() => {
    doLogin();
  });

  afterEach(() => {
    cy.visit('/logout');
  });

  it('navigates notifications by clicking on the icon', () => {
    cy.get('a > .fa')
      .click();

    cy.get('.favorites-title-container > .usa-grid-full')
      .contains('Notifications');
  });
});
