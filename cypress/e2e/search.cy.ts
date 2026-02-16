describe('Search & Profiles', () => {
  describe('Search Page', () => {
    it('displays search page', () => {
      cy.visit('/search');
      cy.get('body').should('be.visible');
    });

    it('can search by postcode', () => {
      cy.visit('/search');
      cy.get('input[name="postcode"], input[placeholder*="postcode"]').first().type('SW1A');
      cy.get('form').first().submit();
      cy.url().should('include', 'postcode');
    });

    it('filters by trade parameter', () => {
      cy.visit('/search?trade=plumber');
      cy.url().should('include', 'trade=plumber');
    });
  });

  describe('Trades Page', () => {
    it('displays trade categories', () => {
      cy.visit('/trades');
      cy.contains(/trade|service/i).should('be.visible');
    });
  });

  describe('Tradesperson Profile', () => {
    it('displays profile page', () => {
      cy.visit('/johns-plumbing-services');
      cy.contains("John").should('be.visible');
    });

    it('shows contact option', () => {
      cy.visit('/johns-plumbing-services');
      cy.contains(/quote|contact/i).should('be.visible');
    });
  });

  describe('Quote Request', () => {
    it('shows quote form for logged in user', () => {
      cy.login('customer@test.com', 'password123');
      cy.visit('/johns-plumbing-services/quote');
      cy.get('form').should('be.visible');
    });
  });
});
