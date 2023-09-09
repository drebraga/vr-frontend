import { DecimalPipe } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Store, StorePriced } from 'src/app/models/store';
import { StoreModalService } from 'src/app/services/store-modal/store-modal.service';
import { StoreProductsService } from 'src/app/services/store-products/store-products.service';
import { StoresService } from 'src/app/services/stores/stores.service';

@Component({
  selector: 'app-store-modal',
  templateUrl: './store-modal.component.html',
  styleUrls: ['./store-modal.component.css'],
})
export class StoreModalComponent implements OnInit, OnChanges {
  @Input() store: StorePriced;
  hidden: boolean;
  storeForm: FormGroup;
  precoVendaControl: AbstractControl | null;
  stores: Store[] = [];

  constructor(
    private StoreModalService: StoreModalService,
    private StoreProductService: StoreProductsService,
    private formBuilder: FormBuilder,
    private decimalPipe: DecimalPipe,
    private StoresService: StoresService
  ) {
    this.hidden = false;
    this.store = {
      loja: { id: 0, descricao: '' },
      precoVenda: '',
    };
    this.storeForm = this.formBuilder.group({
      loja: '',
      precoVenda: [
        '',
        [Validators.pattern('^[0-9,]*$'), this.custoPrecisionValidator(13, 3)],
      ],
    });
    this.precoVendaControl = this.storeForm.get('precoVenda');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['store']) {
      this.updateFormWithStoreData();
    }
  }

  ngOnInit() {
    this.StoresService.getStores().subscribe((stores: Store[]) => {
      this.stores = stores;
    });
  }

  private updateFormWithStoreData() {
    if (this.store) {
      this.storeForm.patchValue({
        loja: { id: this.store.loja.id, descricao: this.store.loja.descricao },
        precoVenda: this.store.precoVenda.replace('.', ','),
      });
    }
    const lojaControl = this.storeForm.get('loja');
    if (lojaControl && this.store.loja.id) {
      lojaControl.setValue(this.store.loja);
    }
  }

  getStoreProducts() {
    return this.StoreProductService.getStorePrices();
  }

  insertStore() {
    const store = this.storeForm.value as {
      precoVenda: string;
      loja: { id: number; descricao: string };
    };
    if (
      store.loja.id &&
      +store.precoVenda.replace(',', '.') &&
      !isNaN(store.loja.id) &&
      !isNaN(+store.precoVenda.replace(',', '.'))
    ) {
      this.StoreProductService.insertStoreRequisitionObj(store);
      this.StoreProductService.notifyUpdateStoreProducts();
      this.StoreModalService.toggleStoreModal();
    }
  }

  formatCusto() {
    if (
      this.precoVendaControl !== null &&
      this.precoVendaControl.value !== null
    ) {
      const formattedValue = this.decimalPipe.transform(
        this.precoVendaControl.value,
        '1.2-2'
      );
      this.precoVendaControl.setValue(formattedValue);
    }
  }

  custoPrecisionValidator(precision: number, scale: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const custoParts = control.value.toString().split(',');

      if (custoParts.length !== 2) {
        return { invalidCustoFormat: true };
      }

      const integerPart = custoParts[0];
      const decimalPart = custoParts[1];

      if (
        integerPart.length > precision - scale ||
        decimalPart.length > scale
      ) {
        return { invalidCustoPrecision: true };
      }

      return null;
    };
  }

  getHidden() {
    return this.StoreModalService.getStoreModal();
  }

  toggle() {
    const lojaControl = this.storeForm.get('loja');
    const precoVendaControl = this.storeForm.get('precoVenda');

    if (lojaControl && precoVendaControl) {
      lojaControl.setValue('');
      precoVendaControl.setValue('');
    }

    this.StoreModalService.toggleStoreModal();
  }
}
