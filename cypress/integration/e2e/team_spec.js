describe('Team Related Pages', function () {
  before(function () {
    cy.visit('/signin')
    cy.get('input#username').type('test@example.com')
    cy.get('input#password').type('test1234')
    cy.get('button[type="submit"]').click()

    cy.get('#nav-team').click()
  })

  it('should in the correct path and list the sample data', function () {
    cy.location('pathname').should('equal', '/users')
    cy.get('tbody tr').should('have.length', 2)
  })

  it('should only show resource matching the search keyword if provided', function () {
    cy.get('.search-input input').type('managed')
    cy.get('tbody tr').should('have.length', 1)
  })

  it('should go to new page when click on new', function () {
    cy.get('a[href="/users/new"]:first').click()

    cy.location('pathname').should('equal', '/users/new')
  })

  it('should render errors when creating with invalid input', function () {
    cy.get('button.el-button--primary:first').click()
    cy.get('.el-form-item__error').should('be.visible')
  })

  it('should create successful when input is valid', function () {
    cy.get('input[name="username"]').type("testuser2")
    cy.get('input[name="name"]').type("Test User 2")
    cy.get('input[name="password"]').type("test1234")

    cy.get('#role input').click()
    cy.get('.el-select-dropdown__list:visible li:first').click()
    cy.get('button.el-button--primary:first').click()
    cy.location('pathname').should('equal', '/users')
    cy.contains('Test User 2')
  })

  it('should go to user detail page when clicked', function () {
    cy.get('a.primary:first').click()
    cy.location('pathname').should('contain', '/users/')

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
    cy.get('input[name="name"]').type('Test User V2')
    cy.get('button.el-button--primary:first').click()

    cy.location('pathname').should('contain', '/users/')
    cy.contains('Test User V2')
  })

  it('should prompt user to confirm when user click on delete', function () {
    cy.get('.foot button:first').click()

    cy.get('.delete-user').should('be.visible')
    cy.contains('Delete user')
    cy.contains('Are you sure')
  })

  it('should cancel the delete when user click cancel', function () {
    cy.get('.delete-user button.el-button--default').click()

    cy.get('.delete-user').should('be.hidden')
  })

  it('should delete the user when confirmed', function () {
    cy.get('.foot button:first').click()
    cy.get('.delete-user button.el-button--danger').click()

    cy.location('pathname').should('equal', '/users')
  })
})
