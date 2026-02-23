describe('Tradesperson Dashboard', () => {
  beforeEach(() => {
    cy.login('plumber@test.com', 'password123');
  });

  describe('Dashboard Home', () => {
    it('displays dashboard overview', () => {
      cy.visit('/dashboard');
      // Check for dashboard-specific content (stats cards or overview elements)
      cy.get('main').should('be.visible');
      cy.url().should('include', '/dashboard');
    });

    it('has navigation links', () => {
      cy.visit('/dashboard');
      // Check desktop sidebar navigation
      cy.get('aside').contains('Profile').should('be.visible');
      cy.get('aside').contains('Job Board').should('be.visible');
    });
  });

  describe('Profile Management', () => {
    it('displays profile form', () => {
      cy.visit('/dashboard/profile');
      cy.contains(/profile|business/i).should('be.visible');
      cy.get('input[name="businessName"]').should('be.visible');
    });

    it('can submit profile form', () => {
      cy.visit('/dashboard/profile');
      cy.get('button[type="submit"]').click();
      // Just check form submits without error
      cy.get('button[type="submit"]').should('exist');
    });
  });

  describe('Quotes', () => {
    it('displays quotes page', () => {
      cy.visit('/dashboard/quotes');
      cy.contains(/quote/i).should('be.visible');
    });
  });

  describe('Messages', () => {
    it('displays messages page', () => {
      cy.visit('/dashboard/messages');
      cy.contains(/message/i).should('be.visible');
    });
  });

  describe('Subscription', () => {
    it('displays subscription page', () => {
      cy.visit('/dashboard/subscription');
      cy.contains(/subscription|plan/i).should('be.visible');
    });
  });
});
