describe('Use Case: Add product in cart', () => {
  it('should add new article in cart', () => {
    const { thenIncludingTaxTotalIs, thenOnlyTaxTotalIs } = setup();

    thenOnlyTaxTotalIs(10);
    thenIncludingTaxTotalIs(100);
  });
});

const setup = () => {
  const cart = new Cart(100, 10);

  const thenIncludingTaxTotalIs = (expectedTotal: number) => {
    expect(cart.getIncludingTaxTotal()).toBe(expectedTotal);
  };

  const thenOnlyTaxTotalIs = (expectedTotal: number) => {
    expect(cart.getOnlyTaxTotal()).toBe(expectedTotal);
  };

  return { thenIncludingTaxTotalIs, thenOnlyTaxTotalIs };
};

class Cart {
  constructor(
    private readonly includingTaxTotal: number,
    private readonly onlyTaxTotal: number
  ) {}

  getIncludingTaxTotal() {
    return this.includingTaxTotal;
  }

  getOnlyTaxTotal() {
    return this.onlyTaxTotal;
  }
}

