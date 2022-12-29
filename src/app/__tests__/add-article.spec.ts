describe('Use Case: Add product in cart', () => {
  it('should add new product in cart', () => {
    const {
      givenCartWithProducts,
      whenAddProduct,
      thenIncludingTaxTotalIs,
      thenOnlyTaxTotalIs,
      thenProductLinesEqual,
      thenProductsInCartAre,
    } = setup();

    givenCartWithProducts([
      {
        name: 'Apple - Fuji',
        quantity: 2,
        excludingTaxPrice: 4.37,
        type: 'essential',
        isImported: false,
      },
      {
        name: 'The Stranger in the Lifeboat',
        quantity: 1,
        excludingTaxPrice: 16.38,
        type: 'book',
        isImported: false,
      },
    ]);

    whenAddProduct({
      name: 'USB Flash Drive 64GB',
      quantity: 1,
      excludingTaxPrice: 9.18,
      type: 'other',
      isImported: true,
    });

    thenProductLinesEqual(3);
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
      {
        name: 'USB Flash Drive 64GB',
        quantity: 1,
        tax: 2.35,
        excludingTaxPrice: 9.18,
        includingTaxPrice: 11.53,
      },
    ]);
    thenOnlyTaxTotalIs(4);
    thenIncludingTaxTotalIs(38.3);
  });
});

const setup = () => {
  let cartProducts: Array<CartProduct>;
  let cart: Cart;

  const givenCartWithProducts = (initialProducts: Array<AddProductInput>) => {
    cartProducts = initialProducts.map(toCartProduct);
  };

  const whenAddProduct = (addedProduct: AddProductInput) => {
    const newCartProduct = toCartProduct(addedProduct);
    cart = new Cart([...cartProducts, newCartProduct]);
  };

  const thenIncludingTaxTotalIs = (expectedTotal: number) => {
    expect(cart.includingTaxTotal).toBe(expectedTotal);
  };

  const thenOnlyTaxTotalIs = (expectedTotal: number) => {
    expect(cart.onlyTaxTotal).toBe(expectedTotal);
  };

  const thenProductLinesEqual = (expectedProductLines: number) => {
    expect(cart.productLines).toBe(expectedProductLines);
  };

  const thenProductsInCartAre = (
    expectedProducts: Array<PrintedCartProduct>
  ) => {
    expect(cart.printProducts()).toEqual(expectedProducts);
  };

  return {
    givenCartWithProducts,
    whenAddProduct,
    thenIncludingTaxTotalIs,
    thenOnlyTaxTotalIs,
    thenProductLinesEqual,
    thenProductsInCartAre,
  };
};

class Cart {
  readonly onlyTaxTotal = this.products.reduce(toOnlyTaxTotal, 0);
  readonly includingTaxTotal = this.products.reduce(toIncTaxTotal, 0);
  readonly productLines = this.products.length;

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

type ProductType = 'essential' | 'book' | 'other';

class CartProduct {
  private readonly taxPercent = TAX_PERCENT_BY_TYPE[this.type];
  readonly tax = calculateTax(
    this.excludingTaxPrice,
    this.taxPercent,
    this.isImported
  );
  readonly includingTaxPrice = add(this.tax, this.excludingTaxPrice);

  constructor(
    readonly name: string,
    readonly quantity: number,
    readonly excludingTaxPrice: number,
    private readonly type: ProductType,
    private readonly isImported: boolean
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

const calculateTax = (
  excludingTaxPrice: number,
  vatTaxPercent: number,
  isImported: boolean
) => {
  const vat = calculateVat(excludingTaxPrice, vatTaxPercent);
  const importedTax = isImported ? calculateImportedTax(excludingTaxPrice) : 0;

  return add(vat, importedTax);
};

const calculateVat = (excludingTaxPrice: number, vatTaxPercent: number) => {
  const multiplied = excludingTaxPrice * vatTaxPercent;
  return ceilTo(multiplied, ROUND_COEFF);
};

const calculateImportedTax = (excludingTaxPrice: number) => {
  const multiplied = excludingTaxPrice * 0.05;
  return ceilTo(multiplied, ROUND_COEFF);
};

const ceilTo = (n: number, coeff: number) => Math.ceil(n * coeff) / coeff;

const ROUND_COEFF = 20;

const TAX_PERCENT_BY_TYPE = {
  essential: 0,
  book: 0.1,
  other: 0.2,
};

const add = (n1: number, n2: number) => {
  const n = n1 + n2;
  return Number(n.toFixed(2)); // fix javascript decimal addition (0.1 + 0.2 !== 0.299999999)
};

type AddProductInput = {
  name: string;
  quantity: number;
  excludingTaxPrice: number;
  type: ProductType;
  isImported: boolean;
};

const toCartProduct = ({
  name,
  quantity,
  excludingTaxPrice,
  type,
  isImported,
}: AddProductInput): CartProduct => {
  return new CartProduct(name, quantity, excludingTaxPrice, type, isImported);
};

