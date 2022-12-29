import { AddProductInput } from '../actions/add-product';
import { Cart } from '../values/cart';

export interface CartRepository {
  addProduct(addedProduct: AddProductInput): void;
  render(): Cart;
}
