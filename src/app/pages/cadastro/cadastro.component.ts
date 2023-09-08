import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Product } from 'src/app/models/product';
import { ProductsService } from 'src/app/services/products/products.service';
import { DecimalPipe } from '@angular/common';
import { StoreModalService } from 'src/app/services/store-modal/store-modal.service';
import { StoreProductsService } from 'src/app/services/store-products/store-products.service';
import { FullProduct } from 'src/app/models/full-product';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css'],
})
export class CadastroComponent implements OnInit {
  productForm: FormGroup;
  product: FullProduct = { id: 0, descricao: '', lojas: [] };
  custoControl: AbstractControl | null;

  constructor(
    private ProductsService: ProductsService,
    private formBuilder: FormBuilder,
    private decimalPipe: DecimalPipe,
    private StoreModalService: StoreModalService,
    private StoreProductService: StoreProductsService
  ) {
    this.productForm = this.formBuilder.group({
      codigo: [
        {
          value: '',
          disabled: true,
        },
      ],
      descricao: [
        this.product.descricao,
        [Validators.required, Validators.maxLength(60)],
      ],
      custo: [
        this.product.custo?.replace('.', ','),
        [Validators.pattern('^[0-9,]*$'), this.custoPrecisionValidator(13, 3)],
      ],
    });

    this.custoControl = this.productForm.get('custo');
  }

  ngOnInit() {
    if (this.ProductsService.getProduct().id) {
      this.StoreProductService.getProduct(
        this.ProductsService.getProduct().id
      ).subscribe((product: FullProduct) => {
        this.product = product;

        this.productForm = this.formBuilder.group({
          codigo: [
            {
              value: this.product.id.toString().padStart(6, '0'),
              disabled: true,
            },
          ],
          descricao: [
            this.product.descricao,
            [Validators.required, Validators.maxLength(60)],
          ],
          custo: [
            this.product.custo?.replace('.', ','),
            [
              Validators.pattern('^[0-9,]*$'),
              this.custoPrecisionValidator(13, 3),
            ],
          ],
        });
      });
    }
  }

  formatCusto() {
    if (this.custoControl !== null && this.custoControl.value !== null) {
      const formattedValue = this.decimalPipe.transform(
        this.custoControl.value,
        '1.2-2'
      );
      this.custoControl.setValue(formattedValue);
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

  formatPV(cost: string): string {
    return cost.replace(/0$/, '').replace('.', ',');
  }

  toggleModal() {
    this.StoreModalService.toggleStoreModal();
  }
}
