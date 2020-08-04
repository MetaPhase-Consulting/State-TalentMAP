import { api, doLogin } from '../utilities';

describe('Position', () => {
  beforeEach(() => {
    doLogin();

    cy.visit('/details/33746');

    cy.route('GET', `${api}/fsbid/available_positions/*`).as('getPosition');

    cy.wait('@getPosition');
  });

  afterEach(() => {
    cy.visit('/logout');
  });

  it('navigates to position details', () => {
    cy.get('.position-details-header-title > h1')
      .should('exist');
  });

  it('displays a post differential data as a percent', () => {
    cy.get(':nth-child(7) > .condensed-card-data-title')
      .should('have.text', 'Post differential | Danger Pay: ');
    cy.get(':nth-child(7) > .condensed-card-data-content')
      .contains('%');
  });

  it('matches snapshot of position data points', () => {
    cy.wait(2000);

    cy.get('.position-details-description-container > .usa-width-two-thirds')
      .matchImageSnapshot();
  });
});
