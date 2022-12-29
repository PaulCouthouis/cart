import { add } from 'src/utils/number';
import { CartProduct } from './cart-product';

export class Cart {
  readonly onlyTaxTotal = this.products.reduce(toOnlyTaxTotal, 0);
  readonly includingTaxTotal = this.products.reduce(toIncTaxTotal, 0);
  readonly productLines = this.products.length;
  readonly printedProducts = this.products.map(toPrinted);

  constructor(readonly products: Array<CartProduct>) {}
}

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

const toPrinted = (cartProduct: CartProduct) => cartProduct.print();
