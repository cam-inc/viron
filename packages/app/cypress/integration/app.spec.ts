describe('Home Page', () => {
  it('successfully loads', () => {
    cy.visit('/');
    cy.contains('Dashboard').click();
    cy.url().should('include', '/dashboard');
  });
});
