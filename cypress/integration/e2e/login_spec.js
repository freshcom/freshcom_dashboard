describe('Signin Page', function () {
  beforeEach(function () {
    cy.visit('/signin')
  })

  it('should contain correct text', function () {
    cy.contains('sign in')
  })

  it('should show alert when signin using wrong credentials', function () {
    cy.get('input#username').type('test@example.com')
    cy.get('input#password').type('invalid')
    cy.get('button[type="submit"]').click()

    cy.contains('does not match')
  })

  it('should redirect to home page when signin using correct credentials', function () {
    cy.get('input#username').type('test@example.com')
    cy.get('input#password').type('test1234')
    cy.get('button[type="submit"]').click()

    cy.location('pathname').should('equal', '/')
  })
})
