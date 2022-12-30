import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartComponent } from './cart.component';
import { Cart } from 'src/core/cart/values/cart';
import { CartProduct } from 'src/core/cart/values/cart-product';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display no product status', () => {
    const status = fixture.nativeElement.querySelector(
      'p[role="status"]'
    ) as Element;

    expect(status.textContent).toContain('Panier vide');
  });

  it('should display added product list', () => {
    component.cart$.next(
      new Cart([
        new CartProduct('Book', 1, 1, 'book', false),
        new CartProduct('Apple', 2, 2, 'essential', true),
      ])
    );

    fixture.detectChanges();

    const productList = fixture.nativeElement.querySelectorAll(
      'li'
    ) as Element[];
    const nameElement = productList[0].querySelectorAll('span')[0];

    expect(productList.length).toBe(2);
    expect(nameElement.textContent).toBe('Book');
  });
});
