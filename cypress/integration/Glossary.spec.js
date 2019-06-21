import { doLogin } from '../utilities';

describe('Glossary', () => {
  beforeEach(() => {
    doLogin();
  });

  afterEach(() => {
    cy.visit('/logout');
  });

  it('opens and closes the glossary', () => {
    const shouldBeClosed = () => {
      cy.get('#glossary')
        .should('not.have.class', 'glossary-visible')
        .should('have.class', 'glossary-hidden');
    };

    const shouldBeOpen = () => {
      cy.get('#glossary')
        .should('have.class', 'glossary-visible')
        .should('not.have.class', 'glossary-hidden');
    };

    shouldBeClosed();

    cy.get('#glossary-open-icon > span').click();

    shouldBeOpen();

    cy.get('.glossary-close').click();

    shouldBeClosed();
  });
});
