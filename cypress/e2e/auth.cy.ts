describe('Authentication', () => {
  describe('Login Page', () => {
    beforeEach(() => {
      cy.visit('/login');
    });

    it('displays the login form', () => {
      cy.contains('Welcome back').should('be.visible');
      cy.get('#email').should('be.visible');
      cy.get('#password').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');
    });

    it('shows error for invalid credentials', () => {
      cy.get('#email').type('wrong@email.com');
      cy.get('#password').type('wrongpassword');
      cy.get('button[type="submit"]').click();
      // Wait for error message to appear
      cy.get('.bg-red-50, [class*="error"]', { timeout: 15000 }).should('be.visible');
    });

    it('logs in customer successfully', () => {
      cy.get('#email').type('customer@test.com');
      cy.get('#password').type('password123');
      cy.get('button[type="submit"]').click();
      cy.url().should('not.include', '/login');
    });

    it('logs in tradesperson and redirects to dashboard', () => {
      cy.get('#email').type('plumber@test.com');
      cy.get('#password').type('password123');
      cy.get('button[type="submit"]').click();
      cy.url().should('not.include', '/login');
    });

    it('has link to registration', () => {
      cy.contains('Create one').should('be.visible');
    });
  });

  describe('Registration Page', () => {
    beforeEach(() => {
      cy.visit('/register/tradesperson');
    });

    it('displays the registration form', () => {
      cy.contains('Join as a Tradesperson').should('be.visible');
      cy.get('input[name="name"]').should('be.visible');
      cy.get('input[name="email"]').should('be.visible');
      cy.get('input[name="password"]').should('be.visible');
    });

    it('can fill step 1 and proceed', () => {
      cy.get('input[name="name"]').type('Test User');
      cy.get('input[name="email"]').type('newuser123@test.com');
      cy.get('input[name="password"]').type('testpassword123');
      cy.get('input[name="confirmPassword"]').type('testpassword123');
      cy.contains('Continue').click();
      // Should now be on step 2
      cy.contains('Business Details').should('be.visible');
    });
  });

  describe('Authenticated Header', () => {
    it('shows user name when logged in as customer', () => {
      cy.login('customer@test.com', 'password123');
      cy.visit('/');
      cy.contains('Test Customer').should('be.visible');
    });

    it('shows user name when logged in as tradesperson', () => {
      cy.login('plumber@test.com', 'password123');
      cy.visit('/');
      cy.contains('John').should('be.visible');
    });
  });
});
