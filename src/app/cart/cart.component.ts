import { Component, Input } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Cart } from 'src/core/cart/values/cart';
import { PrintedCartProduct } from 'src/core/cart/values/cart-product';

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr, 'fr');

@Component({
  selector: 'app-cart',
  template: `
    <p *ngIf="isEmpty$ | async; else productLines" role="status">Panier vide</p>
    <ng-template #productLines>
      <ul>
        <li *ngFor="let product of products$ | async; index as i">
          <span>
            <strong>{{ product.name }}</strong>
          </span>
          <span>
            Quantité :
            <strong>{{ product.quantity }}</strong>
          </span>
          <span>
            Taxes :
            <strong>{{
              product.tax | currency : 'EUR' : 'symbol' : '1.2-2' : 'fr'
            }}</strong>
          </span>
          <span>
            Prix Unitaire HT :
            <strong>{{
              product.excludingTaxPrice
                | currency : 'EUR' : 'symbol' : '1.2-2' : 'fr'
            }}</strong>
          </span>
          <span>
            Prix Unitaire TTC :
            <strong>{{
              product.includingTaxPrice
                | currency : 'EUR' : 'symbol' : '1.2-2' : 'fr'
            }}</strong>
          </span>
        </li>
      </ul>
    </ng-template>
    <div>
      <p>
        {{
          onlyTaxTotal$ | async | currency : 'EUR' : 'symbol' : '1.2-2' : 'fr'
        }}
      </p>
    </div>
    <div>
      <p>
        {{
          includingTaxTotal$
            | async
            | currency : 'EUR' : 'symbol' : '1.2-2' : 'fr'
        }}
      </p>
    </div>
  `,
  styles: [],
})
export class CartComponent {
  @Input() cart$ = new BehaviorSubject<Cart>(new Cart([]));

  isEmpty$ = this.cart$.pipe(prop('productLines'), isEqualZero);
  products$ = this.cart$.pipe<PrintedCartProduct[]>(prop('printedProducts'));
  onlyTaxTotal$ = this.cart$.pipe<number>(prop('onlyTaxTotal'));
  includingTaxTotal$ = this.cart$.pipe<number>(prop('includingTaxTotal'));
}

const prop = <T, R>(key: keyof T) => {
  return map((o: T) => o[key] as R);
};

const isEqualZero = map((n: number) => n === 0);
