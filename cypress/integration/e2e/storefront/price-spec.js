describe('Price Page', function () {
  before(function () {
    cy.visit('/login')
    cy.get('input#username').type('test@example.com')
    cy.get('input#password').type('test1234')
    cy.get('button[type="submit"]').click()

    cy.get('#nav-storefront').click()
    cy.get('#nav-products').click()
    cy.get('a.primary:first').click()
  })

  it('should go to new page when click on new', function () {
    cy.get('.add-price').click()

    cy.location('pathname').should('equal', '/prices/new')
  })

  it('should render errors when creating with invalid input', function () {
    cy.get('button.el-button--primary:first').click()

    cy.get('.el-form-item__error').should('be.visible')
  })

  it('should create successful when input is valid', function () {
    cy.get('input[name="name"]').type('Test price')
    cy.get('.charge-amount-input input').type('1299')
    cy.get('input[name="charge-unit"]').type('EA')
    cy.get('input[name="minimum-order-quantity"]').clear().type('999')
    cy.get('button.el-button--primary:first').click()

    cy.location('pathname').should('contain', '/products/')
    cy.get('.prices a.primary').should('have.length', 2)
    cy.contains('Test price')
  })

  it('should go to price edit page when clicked', function () {
    cy.get('.prices a.edit-price:last').click()
    cy.location('pathname').should('contain', '/prices/')
  })

  it('should render errors when updating with invalid input', function () {
    cy.get('input[name="name"]').clear()
    cy.get('button.el-button--primary:first').click()

    cy.get('.el-form-item__error').should('be.visible')
  })

  it('should update successful when input is valid', function () {
    cy.get('input[name="name"]').type('Test price V2')
    cy.get('button.el-button--primary:first').click()

    cy.location('pathname').should('contain', '/products/')
    cy.contains('Test price V2')
  })

  it('should go to price detail page when clicked', function () {
    cy.get('.prices a.primary:first').click()
    cy.location('pathname').should('contain', '/prices/')

    cy.contains('Edit')
    cy.contains('Delete')
  })

  it('should go back to product page when back is clicked', function () {
    cy.go('back')
    cy.location('pathname').should('contain', '/products/')
  })

  it('should prompt user to confirm when user click on delete', function () {
    cy.get('.prices button.delete-price:last').click()

    cy.get('.launchable .delete-price').should('be.visible')
    cy.contains('Delete price')
    cy.contains('Are you sure')
  })

  it('should cancel the delete when user click cancel', function () {
    cy.get('.launchable .delete-price button.el-button--default').click()

    cy.get('.launchable .delete-price').should('be.hidden')
  })

  it('should delete the product when confirmed', function () {
    cy.get('.prices button.delete-price:last').click()
    cy.get('.launchable .delete-price button.el-button--danger').click()

    cy.get('.launchable .delete-price').should('be.hidden')
    cy.get('.prices a.primary').should('have.length', 1)
  })
})
