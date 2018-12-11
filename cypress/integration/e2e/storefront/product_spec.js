describe('Product Related Pages', function () {
  before(function () {
    cy.visit('/signin')
    cy.get('input#username').type('test@example.com')
    cy.get('input#password').type('test1234')
    cy.get('button[type="submit"]').click()

    cy.get('#nav-storefront').click()
    cy.get('#nav-products').click()
  })

  it('should in the correct path and list the sample data', function () {
    cy.location('pathname').should('equal', '/products')
    cy.get('a.primary').should('have.length', 6)
  })

  it('should only show resource matching the search keyword if provided', function () {
    cy.get('.search-input input').type('card')
    cy.get('a.primary').should('have.length', 2)
  })

  it('should go to new page when click on new', function () {
    cy.get('a[href="/products/new"]:first').click()

    cy.location('pathname').should('equal', '/products/new')
  })

  it('should render errors when creating with invalid input', function () {
    cy.get('button.el-button--primary:first').click()
    cy.get('.el-form-item__error').should('be.visible')
  })

  it('should create successful when input is valid', function () {
    cy.get('.goods-select input').type('ga')
    cy.get('.el-select-dropdown__list:visible').should('have.length', 1)
    cy.get('.el-select-dropdown__list:visible li:first').click()
    cy.get('.el-radio-group label:first').click()
    cy.get('input[name="name"]').type("A Game for test")

    cy.get('button.el-button--primary:first').click()
    cy.location('pathname').should('equal', '/products')
    cy.contains('A Game for test')
  })

  it('should go to product detail page when clicked', function () {
    cy.get('a.primary:first').click()
    cy.location('pathname').should('contain', '/products/')

    cy.contains('Edit')
    cy.contains('Delete')
  })

  it('should go to the edit page when clicked', function () {
    cy.get('.brief-action-group a').click()

    cy.location('pathname').should('contain', 'edit')
  })

  it('should render errors when updating with invalid input', function () {
    cy.get('input[name="name"]').clear()
    cy.get('button.el-button--primary:first').click()

    cy.get('.el-form-item__error').should('be.visible')
  })

  it('should update successful when input is valid', function () {
    cy.get('input[name="name"]').type('A Game for test V2')
    cy.get('button.el-button--primary:first').click()

    cy.location('pathname').should('contain', '/products/')
    cy.contains('A Game for test V2')
  })

  it('should prompt user to confirm when user click on delete', function () {
    cy.get('.foot button:first').click()

    cy.get('.delete-product').should('be.visible')
    cy.contains('Delete product')
    cy.contains('Are you sure')
  })

  it('should cancel the delete when user click cancel', function () {
    cy.get('.delete-product button.el-button--default').click()

    cy.get('.delete-product').should('be.hidden')
  })

  it('should delete the product when confirmed', function () {
    cy.get('.foot button:first').click()
    cy.get('.delete-product button.el-button--danger').click()

    cy.location('pathname').should('equal', '/products')
  })
})
