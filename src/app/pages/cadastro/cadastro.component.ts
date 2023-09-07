import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Product } from 'src/app/models/product';
import { ProductsService } from 'src/app/services/products.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css'],
})
export class CadastroComponent implements OnInit {
  productForm: FormGroup;
  product: Product;
  custoControl: AbstractControl | null;

  constructor(
    private ProductsService: ProductsService,
    private formBuilder: FormBuilder,
    private decimalPipe: DecimalPipe
  ) {
    this.product = this.ProductsService.getProduct();
    this.productForm = this.formBuilder.group({
      codigo: [
        {
          value: !this.product.id
            ? ''
            : this.product.id.toString().padStart(6, '0'),
          disabled: true,
        },
      ],
      descricao: [
        this.product.descricao,
        [Validators.required, Validators.maxLength(60)],
      ],
      custo: [
        this.product.custo?.replace('.', ','),
        [Validators.pattern('^[0-9,]*$'), Validators.maxLength(13)],
      ],
    });

    this.custoControl = this.productForm.get('custo');
  }

  ngOnInit() {}

  formatCusto() {
    if (this.custoControl !== null && this.custoControl.value !== null) {
      const formattedValue = this.decimalPipe.transform(
        this.custoControl.value,
        '1.2-2'
      );
      this.custoControl.setValue(formattedValue);
    }
  }
}
