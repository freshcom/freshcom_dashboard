describe('Register Page', function () {
  beforeEach(function () {
    cy.visit('/register')
  })

  it('should render errors when sign up with invalid input', function () {
    cy.get('button.el-button--primary:first').click()
    cy.get('.el-form-item__error').should('be.visible')
    cy.contains('is required')
  })

  it('should render errors when password and confirm password does not match', function () {
    cy.get('input#email').type('test1@example.com')
    cy.get('input#name').type('Test1 User')
    cy.get('input#password').type('test1234')

    cy.get('button.el-button--primary:first').click()
    cy.get('.el-form-item__error').should('be.visible')
    cy.contains('does not match')
  })

  it('should redirect to home page when all input is valid', function () {
    cy.get('input#email').type('test1@example.com')
    cy.get('input#name').type('Test1 User')
    cy.get('input#password').type('test1234')
    cy.get('input#confirm-password').type('test1234')

    cy.get('button.el-button--primary:first').click()
    cy.location('pathname').should('equal', '/')
    cy.contains('successful')
  })
})
