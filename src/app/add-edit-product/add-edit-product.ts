import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Api } from '../service/api';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-edit-product',
  imports: [CommonModule,FormsModule],
  templateUrl: './add-edit-product.html',
  styleUrl: './add-edit-product.css',
})
export class AddEditProduct implements OnInit {

  constructor(
    private api:Api,
    private router:Router,
    private route:ActivatedRoute,
    private cdr:ChangeDetectorRef
  ){}


  productId:string | null = null;
  categoryId:string = '';
  name:string = '';
  sku:string = '';
  price:string = '';
  stockQuantity:string = '';
  description:string = '';
  imageFile:File | null = null;
  imageUrl:string = '';
  categories:any[]=[];

  message:string='';
  isEditing:boolean = false;


 ngOnInit(): void {
   this.productId = this.route.snapshot.paramMap.get('productId');
   this.fetchCategories();
    if(this.productId){
      this.isEditing = true;
      this.fetchProductById(this.productId);
    }
 }


 //get categories
 fetchCategories():void{
  this.api.getAllCategory().subscribe({
     next:(res:any)=>{
      if(res.status===200){
        this.categories=res.categories
      }
     },
     error:(error)=>{
        this.showMessage(error?.error?.message || error?.message || "Unable to load categories" + error)
     }
  })

 }


 //Get product by id
  fetchProductById(productId:string):void{
  this.api.getProductById(productId).subscribe({
     next:(res:any)=>{
      if(res.status===200){
        const product=res.product;
        this.name = product.name;
        this.sku = product.sku;
        this.price = product.price;
        this.categoryId = product.categoryId;
        this.stockQuantity = product.stockQuantity;
        this.description = product.description;
        this.imageUrl = product.imageUrl;
      }else{
        this.showMessage(res.message)
      }

      this.cdr.detectChanges();
      
     },
     error:(error)=>{
        this.showMessage(error?.error?.message || error?.message || "Unable to load categories" + error)
     }
  })

 }


 handleImageChange(event: Event):void{
    const input = event.target as HTMLInputElement;
    if (input?.files?.[0]) {
      this.imageFile = input.files[0]
      const reader = new FileReader();
      reader.onloadend = () =>{
        this.imageUrl = reader.result as string
      }
      reader.readAsDataURL(this.imageFile);
    }
  }


  handleSubmit(event : Event):void{
    event.preventDefault()
    const formData = new FormData();
    formData.append("name", this.name);
    formData.append("sku", this.sku);
    formData.append("price", this.price);
    formData.append("stockQuantity", this.stockQuantity);
    formData.append("categoryId", this.categoryId);
    formData.append("description", this.description);

    if (this.imageFile) {
      formData.append("imageFile", this.imageFile);
    }

    if (this.isEditing) {
      formData.append("productId", this.productId!);
      this.api.updateProduct(formData).subscribe({
        next:(res:any) =>{
          if (res.status === 200) {
            this.showMessage("product updated successfully")
            this.router.navigate(['/product'])
          }
        },
        error:(error) =>{
          this.showMessage(error?.error?.message || error?.message || "Unable to update a product" + error)
        }})
    }else{
      this.api.addProduct(formData).subscribe({
        next:(res:any) =>{
          if (res.status === 200) {
            this.showMessage("Product Saved successfully")
            this.router.navigate(['/product'])
          }
        },
        error:(error) =>{
          this.showMessage(error?.error?.message || error?.message || "Unable to save a product" + error)
        }})

    }

  }


 showMessage(message:string){
    this.message = message;
    setTimeout(()=>{
      this.message == ''
    },400)
  }

}
