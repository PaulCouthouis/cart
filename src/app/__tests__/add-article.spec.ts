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
    thenOnlyTaxTotalIs(10);
    thenIncludingTaxTotalIs(100);
  });
});

const setup = () => {
  const cart = new Cart(100, 10, [
    new AddedProduct({
      name: 'Apple - Fuji',
      quantity: 2,
      tax: 3,
      excludingTaxPrice: 15,
    }),
    new AddedProduct({
      name: 'Muffin Batt - Carrot Spice',
      quantity: 1,
      tax: 1,
      excludingTaxPrice: 4,
    }),
  ]);

  const thenIncludingTaxTotalIs = (expectedTotal: number) => {
    expect(cart.getIncludingTaxTotal()).toBe(expectedTotal);
  };

  const thenOnlyTaxTotalIs = (expectedTotal: number) => {
    expect(cart.getOnlyTaxTotal()).toBe(expectedTotal);
  };

  const thenProductsInCartAre = (expectedProducts: Array<PrintedProduct>) => {
    expect(cart.printProducts()).toEqual(expectedProducts);
  };

  return { thenIncludingTaxTotalIs, thenOnlyTaxTotalIs, thenProductsInCartAre };
};

class Cart {
  private readonly products = this.addedProducts.map(toCartProduct);

  constructor(
    private readonly includingTaxTotal: number,
    private readonly onlyTaxTotal: number,
    private readonly addedProducts: Array<AddedProduct>
  ) {}

  getIncludingTaxTotal() {
    return this.includingTaxTotal;
  }

  getOnlyTaxTotal() {
    return this.onlyTaxTotal;
  }

  printProducts() {
    return this.products.map(toPrintedProduct);
  }
}

const toCartProduct = (addedProduct: AddedProduct) =>
  new CartProduct(addedProduct.values);
const toPrintedProduct = (cartProduct: CartProduct) => cartProduct.print();

class AddedProduct {
  constructor(
    readonly values: {
      readonly name: string;
      readonly quantity: number;
      readonly tax: number;
      readonly excludingTaxPrice: number;
    }
  ) {}
}

class CartProduct extends AddedProduct {
  private readonly includingTaxPrice =
    this.values.excludingTaxPrice + this.values.tax;

  print() {
    return Object.freeze({
      ...this.values,
      includingTaxPrice: this.includingTaxPrice,
    });
  }
}

type PrintedProduct = ReturnType<CartProduct['print']>;


