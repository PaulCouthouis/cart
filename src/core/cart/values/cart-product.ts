import { add, ceilTo } from 'src/utils/number';

export class CartProduct {
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

const ROUND_COEFF = 20;

const TAX_PERCENT_BY_TYPE = {
  essential: 0,
  book: 0.1,
  other: 0.2,
};

export type ProductType = 'essential' | 'book' | 'other';
export type PrintedCartProduct = ReturnType<CartProduct['print']>;
