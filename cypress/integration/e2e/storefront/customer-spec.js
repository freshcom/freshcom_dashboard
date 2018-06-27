describe('Customer Related Page', function () {
  before(function () {
    cy.visit('/login')
    cy.get('input#username').type('test@example.com')
    cy.get('input#password').type('test1234')
    cy.get('button[type="submit"]').click()

    cy.get('#nav-storefront').click()
    cy.get('#nav-customers').click()
  })

  it('should in the correct path and list the sample data', function () {
    cy.location('pathname').should('equal', '/customers')
    cy.get('a.primary').should('have.length', 3)
  })

  it('should only show resource matching the search keyword if provided', function () {
    cy.get('.search-input input').type('roy')
    cy.get('a.primary').should('have.length', 1)
  })

  it('should go to new page when click on new', function () {
    cy.get('a[href="/customers/new"]:first').click()

    cy.location('pathname').should('equal', '/customers/new')
  })
})
