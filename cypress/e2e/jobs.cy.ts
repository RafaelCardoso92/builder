describe('Job Board', () => {
  describe('Public Job Listing', () => {
    beforeEach(() => {
      cy.visit('/jobs');
    });

    it('displays the job listing page', () => {
      cy.contains('Job Board').should('be.visible');
    });

    it('has search filters', () => {
      cy.get('input[name="trade"]').should('be.visible');
      cy.get('input[name="postcode"]').should('be.visible');
    });

    it('displays jobs or empty state', () => {
      cy.get('body').then($body => {
        if ($body.find('[data-testid="job-card"]').length > 0) {
          cy.get('[data-testid="job-card"]').should('exist');
        } else {
          cy.contains(/no jobs|check back later/i).should('be.visible');
        }
      });
    });

    it('can search by trade', () => {
      cy.get('input[name="trade"]').type('plumber');
      cy.get('button[type="submit"]').click();
      cy.url().should('include', 'trade=plumber');
    });
  });

  describe('Post a Job (Customer)', () => {
    beforeEach(() => {
      cy.login('customer@test.com', 'password123');
      cy.visit('/jobs/post');
    });

    it('displays the job posting form', () => {
      cy.contains('Post a Job').should('be.visible');
    });

    it('has form elements', () => {
      cy.get('form').should('be.visible');
      cy.get('select').should('exist'); // Trade selection
      cy.get('textarea').should('exist'); // Description
    });
  });

  describe('Customer Job Management', () => {
    beforeEach(() => {
      cy.login('customer@test.com', 'password123');
    });

    it('can view posted jobs', () => {
      cy.visit('/account/jobs');
      cy.contains(/my jobs|posted/i).should('be.visible');
    });
  });

  describe('Tradesperson Job Access', () => {
    beforeEach(() => {
      cy.login('plumber@test.com', 'password123');
    });

    it('can view available jobs in dashboard', () => {
      cy.visit('/dashboard/jobs');
      cy.contains(/job/i).should('be.visible');
    });

    it('can view own applications', () => {
      cy.visit('/dashboard/applications');
      cy.contains(/application/i).should('be.visible');
    });
  });
});
