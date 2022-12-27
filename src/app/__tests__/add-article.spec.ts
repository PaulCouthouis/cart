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
        tax: 3,
        excludingTaxPrice: 15,
        includingTaxPrice: 18,
      },
      {
        name: 'Muffin Batt - Carrot Spice',
        quantity: 1,
        tax: 1,
        excludingTaxPrice: 4,
        includingTaxPrice: 5,
      },
    ]);
    thenOnlyTaxTotalIs(7);
    thenIncludingTaxTotalIs(41);
  });
});

const setup = () => {
  const cart = new Cart([
    new CartProduct({
      name: 'Apple - Fuji',
      quantity: 2,
      tax: 3,
      excludingTaxPrice: 15,
    }),
    new CartProduct({
      name: 'Muffin Batt - Carrot Spice',
      quantity: 1,
      tax: 1,
      excludingTaxPrice: 4,
    }),
  ]);

  const thenIncludingTaxTotalIs = (expectedTotal: number) => {
    expect(cart.includingTaxTotal).toBe(expectedTotal);
  };

  const thenOnlyTaxTotalIs = (expectedTotal: number) => {
    expect(cart.onlyTaxTotal).toBe(expectedTotal);
  };

  const thenProductsInCartAre = (
    expectedProducts: Array<CartProduct['values']>
  ) => {
    expect(cart.products).toEqual(expectedProducts);
  };

  return { thenIncludingTaxTotalIs, thenOnlyTaxTotalIs, thenProductsInCartAre };
};

class Cart {
  readonly products = this.params.map(toValues);
  readonly onlyTaxTotal = this.products.reduce(toOnlyTaxTotal, 0);
  readonly includingTaxTotal = this.products.reduce(toIncTaxTotal, 0);

  constructor(private readonly params: Array<CartProduct>) {}
}

const toOnlyTaxTotal = (
  oldTotal: number,
  { tax, quantity }: CartProduct['values']
) => {
  const onlyTaxForOne = tax * quantity;
  return oldTotal + onlyTaxForOne;
};

const toIncTaxTotal = (
  oldTotal: number,
  { includingTaxPrice, quantity }: CartProduct['values']
) => {
  const includingTaxPriceForOne = includingTaxPrice * quantity;
  return oldTotal + includingTaxPriceForOne;
};

const toValues = ({ values }: CartProduct) => values;

class CartProduct {
  readonly values = Object.freeze({
    ...this.params,
    includingTaxPrice: calculateIncludingTaxPrice(this.params),
  });

  constructor(
    private readonly params: {
      readonly name: string;
      readonly quantity: number;
      readonly tax: number;
      readonly excludingTaxPrice: number;
    }
  ) {}
}

const calculateIncludingTaxPrice = ({
  excludingTaxPrice,
  tax,
}: CartProduct['params']) => excludingTaxPrice + tax;


