import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ProductsService } from 'src/app/services/products/products.service';
import { DecimalPipe } from '@angular/common';
import { StoreModalService } from 'src/app/services/store-modal/store-modal.service';
import { StoreProductsService } from 'src/app/services/store-products/store-products.service';
import { FullProduct } from 'src/app/models/full-product';
import { StorePriced } from 'src/app/models/store';
import { Product } from 'src/app/models/product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css'],
})
export class CadastroComponent implements OnInit {
  productForm: FormGroup;
  product: FullProduct = {
    id: 0,
    descricao: '',
    lojas: [],
  };
  custoControl: AbstractControl | null;
  storeProducts: {
    precoVenda: string;
    loja: { id: number; descricao: string };
  }[] = [];
  selectedStore: StorePriced;

  constructor(
    private ProductsService: ProductsService,
    private formBuilder: FormBuilder,
    private decimalPipe: DecimalPipe,
    private StoreModalService: StoreModalService,
    private StoreProductService: StoreProductsService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.selectedStore = {
      loja: { id: 0, descricao: '' },
      precoVenda: '',
    };
    this.productForm = this.formBuilder.group({
      codigo: [
        {
          value: '',
          disabled: true,
        },
      ],
      descricao: ['', [Validators.required, Validators.maxLength(60)]],
      custo: [
        '',
        [Validators.pattern('^[0-9,]*$'), this.custoPrecisionValidator(13, 3)],
      ],
      imagem:
        typeof this.product.imagem === 'string'
          ? this.base64ToFile(this.product.imagem, 'imagem')
          : null,
    });
    this.custoControl = this.productForm.get('custo');
    this.StoreProductService.updateStoreProducts$.subscribe(() => {
      this.storeProducts = this.StoreProductService.getStorePrices();
    });
  }

  ngOnInit() {
    this.StoreProductService.clearStorePrices();

    if (this.ProductsService.getProduct().id) {
      this.StoreProductService.getProduct(
        this.ProductsService.getProduct().id
      ).subscribe((product: FullProduct) => {
        this.product = product;
        this.product.lojas.map((store) => {
          this.StoreProductService.insertStoreRequisitionObj(store);
        });
        this.storeProducts = this.StoreProductService.getStorePrices();
        this.updateFormWithStoreData();
      });
    }
  }

  private updateFormWithStoreData() {
    if (this.product) {
      this.productForm.setValue({
        codigo: this.product.id.toString().padStart(6, '0'),
        descricao: this.product.descricao,
        custo: this.product.custo?.replace('.', ','),
        imagem: this.product.imagem
          ? this.base64ToFile(this.product.imagem, 'imagem')
          : null,
      });
    }
  }

  saveOrUpdateProduct() {
    this.productForm.updateValueAndValidity();

    const productToSave = this.StoreProductService.saveRequisitionProductObj(
      this.productForm
    );

    //inserir os filtros para salvar produto e chamar toast

    if (this.productForm.get('codigo')?.value && productToSave) {
      const id = this.productForm.get('codigo')?.value;
      this.ProductsService.updateProduct(id, productToSave);
      this.router.navigate(['/', 'produto']);
    } else if (productToSave) {
      this.ProductsService.saveProduct(productToSave);
      this.router.navigate(['/', 'produto']);
    }
  }

  deleteStore(store: {
    precoVenda: string;
    loja: { id: number; descricao: string };
  }) {
    this.StoreProductService.deleteStoreProduct(store.loja.id);
    this.StoreProductService.notifyUpdateStoreProducts();
  }

  deleteProduct() {
    const productToDelete = {
      id: this.product.id,
      descricao: this.product.descricao,
      imagem: this.product?.imagem,
      custo: this.product?.custo,
    } as Product;
    this.ProductsService.deleteProduct(productToDelete).subscribe(() => {
      this.router.navigate(['/', 'produto']);
    });
  }

  redirectToStoreEdit(store: {
    precoVenda: string;
    loja: { id: number; descricao: string };
  }) {
    this.selectedStore = store;
    this.StoreModalService.notifyUpdateStorePriced();
    this.StoreModalService.toggleStoreModal();
  }

  async resolveFile(event: Event) {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      this.product.imagem = await this.fileToBase64(file);
      this.StoreProductService.saveImageProductObj(this.product.imagem);
    }
  }

  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result as string);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  }

  base64ToFile(base64: string, filename: string): File {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
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
