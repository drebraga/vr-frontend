import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products/products.service';
import { Product } from '../../models/product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.css'],
})
export class ProdutoComponent implements OnInit {
  products: Product[] = [];
  product = {} as Product;

  constructor(
    private router: Router,
    private ProductsService: ProductsService
  ) {}
  ngOnInit() {
    this.ProductsService.setProduct(this.product);
    this.ProductsService.getProducts().subscribe((products: Product[]) => {
      this.products = products;
    });
  }

  redirectToProductRegister() {
    this.router.navigate(['/', 'produto', 'cadastro']);
  }

  getProducts() {
    this.ProductsService.getProducts().subscribe((products: Product[]) => {
      this.products = products;
    });
  }
}
