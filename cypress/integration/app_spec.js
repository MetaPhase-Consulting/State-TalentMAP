describe("App", () => {
  it("open app", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Login");
  });
});
