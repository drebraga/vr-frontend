import { Component, Input } from '@angular/core';
import { Product } from 'src/app/models/product';
import { ProdutoComponent } from 'src/app/pages/produto/produto.component';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-item-product',
  templateUrl: './item-product.component.html',
  styleUrls: ['./item-product.component.css'],
})
export class ItemProductComponent {
  @Input() item: any;

  constructor(
    private ProductComponent: ProdutoComponent,
    private ProductsService: ProductsService
  ) {}

  deleteProduct(item: Product) {
    this.ProductsService.deleteProduct(item).subscribe(() => {
      this.ProductComponent.getProducts();
    });
  }

  costFormat(cost?: string): string {
    if (cost && typeof cost === 'string') {
      return cost.replace(/0$/, '').replace('.', ',');
    }
    return 'N/A';
  }
}
