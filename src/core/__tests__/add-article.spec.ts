import { BehaviorSubject } from 'rxjs';
import { Cart } from '../cart/values/cart';
import { CartProduct } from '../cart/values/cart-product';
import { CartRepository } from '../cart/ports/repository';
import { AddProductInCart, AddProductInput } from '../cart/actions/add-product';

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
  const cartRepository = new FakeCartRepository();
  const cart$ = new BehaviorSubject<Cart>(new Cart([]));

  const addProductInCart = new AddProductInCart(cartRepository, cart$);

  const givenCartWithProducts = (initialProducts: Array<AddProductInput>) => {
    cartRepository.init(initialProducts);
  };

  const whenAddProduct = (addedProduct: AddProductInput) => {
    addProductInCart.handle(addedProduct);
  };

  const thenIncludingTaxTotalIs = (expectedTotal: number) => {
    expect(cart$.getValue().includingTaxTotal).toBe(expectedTotal);
  };

  const thenOnlyTaxTotalIs = (expectedTotal: number) => {
    expect(cart$.getValue().onlyTaxTotal).toBe(expectedTotal);
  };

  const thenProductLinesEqual = (expectedProductLines: number) => {
    expect(cart$.getValue().productLines).toBe(expectedProductLines);
  };

  const thenProductsInCartAre = (
    expectedProducts: Array<PrintedCartProduct>
  ) => {
    expect(cart$.getValue().printProducts()).toEqual(expectedProducts);
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

class FakeCartRepository implements CartRepository {
  private currentProducts: Array<CartProduct> = [];

  init(initialProducts: Array<AddProductInput>) {
    this.currentProducts = initialProducts.map(toCartProduct);
  }

  addProduct(addedProduct: AddProductInput) {
    this.currentProducts = [
      ...this.currentProducts,
      toCartProduct(addedProduct),
    ];
  }

  render() {
    return new Cart(this.currentProducts);
  }
}

type PrintedCartProduct = ReturnType<CartProduct['print']>;

const toCartProduct = ({
  name,
  quantity,
  excludingTaxPrice,
  type,
  isImported,
}: AddProductInput): CartProduct => {
  return new CartProduct(name, quantity, excludingTaxPrice, type, isImported);
};
