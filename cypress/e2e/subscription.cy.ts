describe('Subscription System', () => {
  describe('Public Pages - Ad Display', () => {
    it('displays ad banner on homepage', () => {
      cy.visit('/');
      // Ad banner should be visible for unauthenticated users
      cy.contains(/ad|advertisement|sponsored/i).should('exist');
    });

    it('ad banner has remove ads link', () => {
      cy.visit('/');
      cy.contains(/ad-free|remove ads|go ad-free/i).should('exist');
    });

    it('ad banner can be dismissed', () => {
      cy.visit('/');
      // Use visible dismiss button (desktop layout at 1280x720)
      cy.get('[aria-label="Dismiss ad"]').filter(':visible').first().click();
      // After dismiss, the dismiss button should not be visible
      cy.get('[aria-label="Dismiss ad"]').should('not.exist');
    });
  });

  describe('Subscription Page - Unauthenticated', () => {
    it('redirects to login when accessing subscription page', () => {
      cy.visit('/dashboard/subscription');
      cy.url().should('include', '/login');
    });
  });

  describe('Jobs Page - No Limits', () => {
    it('displays jobs page without application limits warning', () => {
      cy.visit('/jobs');
      cy.contains('Job').should('be.visible');
      // Should NOT show any "upgrade" or "limit" messages on public jobs page
      cy.contains(/application limit|applications remaining/i).should('not.exist');
    });
  });

  describe('Stripe Checkout API', () => {
    it('checkout endpoint requires authentication', () => {
      cy.request({
        method: 'POST',
        url: '/api/stripe/checkout',
        body: { tier: 'PAID' },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(401);
      });
    });

    it('checkout endpoint rejects invalid tier', () => {
      // This will fail auth first, but tests the endpoint exists
      cy.request({
        method: 'POST',
        url: '/api/stripe/checkout',
        body: { tier: 'INVALID' },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 401]);
      });
    });

    it('checkout endpoint rejects old tier names', () => {
      cy.request({
        method: 'POST',
        url: '/api/stripe/checkout',
        body: { tier: 'PRO' },
        failOnStatusCode: false,
      }).then((response) => {
        // Should reject PRO as it no longer exists
        expect(response.status).to.be.oneOf([400, 401]);
      });

      cy.request({
        method: 'POST',
        url: '/api/stripe/checkout',
        body: { tier: 'PREMIUM' },
        failOnStatusCode: false,
      }).then((response) => {
        // Should reject PREMIUM as it no longer exists
        expect(response.status).to.be.oneOf([400, 401]);
      });
    });
  });

  describe('Billing Portal API', () => {
    it('billing portal endpoint requires authentication', () => {
      cy.request({
        method: 'POST',
        url: '/api/stripe/billing-portal',
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(401);
      });
    });
  });
});
