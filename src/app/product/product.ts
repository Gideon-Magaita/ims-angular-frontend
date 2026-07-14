import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Api } from '../service/api';
import { Router } from '@angular/router';
import { Pagination } from '../pagination/pagination';

@Component({
  selector: 'app-product',
  imports: [CommonModule,FormsModule,Pagination],
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class Product implements OnInit {

  constructor(
    private api:Api,
    private router:Router,
    private cdr:ChangeDetectorRef
  ){}
  products: any[] = [];
  message:string = '';
  currentPage:number = 1;
  totalPages:number = 1;
  itemsPerPage:number = 10;


  ngOnInit():void{
   this.fetchProducts();
  }

  //FETCH PRODUCTS
  fetchProducts():void{
    this.api.getAllProducts().subscribe({
      next:(res:any)=>{
        const products = res.products || [];
        console.log(products[0].imageUrl)
        this.totalPages = Math.ceil(products.length/this.itemsPerPage);
        this.products = products.slice(
          (this.currentPage-1)*this.itemsPerPage,
          this.currentPage * this.itemsPerPage
        );

        this.cdr.detectChanges(); // Force view update
      },
      error:(error) =>{
            this.showMessage(error?.error?.message || error?.message || "Unable to fetch products" + error)
      }
    })
  }

  //DELETE PRODUCTS
  handleProductDelete(productId:string){
    if (window.confirm("Are you sure you want to delete this product?")) {
          this.api.deleteProduct(productId).subscribe({
            next:(res:any) =>{
              if (res.status === 200) {
                this.showMessage("Product deleted successfully")
                this.fetchProducts(); //reload the product
                this.cdr.detectChanges(); // Force view update
              }
            },
            error:(error) =>{
              this.showMessage(error?.error?.message || error?.message || "Unable to Delete product" + error)
            }
          })
        }

  }


  //HANDLE PAGE CHANGE//NAVIGATE TO NEXT,SPECIFIC AND PREVIOUS PAGE
  onPageChange(page:number):void{
    this.currentPage=page;
    this.fetchProducts();
  }

  //NAVIGATE TO ADD PRDUCT PAGE
  navigateToAddProductPage():void{
    this.router.navigate(['/add-product']);
  }

  //NAVIGATE TO EDIT PRODUCT PAGE
 navigateToEditProductPage(productId:string):void{
    this.router.navigate([`/edit-product/${productId}`]);
  }


  showMessage(message:string){
    this.message = message;
    setTimeout(()=>{
      this.message == ''
    },1000)
  }
}
