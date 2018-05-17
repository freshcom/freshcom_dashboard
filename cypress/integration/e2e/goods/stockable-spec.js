describe('Stockable Page', function () {
  before(function () {
    cy.visit('/login')
    cy.get('input#username').type('test@example.com')
    cy.get('input#password').type('test1234')
    cy.get('button[type="submit"]').click()

    cy.get('#nav-goods').click()
    cy.get('#nav-stockables').click()
  })

  it('should in the correct path', function () {
    cy.location('pathname').should('equal', '/stockables')
  })

  it('should go to new page when click on new', function () {
    cy.get('a[href="/stockables/new"]:first').click()
    cy.location('pathname').should('equal', '/stockables/new')
  })

  it('should render errors when from contains errors', function () {
    cy.get('button.el-button--primary:first').click()
    cy.get('.el-form-item__error').should('be.visible')
  })
})
