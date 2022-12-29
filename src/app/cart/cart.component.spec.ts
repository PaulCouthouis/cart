import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartComponent } from './cart.component';

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
    const noProductStatus = fixture.nativeElement.querySelector(
      'p[role="status"]'
    ) as Element;

    expect(noProductStatus.textContent).toContain('Panier vide');
  });
});
