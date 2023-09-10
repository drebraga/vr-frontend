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
import { ToastrService } from 'ngx-toastr';

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
    private StoresService: StoresService,
    private toastr: ToastrService
  ) {
    this.hidden = false;
    this.store = {
      loja: { id: 0, descricao: '' },
      precoVenda: '',
    };
    this.storeForm = this.formBuilder.group({
      loja: this.store.loja,
      precoVenda: [
        this.store.precoVenda,
        [
          Validators.pattern('^[0-9,]*$'),
          this.custoPrecisionValidator(13, 3),
          this.custoNoDot(),
        ],
      ],
    });
    this.precoVendaControl = this.storeForm.get('precoVenda');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['store']) {
      this.updateFormWithStoreData();
    }
  }

  ngOnInit(): void {
    this.StoresService.getStores().subscribe((stores: Store[]) => {
      this.stores = stores;
    });
  }

  private updateFormWithStoreData(): void {
    if (this.store.loja.id) {
      this.storeForm.updateValueAndValidity();
      this.storeForm.setValue({
        loja: { id: this.store.loja.id, descricao: this.store.loja.descricao },
        precoVenda: this.store.precoVenda.replace('.', ','),
      });
    }
    const lojaControl = this.storeForm.get('loja');
    if (lojaControl && this.store.loja.id) {
      lojaControl.setValue(this.store.loja);
    }
  }

  private clearFormData(): void {
    this.storeForm.setValue({
      loja: '',
      precoVenda: '',
    });
  }

  getStoreProducts(): StorePriced[] {
    return this.StoreProductService.getStorePrices();
  }

  insertStore(): void {
    const storeToInsert = this.storeForm.value as {
      precoVenda: string;
      loja: { id: number; descricao: string };
    };
    const storesAlreadyPriced = this.StoreProductService.getStorePrices().some(
      (s) => s.loja.id === storeToInsert.loja.id
    );
    const conditional =
      storeToInsert.loja.id &&
      +storeToInsert.precoVenda.replace(',', '.') &&
      !isNaN(storeToInsert.loja.id) &&
      !isNaN(+storeToInsert.precoVenda.replace(',', '.')) &&
      !this.storeForm.get('precoVenda')?.hasError('invalidCustoFormat') &&
      !this.storeForm.get('precoVenda')?.hasError('invalidCustoPrecision');
    if (
      this.store.loja.id &&
      (!storesAlreadyPriced || storeToInsert.loja.id === this.store.loja.id) &&
      conditional
    ) {
      this.StoreProductService.updateStoreRequisitionObj(
        this.store.loja.id,
        storeToInsert
      );
      this.StoreProductService.notifyUpdateStoreProducts();
      this.StoreModalService.toggleStoreModal();
      this.clearFormData();
      this.toastr.success('Loja atualizada!');
      return;
    } else if (!storesAlreadyPriced && conditional) {
      this.StoreProductService.insertStoreRequisitionObj(storeToInsert);
      this.StoreProductService.notifyUpdateStoreProducts();
      this.StoreModalService.toggleStoreModal();
      this.clearFormData();
      this.toastr.success('Loja adicionada!');
      return;
    } else if (storesAlreadyPriced) {
      this.toastr.error(
        'Não é permitido mais que um preço de venda para a mesma loja.'
      );
    } else {
      this.toastr.error(
        'Um ou mais campos obrigatórios não foram preenchidos corretamente.'
      );
    }
  }

  formatCusto(): void {
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

  custoPrecisionValidator(
    precision: number,
    scale: number
  ): ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const custoParts = control.value.toString().split(',');

      if (custoParts.length === 1) {
        return null;
      }

      if (!/^-?\d+(,\d*)?$/.test(control.value)) {
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

  custoNoDot(): ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      if (control.value.toString().includes('.')) {
        return { invalidCustoPrecision: true };
      }

      return null;
    };
  }

  getHidden(): boolean {
    return this.StoreModalService.getStoreModal();
  }

  toggle(): void {
    this.clearFormData();
    this.StoreModalService.toggleStoreModal();
  }
}
