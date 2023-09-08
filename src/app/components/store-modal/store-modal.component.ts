import { DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { StoreModalService } from 'src/app/services/store-modal/store-modal.service';

@Component({
  selector: 'app-store-modal',
  templateUrl: './store-modal.component.html',
  styleUrls: ['./store-modal.component.css'],
})
export class StoreModalComponent {
  hidden: boolean;
  storeForm: FormGroup;
  precoVendaControl: AbstractControl | null;

  constructor(
    private StoreModalService: StoreModalService,
    private formBuilder: FormBuilder,
    private decimalPipe: DecimalPipe
  ) {
    this.storeForm = this.formBuilder.group({
      loja: ['', Validators.required],
      preco: [
        '',
        [Validators.pattern('^[0-9,]*$'), this.custoPrecisionValidator(13, 3)],
      ],
    });
    this.hidden = false;
    this.precoVendaControl = this.storeForm.get('preco');
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
    this.StoreModalService.toggleStoreModal();
  }
}
