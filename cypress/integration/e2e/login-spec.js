describe('Login Page', function () {
  beforeEach(function () {
    cy.visit('/login')
  })

  it('should contain correct text', function () {
    cy.contains('sign in')
  })

  it('should show alert when login using wrong credentials', function () {
    cy.get('input#username').type('test@example.com')
    cy.get('input#password').type('invalid')
    cy.get('button[type="submit"]').click()

    cy.contains('does not match')
  })

  it('should redirect to home page when login using correct credentials', function () {
    cy.get('input#username').type('test@example.com')
    cy.get('input#password').type('test1234')
    cy.get('button[type="submit"]').click()

    cy.location('pathname').should('equal', '/')
  })
})
