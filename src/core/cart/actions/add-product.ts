import { BehaviorSubject } from 'rxjs';
import { CartRepository } from '../ports/repository';
import { Cart } from '../values/cart';
import { ProductType } from '../values/cart-product';

export class AddProductInCart {
  constructor(
    private readonly cartRepository: CartRepository,
    private cart$: BehaviorSubject<Cart>
  ) {}

  handle(addedProduct: AddProductInput) {
    this.cartRepository.addProduct(addedProduct);
    this.cart$.next(this.cartRepository.render());
  }
}

export type AddProductInput = {
  name: string;
  quantity: number;
  excludingTaxPrice: number;
  type: ProductType;
  isImported: boolean;
};
