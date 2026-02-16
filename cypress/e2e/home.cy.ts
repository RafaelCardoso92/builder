describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('displays the header with logo and navigation', () => {
    cy.get('header').should('be.visible');
    cy.contains('Builder').should('be.visible');
    cy.contains('Find a Trade').should('be.visible');
    cy.contains('Job Board').should('be.visible');
  });

  it('displays the hero section', () => {
    cy.contains('Find Trusted').should('be.visible');
  });

  it('has a search form', () => {
    cy.get('input[name="postcode"]').should('be.visible');
    cy.get('input[name="trade"]').should('be.visible');
  });

  it('navigates to search when submitting the form', () => {
    cy.get('input[name="postcode"]').type('SW1A 1AA');
    cy.get('form').first().submit();
    cy.url().should('include', '/search');
  });

  it('displays the footer', () => {
    cy.get('footer').should('be.visible');
  });

  it('has working Job Board link', () => {
    cy.contains('Job Board').click();
    cy.url().should('include', '/jobs');
  });
});
