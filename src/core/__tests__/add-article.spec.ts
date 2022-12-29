import { Cart } from '../cart/cart';
import { CartProduct, ProductType } from '../cart/cart-product';

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

type PrintedCartProduct = ReturnType<CartProduct['print']>;

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
