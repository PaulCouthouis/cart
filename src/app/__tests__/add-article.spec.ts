describe('Use Case: Add product in cart', () => {
  it('should add new article in cart', () => {
    thenIncludingTaxTotalIs(100);
  });
});

const thenIncludingTaxTotalIs = (expectedTotal: number) => {
  const cart = new Cart(100);
  expect(cart.getIncludingTaxTotal()).toBe(expectedTotal);
};

class Cart {
  constructor(private includingTaxTotal: number) {}

  getIncludingTaxTotal() {
    return this.includingTaxTotal;
  }
}
