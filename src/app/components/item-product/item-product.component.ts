import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { ProdutoComponent } from 'src/app/pages/produto/produto.component';
import { ProductsService } from 'src/app/services/products/products.service';

@Component({
  selector: 'app-item-product',
  templateUrl: './item-product.component.html',
  styleUrls: ['./item-product.component.css'],
})
export class ItemProductComponent {
  @Input() item: any;

  constructor(
    private ProductComponent: ProdutoComponent,
    private ProductsService: ProductsService,
    private router: Router
  ) {}

  deleteProduct(item: Product) {
    this.ProductsService.deleteProduct(item).subscribe(() => {
      this.ProductComponent.getProducts();
    });
  }

  redirectToProductEdit(product: Product) {
    this.ProductsService.setProduct(product);
    this.router.navigate(['/', 'produto', 'cadastro']);
  }

  costFormat(cost?: string): string {
    if (cost && typeof cost === 'string') {
      return cost.replace(/0$/, '').replace('.', ',');
    }
    return 'N/A';
  }
}
