describe('Stockable Page', function () {
  before(function () {
    cy.visit('/login')
    cy.get('input#username').type('test@example.com')
    cy.get('input#password').type('test1234')
    cy.get('button[type="submit"]').click()

    cy.get('#nav-goods').click()
    cy.get('#nav-stockables').click()
  })

  it('should in the correct path and list the sample data', function () {
    cy.location('pathname').should('equal', '/stockables')
    cy.get('a.primary').should('have.length', 6)
  })

  it('should only show resource matching the search keyword if provided', function () {
    cy.get('.search-input input').type('shirt')
    cy.get('a.primary').should('have.length', 3)
  })

  it('should go to new page when click on new', function () {
    cy.get('a[href="/stockables/new"]:first').click()

    cy.location('pathname').should('equal', '/stockables/new')
  })

  it('should render errors when creating with invalid input', function () {
    cy.get('button.el-button--primary:first').click()
    cy.get('.el-form-item__error').should('be.visible')
  })

  it('should create successful when input is valid', function () {
    cy.get('input[name="name"]').type('Warp Drive Core')
    cy.get('input[name="unit-of-measure"]').type('EA')
    cy.get('button.el-button--primary:first').click()

    cy.location('pathname').should('equal', '/stockables')
    cy.contains('Warp Drive Core')
  })

  it('should go to stockable detail page when clicked', function () {
    cy.get('a.primary:first').click()
    cy.location('pathname').should('contain', '/stockables/')

    cy.contains('Edit')
    cy.contains('Delete')
  })

  it('should go to the edit page when clicked', function () {
    cy.get('.brief-action-group a').click()

    cy.location('pathname').should('contain', 'edit')
  })

  it('should render errors when updating with invalid input', function () {
    cy.get('input[name="name"]').clear()
    cy.get('input[name="unit-of-measure"]').clear()
    cy.get('button.el-button--primary:first').click()

    cy.get('.el-form-item__error').should('be.visible')
  })

  it('should update successful when input is valid', function () {
    cy.get('input[name="name"]').type('Warp Drive Core V2')
    cy.get('input[name="unit-of-measure"]').type('BOX')
    cy.get('button.el-button--primary:first').click()

    cy.location('pathname').should('contain', '/stockables/')
    cy.contains('Warp Drive Core V2')
  })

  it('should prompt user to confirm when user click on delete', function () {
    cy.get('.foot button:first').click()

    cy.get('.delete-stockable').should('be.visible')
    cy.contains('Delete stockable')
    cy.contains('Are you sure')
  })

  it('should cancel the delete when user click cancel', function () {
    cy.get('.delete-stockable button.el-button--default').click()

    cy.get('.delete-stockable').should('be.hidden')
  })

  it('should delete the stockable when confirmed', function () {
    cy.get('.foot button:first').click()
    cy.get('.delete-stockable button.el-button--danger').click()

    cy.location('pathname').should('equal', '/stockables')
  })
})
