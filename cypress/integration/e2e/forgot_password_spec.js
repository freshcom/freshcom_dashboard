describe('Forgot Password Page', function () {
  beforeEach(function () {
    cy.visit('/forgot-password')
  })

  it('should show alert when no input is provided', function () {
    cy.get('button[type="submit"]').click()
    cy.get('.el-form-item__error').should('be.visible')
  })

  it('should show success when email is provided', function () {
    cy.get('input').type('forgot-password@example.com')
    cy.get('button[type="submit"]').click()
    cy.get('.el-alert--success').should('be.visible')
  })
})
