describe('Use Case: Add product in cart', () => {
  it('should add new article in cart', () => {
    const {
      thenIncludingTaxTotalIs,
      thenOnlyTaxTotalIs,
      thenProductsInCartAre,
    } = setup();

    thenProductsInCartAre([
      {
        name: 'Apple - Fuji',
        quantity: 2,
        tax: 0,
        excludingTaxPrice: 4.37,
        includingTaxPrice: 4.37,
      },
      {
        name: 'The Stranger in the Lifeboat',
        quantity: 1,
        tax: 1.65,
        excludingTaxPrice: 16.38,
        includingTaxPrice: 18.03,
      },
    ]);
    thenOnlyTaxTotalIs(1.65);
    thenIncludingTaxTotalIs(26.77);
  });
});

const setup = () => {
  const cart = new Cart([
    new CartProduct('Apple - Fuji', 2, 4.37, 'essential'),
    new CartProduct('The Stranger in the Lifeboat', 1, 16.38, 'book'),
  ]);

  const thenIncludingTaxTotalIs = (expectedTotal: number) => {
    expect(cart.includingTaxTotal).toBe(expectedTotal);
  };

  const thenOnlyTaxTotalIs = (expectedTotal: number) => {
    expect(cart.onlyTaxTotal).toBe(expectedTotal);
  };

  const thenProductsInCartAre = (
    expectedProducts: Array<PrintedCartProduct>
  ) => {
    expect(cart.printProducts()).toEqual(expectedProducts);
  };

  return { thenIncludingTaxTotalIs, thenOnlyTaxTotalIs, thenProductsInCartAre };
};

class Cart {
  readonly onlyTaxTotal = this.products.reduce(toOnlyTaxTotal, 0);
  readonly includingTaxTotal = this.products.reduce(toIncTaxTotal, 0);

  constructor(readonly products: Array<CartProduct>) {}

  printProducts() {
    return this.products.map(toPrinted);
  }
}

const toPrinted = (cartProduct: CartProduct) => cartProduct.print();

const toOnlyTaxTotal = (oldTotal: number, { tax, quantity }: CartProduct) => {
  const onlyTaxForOne = tax * quantity;
  return add(onlyTaxForOne, oldTotal);
};

const toIncTaxTotal = (
  oldTotal: number,
  { includingTaxPrice, quantity }: CartProduct
) => {
  const includingTaxPriceForOne = includingTaxPrice * quantity;
  return add(includingTaxPriceForOne, oldTotal);
};
class CartProduct {
  private readonly taxPercent = this.type === 'book' ? 0.1 : 0;
  readonly tax = calculateTax(this.excludingTaxPrice, this.taxPercent);
  readonly includingTaxPrice = add(this.tax, this.excludingTaxPrice);

  constructor(
    readonly name: string,
    readonly quantity: number,
    readonly excludingTaxPrice: number,
    private readonly type: 'essential' | 'book'
  ) {}

  print() {
    return Object.freeze({
      name: this.name,
      quantity: this.quantity,
      tax: this.tax,
      excludingTaxPrice: this.excludingTaxPrice,
      includingTaxPrice: this.includingTaxPrice,
    });
  }
}

type PrintedCartProduct = ReturnType<CartProduct['print']>;

const calculateTax = (excludingTaxPrice: number, taxPercent: number) => {
  const multiplied = excludingTaxPrice * taxPercent;
  return Math.round(multiplied * ROUND_COEFF) / ROUND_COEFF;
};

const ROUND_COEFF = 20;

const add = (n1: number, n2: number) => {
  const n = n1 + n2;
  return Number(n.toFixed(2)); // fix javascript decimal addition (0.1 + 0.2 !== 0.299999999)
};
