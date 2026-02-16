describe('Customer Account', () => {
  beforeEach(() => {
    cy.login('customer@test.com', 'password123');
  });

  describe('My Jobs', () => {
    it('displays posted jobs page', () => {
      cy.visit('/account/jobs');
      cy.contains(/my jobs|jobs/i).should('be.visible');
    });
  });

  describe('My Quotes', () => {
    it('displays quotes page', () => {
      cy.visit('/account/quotes');
      cy.contains(/quote/i).should('be.visible');
    });
  });

  describe('Messages', () => {
    it('displays messages page', () => {
      cy.visit('/account/messages');
      cy.contains(/message/i).should('be.visible');
    });
  });
});

describe('Admin Dashboard', () => {
  beforeEach(() => {
    cy.login('admin@builder.co.uk', 'admin123');
  });

  describe('Admin Home', () => {
    it('displays admin dashboard', () => {
      cy.visit('/admin');
      cy.contains(/admin|dashboard/i).should('be.visible');
    });

    it('has admin navigation', () => {
      cy.visit('/admin');
      cy.contains('Verifications').should('be.visible');
    });
  });

  describe('Verifications', () => {
    it('displays verifications page', () => {
      cy.visit('/admin/verifications');
      cy.contains(/verification/i).should('be.visible');
    });
  });

  describe('Reviews Moderation', () => {
    it('displays reviews page', () => {
      cy.visit('/admin/reviews');
      cy.contains(/review/i).should('be.visible');
    });
  });

  describe('Reports', () => {
    it('displays reports page', () => {
      cy.visit('/admin/reports');
      cy.contains(/report/i).should('be.visible');
    });
  });
});
